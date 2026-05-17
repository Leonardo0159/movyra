"use client";

import { useState, useEffect } from "react";
import { AvatarDisplay } from "@/components/avatar-display";
import { AvatarPicker } from "@/components/avatar-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { ChevronLeft, Plus, Pencil, Trash2 } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  avatarKey: string | null;
  avatarUrl: string | null;
  isActive?: boolean;
}

const MAX_PROFILES = 5;

export default function ManageProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [editName, setEditName] = useState("");
  const [editAvatarKey, setEditAvatarKey] = useState<string | null>(null);

  const fetchProfiles = () => {
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
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleAddProfile = async () => {
    if (profiles.length >= MAX_PROFILES) {
      setError(`Maximum of ${MAX_PROFILES} profiles reached`);
      return;
    }

    setSelectedProfile(null);
    setEditName("");
    setEditAvatarKey("avatar-1");
    setEditDialogOpen(true);
  };

  const handleEditProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setEditName(profile.name);
    setEditAvatarKey(profile.avatarKey);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setDeleteDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editName || editName.length < 2) {
      setError("Profile name must be at least 2 characters");
      return;
    }

    try {
      const url = selectedProfile
        ? `/api/profiles/${selectedProfile.id}`
        : "/api/profiles";
      const method = selectedProfile ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          avatarKey: editAvatarKey,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      setEditDialogOpen(false);
      fetchProfiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedProfile) return;

    try {
      const res = await fetch(`/api/profiles/${selectedProfile.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete profile");
      }

      setDeleteDialogOpen(false);
      fetchProfiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete profile");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.1_0.005_45)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber/30 border-t-amber" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[oklch(0.1_0.005_45)] px-4 py-10 overflow-hidden">
      <div className="absolute inset-0 film-grain" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/select-profile"
              className="rounded-sm p-2 text-zinc-400 transition-colors hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-heading text-2xl uppercase tracking-wider text-white">
              Manage Profiles
            </h1>
          </div>
          <Button
            onClick={handleAddProfile}
            disabled={profiles.length >= MAX_PROFILES}
            className="bg-amber text-[oklch(0.1_0.005_45)] hover:bg-amber/90 font-heading uppercase tracking-wider"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add
          </Button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="space-y-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="overflow-hidden rounded-sm ring-1 ring-zinc-700/50">
                  <AvatarDisplay
                    avatarKey={profile.avatarKey}
                    avatarUrl={profile.avatarUrl}
                    name={profile.name}
                    size="md"
                  />
                </div>
                <div>
                  <p className="font-medium text-zinc-200">{profile.name}</p>
                  {profile.isActive && (
                    <p className="text-xs text-amber">Active</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700/50 text-zinc-400 hover:text-white"
                  onClick={() => handleEditProfile(profile)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(profile)}
                  disabled={profiles.length <= 1}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="border-zinc-800/50 bg-zinc-900/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg uppercase tracking-wider">
              {selectedProfile ? "Edit Profile" : "Add Profile"}
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              {selectedProfile
                ? "Update the profile name and avatar"
                : "Create a new profile with a name and avatar"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                Profile Name
              </label>
              <Input
                id="profile-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter profile name"
                maxLength={30}
                className="border-zinc-700/50 bg-zinc-800/50 text-white placeholder:text-zinc-600 focus:border-amber/40 focus:ring-amber/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Avatar</label>
              <AvatarPicker
                selectedKey={editAvatarKey}
                onSelect={setEditAvatarKey}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-zinc-700/50 text-zinc-400" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-amber text-[oklch(0.1_0.005_45)] hover:bg-amber/90" onClick={handleSaveProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-zinc-800/50 bg-zinc-900/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg uppercase tracking-wider">Delete Profile</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Are you sure you want to delete &quot;{selectedProfile?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-zinc-700/50 text-zinc-400" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProfile}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
