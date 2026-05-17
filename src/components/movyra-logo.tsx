import { cn } from "@/lib/utils";

interface MovyraLogoProps {
  className?: string;
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg" | "xl";
}

export function MovyraLogo({ className, variant = "full", size = "md" }: MovyraLogoProps) {
  const sizeClasses = {
    sm: variant === "icon" ? "w-6 h-6" : variant === "wordmark" ? "h-4 w-auto" : "h-5 w-auto",
    md: variant === "icon" ? "w-8 h-8" : variant === "wordmark" ? "h-6 w-auto" : "h-7 w-auto",
    lg: variant === "icon" ? "w-12 h-12" : variant === "wordmark" ? "h-8 w-auto" : "h-10 w-auto",
    xl: variant === "icon" ? "w-16 h-16" : variant === "wordmark" ? "h-12 w-auto" : "h-14 w-auto",
  };

  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size], className)}
        aria-label="Movyra logo"
      >
        {/* Film frame with light beam */}
        <rect x="4" y="4" width="56" height="56" rx="4" className="fill-current opacity-10" />
        <rect x="4" y="4" width="56" height="56" rx="4" className="stroke-current" strokeWidth="2" />

        {/* Film strip holes */}
        <rect x="10" y="8" width="4" height="6" rx="1" className="fill-current opacity-40" />
        <rect x="10" y="18" width="4" height="6" rx="1" className="fill-current opacity-40" />
        <rect x="10" y="28" width="4" height="6" rx="1" className="fill-current opacity-40" />
        <rect x="10" y="38" width="4" height="6" rx="1" className="fill-current opacity-40" />
        <rect x="10" y="48" width="4" height="6" rx="1" className="fill-current opacity-40" />

        <rect x="50" y="8" width="4" height="6" rx="1" className="fill-current opacity-40" />
        <rect x="50" y="18" width="4" height="6" rx="1" className="fill-current opacity-40" />
        <rect x="50" y="28" width="4" height="6" rx="1" className="fill-current opacity-40" />
        <rect x="50" y="38" width="4" height="6" rx="1" className="fill-current opacity-40" />
        <rect x="50" y="48" width="4" height="6" rx="1" className="fill-current opacity-40" />

        {/* Stylized M - cinematic light beam */}
        <path
          d="M18 44V20L26 32L32 24L38 32L46 20V44"
          className="stroke-current"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Light beam accent */}
        <path
          d="M32 24V44"
          className="stroke-current opacity-30"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <svg
        viewBox="0 0 320 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size], className)}
        aria-label="Movyra"
      >
        {/* M */}
        <path d="M8 32V8L16 20L20 14L24 20L32 8V32" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* o */}
        <ellipse cx="44" cy="22" rx="7" ry="8" className="stroke-current" strokeWidth="2.5" fill="none" />
        {/* v */}
        <path d="M58 14L64 30L70 14" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* y */}
        <path d="M82 14L88 24L94 14" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M88 24L86 32" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* r */}
        <path d="M102 32V14H106C110 14 112 16 112 20C112 24 110 26 106 26H102" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* a */}
        <path d="M126 32V22C126 18 128 16 132 16C136 16 138 18 138 22V32" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M126 26H138" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" />

        {/* Film strip accent line */}
        <line x1="148" y1="20" x2="312" y2="20" className="stroke-current opacity-20" strokeWidth="1" />
        <rect x="152" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="160" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="168" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="176" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="184" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="192" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="200" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="208" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="216" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="224" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="232" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="240" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="248" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="256" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="264" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="272" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="280" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="288" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="296" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
        <rect x="304" y="17" width="3" height="6" rx="0.5" className="fill-current opacity-30" />
      </svg>
    );
  }

  /* full - icon + wordmark stacked */
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <MovyraLogo variant="icon" size={size === "xl" ? "lg" : size === "lg" ? "md" : "sm"} />
      <MovyraLogo variant="wordmark" size={size} />
    </div>
  );
}
