"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth/actions";
import { AvatarDisplay } from "@/components/avatar-display";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-8">Who&apos;s watching?</h1>
        <div className="flex gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-24 h-24 rounded-lg" />
              <Skeleton className="w-20 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <h1 className="text-2xl font-bold mb-8">Who&apos;s watching?</h1>

      {error && (
        <p className="text-destructive mb-4" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleProfileSelect(profile.id)}
            className="flex flex-col items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-2"
            aria-label={`Select ${profile.name} profile`}
          >
            <AvatarDisplay
              avatarKey={profile.avatarKey}
              avatarUrl={profile.avatarUrl}
              name={profile.name}
              size="lg"
              className="group-hover:scale-105 transition-transform"
            />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {profile.name}
            </span>
          </button>
        ))}

        <button
          onClick={() => router.push("/profile/manage")}
          className="flex flex-col items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-2"
          aria-label="Add new profile"
        >
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center group-hover:border-foreground transition-colors">
            <span className="text-4xl text-muted-foreground group-hover:text-foreground transition-colors">
              +
            </span>
          </div>
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            Add Profile
          </span>
        </button>
      </div>

      <Button variant="outline" onClick={handleLogout}>
        Sign out
      </Button>
    </div>
  );
}
