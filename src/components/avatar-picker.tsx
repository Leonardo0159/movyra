"use client";

import { cn } from "@/lib/utils";

const AVATAR_OPTIONS = [
  { key: "avatar-1", color: "bg-blue-500", icon: "👤" },
  { key: "avatar-2", color: "bg-green-500", icon: "🎭" },
  { key: "avatar-3", color: "bg-purple-500", icon: "🦊" },
  { key: "avatar-4", color: "bg-orange-500", icon: "🐱" },
  { key: "avatar-5", color: "bg-pink-500", icon: "🦁" },
  { key: "avatar-6", color: "bg-teal-500", icon: "🐼" },
];

interface AvatarPickerProps {
  selectedKey: string | null;
  onSelect: (key: string) => void;
}

export function AvatarPicker({ selectedKey, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Choose an avatar">
      {AVATAR_OPTIONS.map((avatar) => (
        <button
          key={avatar.key}
          onClick={() => onSelect(avatar.key)}
          className={cn(
            "w-16 h-16 rounded-lg flex items-center justify-center text-2xl text-white transition-all",
            avatar.color,
            selectedKey === avatar.key
              ? "ring-2 ring-primary ring-offset-2 scale-110"
              : "hover:scale-105"
          )}
          role="radio"
          aria-checked={selectedKey === avatar.key}
          aria-label={`Avatar ${avatar.key}`}
          type="button"
        >
          {avatar.icon}
        </button>
      ))}
    </div>
  );
}
