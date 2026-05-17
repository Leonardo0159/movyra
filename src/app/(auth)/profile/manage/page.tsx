"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AvatarDisplay } from "@/components/avatar-display";
import { AvatarPicker } from "@/components/avatar-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const router = useRouter();

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Profiles</h1>
          <Button
            onClick={handleAddProfile}
            disabled={profiles.length >= MAX_PROFILES}
          >
            Add Profile
          </Button>
        </div>

        {error && (
          <p className="text-destructive mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="space-y-4">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <AvatarDisplay
                    avatarKey={profile.avatarKey}
                    avatarUrl={profile.avatarUrl}
                    name={profile.name}
                    size="md"
                  />
                  <div>
                    <p className="font-medium">{profile.name}</p>
                    {profile.isActive && (
                      <p className="text-sm text-muted-foreground">Active</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProfile(profile)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(profile)}
                    disabled={profiles.length <= 1}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          variant="ghost"
          className="mt-6"
          onClick={() => router.push("/select-profile")}
        >
          Back to profile selection
        </Button>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProfile ? "Edit Profile" : "Add Profile"}
            </DialogTitle>
            <DialogDescription>
              {selectedProfile
                ? "Update the profile name and avatar"
                : "Create a new profile with a name and avatar"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="profile-name" className="text-sm font-medium">
                Profile Name
              </label>
              <Input
                id="profile-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter profile name"
                maxLength={30}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Avatar</label>
              <AvatarPicker
                selectedKey={editAvatarKey}
                onSelect={setEditAvatarKey}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedProfile?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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
