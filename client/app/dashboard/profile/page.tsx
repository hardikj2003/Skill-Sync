"use client";

import { useState, useEffect, KeyboardEvent, useRef, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/Button";
import Image from "next/image"; // Import Image for optimized avatar

// --- HELPER & UI COMPONENTS ---

// Updated Icon component with specific styling for the upload button
const Icon = ({
  path,
  className,
  children,
}: {
  path?: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {path && (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={path}
      />
    )}
    {children} {/* For custom SVG paths if needed */}
  </svg>
);

const TagInput = ({
  tags,
  setTags,
  placeholder,
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[34px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-2 bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-sky-600 hover:text-sky-800"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  );
};

// --- HELPER: getInitials ---
const getInitials = (name: string = ""): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// --- Profile Page Skeleton (remains the same, but ensure it uses the new avatar styles) ---
const ProfilePageSkeleton = () => (
  <div className="p-8 animate-pulse">
    <div className="max-w-4xl mx-auto">
      {/* Header Skeleton */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-slate-200"></div>{" "}
        {/* Skeleton for avatar */}
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 rounded"></div>
          <div className="h-5 w-48 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Main Form Skeleton */}
      <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="space-y-6">
          <div>
            <div className="h-4 w-16 bg-slate-200 rounded mb-2"></div>
            <div className="h-24 w-full bg-slate-200 rounded-lg"></div>
          </div>
          <div>
            <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-slate-200 rounded-lg"></div>
          </div>
          <div>
            <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
            <div className="space-y-2">
              <div className="h-10 w-full bg-slate-200 rounded-lg"></div>
              <div className="h-10 w-full bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// --- MAIN PROFILE PAGE COMPONENT ---
export default function ProfilePage() {
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${session.user.token}` },
          };
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
            config
          );
          if (!data.socialLinks) {
            data.socialLinks = { linkedIn: "", twitter: "", github: "" };
          }
          setProfile(data);
        } catch (err) {
          showToast("Failed to load profile.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProfile();
  }, [session, showToast]);

  const handleSave = async (dataToSave = profile) => {
    setIsSaving(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${session!.user.token}` },
      };
      const { data: updatedProfile } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        dataToSave,
        config
      );

      await update({
        name: updatedProfile.name,
        avatar: updatedProfile.avatar,
      });

      setProfile(updatedProfile);
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Profile save error:", err);
      showToast("Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session!.user.token}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/avatar`,
        formData,
        config
      );

      // 1. Create a new profile object with the fresh avatar URL
      const newProfile = { ...profile, avatar: data.imageUrl };

      // 2. Update the local state so the UI shows the new image immediately
      setProfile(newProfile);
      showToast("Avatar uploaded! Saving profile...", "info");

      // 3. Pass the new, correct profile object DIRECTLY to handleSave
      await handleSave(newProfile);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      showToast("Failed to upload avatar.", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) return <ProfilePageSkeleton />;
  if (!profile)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load profile.
      </div>
    );

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 flex items-center gap-6">
          <div className="relative group">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt="User Avatar"
                width={96} // Equivalent to w-24 (96px)
                height={96} // Equivalent to h-24 (96px)
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                priority // Load avatar quickly
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-800 text-4xl border-2 border-sky-200">
                {getInitials(profile.name)}
              </div>
            )}

            {/* Upload Button with new SVG */}
            <button
              onClick={triggerFileInput}
              disabled={isUploading}
              className={`absolute bottom-0 right-0 h-8 w-8 rounded-full flex items-center justify-center text-white ring-2 ring-white transition-all duration-200 
                                ${
                                  isUploading
                                    ? "bg-slate-400"
                                    : "bg-sky-500 hover:bg-sky-600"
                                }
                                group-hover:bottom-1 group-hover:right-1
                            `}
              aria-label="Upload new avatar"
            >
              {isUploading ? (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                // New SVG for Camera/Upload
                <Icon className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </Icon>
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />
          </div>
          <div>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="text-4xl font-extrabold text-slate-800 bg-transparent focus:outline-none focus:bg-slate-100 rounded-lg p-2 -ml-2"
            />
            <input
              type="text"
              value={profile.title || ""}
              onChange={(e) =>
                setProfile({ ...profile, title: e.target.value })
              }
              placeholder="Your Title (e.g., Software Engineer)"
              className="text-slate-500 mt-1 w-full bg-transparent focus:outline-none focus:bg-slate-100 rounded-lg p-2 -ml-2"
            />
          </div>
        </div>

        {/* Main Profile Form */}
        <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Bio
              </label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={4}
                placeholder={
                  profile.role === "mentor"
                    ? "Write a short introduction about your experience and what you can help with."
                    : "Describe yourself and your learning goals."
                }
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            {profile.role === "mentor" ? (
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  My Expertise
                </label>
                <TagInput
                  tags={profile.expertise || []}
                  setTags={(tags) =>
                    setProfile({ ...profile, expertise: tags })
                  }
                  placeholder="Add a skill and press Enter"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  My Learning Goals
                </label>
                <TagInput
                  tags={profile.learningGoals || []}
                  setTags={(tags) =>
                    setProfile({ ...profile, learningGoals: tags })
                  }
                  placeholder="Add an interest and press Enter"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Social Links
              </label>
              <div className="space-y-2 mt-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon
                      path="M13 16v-1m-4 1v-1m-4 1v-1M1 11v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2H3a2 2 0 00-2 2z"
                      className="text-slate-400"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="LinkedIn Profile URL"
                    value={profile.socialLinks?.linkedIn || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socialLinks: {
                          ...profile.socialLinks,
                          linkedIn: e.target.value,
                        },
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon
                      path="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      className="text-slate-400"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="GitHub Profile URL"
                    value={profile.socialLinks?.github || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socialLinks: {
                          ...profile.socialLinks,
                          github: e.target.value,
                        },
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon
                      path="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                      className="text-slate-400"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Twitter/X Profile URL"
                    value={profile.socialLinks?.twitter || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socialLinks: {
                          ...profile.socialLinks,
                          twitter: e.target.value,
                        },
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => handleSave()}
            disabled={isSaving || isUploading}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
