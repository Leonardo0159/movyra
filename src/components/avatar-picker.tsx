"use client";

import { cn } from "@/lib/utils";

const AVATAR_OPTIONS = [
  { key: "avatar-1", color: "bg-amber-600", icon: "\u{1F464}" },
  { key: "avatar-2", color: "bg-emerald-600", icon: "\u{1F3AD}" },
  { key: "avatar-3", color: "bg-violet-600", icon: "\u{1F98A}" },
  { key: "avatar-4", color: "bg-orange-600", icon: "\u{1F431}" },
  { key: "avatar-5", color: "bg-rose-600", icon: "\u{1F981}" },
  { key: "avatar-6", color: "bg-teal-600", icon: "\u{1F43C}" },
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
            "w-16 h-16 rounded-sm flex items-center justify-center text-2xl text-white transition-all",
            avatar.color,
            selectedKey === avatar.key
              ? "ring-2 ring-amber ring-offset-2 ring-offset-zinc-900 scale-105"
              : "hover:scale-105 opacity-70 hover:opacity-100"
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
