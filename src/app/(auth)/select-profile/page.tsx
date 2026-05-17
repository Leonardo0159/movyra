"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth/actions";
import { AvatarDisplay } from "@/components/avatar-display";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { MovyraLogo } from "@/components/movyra-logo";

interface Profile {
  id: string;
  name: string;
  avatarKey: string | null;
  avatarUrl: string | null;
}

export default function SelectProfilePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profiles")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profiles");
        return res.json();
      })
      .then((data) => {
        setProfiles(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profiles");
        setLoading(false);
      });
  }, []);

  const handleProfileSelect = async (profileId: string) => {
    try {
      const res = await fetch(`/api/profiles/${profileId}/switch`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to switch profile");
      router.push("/");
    } catch {
      setError("Failed to switch profile");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[oklch(0.1_0.005_45)] overflow-hidden">
        <div className="absolute inset-0 film-grain" />
        <h1 className="relative z-10 mb-8 font-heading text-3xl uppercase tracking-wider text-white">
          Who&apos;s watching?
        </h1>
        <div className="relative z-10 flex gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-24 w-24 rounded-sm bg-zinc-800" />
              <Skeleton className="h-4 w-20 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[oklch(0.1_0.005_45)] px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.01_45)] via-[oklch(0.1_0.005_45)] to-[oklch(0.08_0.01_85)]" />
      <div className="absolute inset-0 film-grain" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-amber/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber/5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        <Link href="/" className="mb-10 inline-block text-amber">
          <MovyraLogo variant="full" size="xl" />
        </Link>

        <h1 className="mb-8 font-heading text-3xl uppercase tracking-wider text-white">
          Who&apos;s watching?
        </h1>

        {error && (
          <p className="mb-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="mb-10 flex flex-wrap justify-center gap-6">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSelect(profile.id)}
              className="group flex flex-col items-center gap-3 focus:outline-none"
              aria-label={`Select ${profile.name} profile`}
            >
              <div className="overflow-hidden rounded-sm ring-2 ring-transparent transition-all duration-300 group-hover:ring-amber/50 group-hover:shadow-[0_0_30px_rgba(200,155,60,0.2)]">
                <AvatarDisplay
                  avatarKey={profile.avatarKey}
                  avatarUrl={profile.avatarUrl}
                  name={profile.name}
                  size="lg"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-sm text-zinc-400 transition-colors group-hover:text-amber">
                {profile.name}
              </span>
            </button>
          ))}

          <button
            onClick={() => router.push("/profile/manage")}
            className="group flex flex-col items-center gap-3 focus:outline-none"
            aria-label="Add new profile"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-sm border-2 border-dashed border-zinc-700 transition-all duration-300 group-hover:border-amber/50 group-hover:shadow-[0_0_20px_rgba(200,155,60,0.1)]">
              <span className="text-3xl text-zinc-600 transition-colors group-hover:text-amber">+</span>
            </div>
            <span className="text-sm text-zinc-500 transition-colors group-hover:text-amber">
              Add Profile
            </span>
          </button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-zinc-700/50 text-zinc-400 hover:border-zinc-600 hover:text-white"
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
