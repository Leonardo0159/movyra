"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
];

const AVATAR_ICONS = ["👤", "🎭", "🦊", "🐱", "🦁", "🐼"];

interface AvatarDisplayProps {
  avatarKey: string | null;
  avatarUrl: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarDisplay({
  avatarKey,
  avatarUrl,
  name,
  size = "md",
  className,
}: AvatarDisplayProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-24 h-24 text-4xl",
  };

  if (avatarUrl) {
    return (
      <div className={cn("relative rounded-lg overflow-hidden", sizeClasses[size], className)} role="img" aria-label={`${name}'s avatar`}>
        <Image
          src={avatarUrl}
          alt={`${name}'s avatar`}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  const avatarIndex = avatarKey
    ? parseInt(avatarKey.replace("avatar-", ""), 10) - 1
    : 0;
  const colorIndex = Math.max(0, Math.min(avatarIndex, AVATAR_COLORS.length - 1));

  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center text-white",
        AVATAR_COLORS[colorIndex],
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={`${name}'s avatar`}
    >
      {AVATAR_ICONS[colorIndex]}
    </div>
  );
}
