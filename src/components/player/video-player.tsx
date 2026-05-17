"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipForward,
  SkipBack,
} from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  startTime?: number; // in seconds
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
}

interface QualityLevel {
  index: number;
  height: number;
  bitrate: number;
  label: string;
}

export function VideoPlayer({
  src,
  poster,
  title = "Video",
  autoPlay = false,
  startTime = 0,
  onTimeUpdate,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savePositionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 = auto
  const [showSettings, setShowSettings] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Announce state for screen readers
  const [ariaAnnouncement, setAriaAnnouncement] = useState("");

  const announce = useCallback((message: string) => {
    setAriaAnnouncement(message);
    setTimeout(() => setAriaAnnouncement(""), 1000);
  }, []);

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        startLevel: -1, // Auto quality
        capLevelToPlayerSize: true,
      });
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const levels: QualityLevel[] = data.levels.map((level, index) => ({
          index,
          height: level.height,
          bitrate: level.bitrate,
          label: `${level.height}p`,
        }));
        // Sort by height descending
        levels.sort((a, b) => b.height - a.height);
        setQualityLevels(levels);
        setIsLoaded(true);

        if (autoPlay) {
          video.play().catch(() => {});
        }
        if (startTime > 0) {
          video.currentTime = startTime;
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentQuality(data.level);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls?.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls?.recoverMediaError();
          } else {
            setError("Failed to load video");
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        setIsLoaded(true);
        if (autoPlay) video.play().catch(() => {});
        if (startTime > 0) video.currentTime = startTime;
      });
    } else {
      setError("Video playback is not supported in this browser");
    }

    return () => {
      if (hls) {
        hls.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay, startTime]);

  // Play/Pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      announce("Playing");
    } else {
      video.pause();
      setIsPlaying(false);
      announce("Paused");
    }
  }, [announce]);

  // Seek
  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(video.currentTime);
  }, [duration]);

  // Volume
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    announce(video.muted ? "Muted" : "Unmuted");
  }, [announce]);

  const changeVolume = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(1, newVolume));
    video.volume = clamped;
    setVolume(clamped);
    setIsMuted(clamped === 0);
  }, []);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
      announce("Fullscreen");
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      announce("Exit fullscreen");
    }
  }, [announce]);

  // Quality selection
  const setQuality = useCallback((levelIndex: number) => {
    const hls = hlsRef.current;
    if (!hls) return;
    hls.nextLevel = levelIndex;
    setCurrentQuality(levelIndex);
    setShowSettings(false);
    announce(levelIndex === -1 ? "Auto quality" : `Quality: ${qualityLevels.find(q => q.index === levelIndex)?.label}`);
  }, [announce, qualityLevels]);

  // Playback rate
  const cyclePlaybackRate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
    announce(`Speed: ${nextRate}x`);
  }, [playbackRate, announce]);

  // Controls auto-hide
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Save playback position
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savePosition = () => {
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }
    };

    savePositionIntervalRef.current = setInterval(savePosition, 10000);

    return () => {
      if (savePositionIntervalRef.current) {
        clearInterval(savePositionIntervalRef.current);
      }
      savePosition(); // Save on unmount
    };
  }, [onTimeUpdate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekTo(currentTime - 5);
          announce("Seek back 5 seconds");
          break;
        case "ArrowRight":
          e.preventDefault();
          seekTo(currentTime + 5);
          announce("Seek forward 5 seconds");
          break;
        case "ArrowUp":
          e.preventDefault();
          changeVolume(volume + 0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          changeVolume(volume - 0.1);
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
      resetControlsTimeout();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, seekTo, currentTime, changeVolume, volume, toggleMute, toggleFullscreen, resetControlsTimeout, announce]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => { setIsPlaying(true); resetControlsTimeout(); };
    const handlePause = () => {
      setIsPlaying(false);
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onEnded, resetControlsTimeout]);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black" role="alert">
        <div className="text-center">
          <p className="font-heading text-lg uppercase tracking-wider text-zinc-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden bg-black group"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={togglePlay}
      role="region"
      aria-label={`Video player: ${title}`}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        poster={poster}
        playsInline
        aria-label={title}
      />

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber/30 border-t-amber" />
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Center play button */}
        {!isPlaying && isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="rounded-full bg-amber/20 p-6 backdrop-blur-sm transition-all hover:scale-110 hover:bg-amber/30"
              aria-label="Play"
            >
              <Play className="h-12 w-12 fill-amber text-amber" />
            </button>
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
          {/* Seek bar */}
          <div className="mb-3 flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-amber"
              aria-label="Seek"
              style={{
                background: `linear-gradient(to right, oklch(0.72 0.16 75) ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
              }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={togglePlay}
                className="rounded p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>

              <button
                onClick={() => seekTo(currentTime - 10)}
                className="rounded p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Back 10 seconds"
              >
                <SkipBack className="h-5 w-5" />
              </button>

              <button
                onClick={() => seekTo(currentTime + 10)}
                className="rounded p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Forward 10 seconds"
              >
                <SkipForward className="h-5 w-5" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleMute}
                  className="rounded p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(Number(e.target.value))}
                  className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 accent-amber"
                  aria-label="Volume"
                />
              </div>

              {/* Time display */}
              <span className="ml-2 text-sm font-mono text-white/70" aria-live="off">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Playback rate */}
              <button
                onClick={cyclePlaybackRate}
                className="rounded px-2 py-1 text-xs font-mono text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={`Playback speed: ${playbackRate}x`}
              >
                {playbackRate}x
              </button>

              {/* Settings / Quality */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="rounded p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Settings"
                  aria-expanded={showSettings}
                >
                  <Settings className="h-5 w-5" />
                </button>

                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 rounded-sm border border-zinc-700/50 bg-zinc-900/95 p-3 shadow-xl backdrop-blur-md">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Quality</p>
                    <button
                      onClick={() => setQuality(-1)}
                      className={`block w-full rounded-sm px-3 py-1.5 text-left text-sm transition-colors ${
                        currentQuality === -1 ? "bg-amber/20 text-amber" : "text-zinc-300 hover:bg-white/10"
                      }`}
                    >
                      Auto
                    </button>
                    {qualityLevels.map((level) => (
                      <button
                        key={level.index}
                        onClick={() => setQuality(level.index)}
                        className={`block w-full rounded-sm px-3 py-1.5 text-left text-sm transition-colors ${
                          currentQuality === level.index ? "bg-amber/20 text-amber" : "text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="rounded p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader announcements */}
      <div aria-live="polite" className="sr-only" role="status">
        {ariaAnnouncement}
      </div>
    </div>
  );
}
