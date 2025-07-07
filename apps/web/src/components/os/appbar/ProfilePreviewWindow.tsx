import React from "react";
import { withWindow } from "@/components/contexts/window-manager";
import {
  Window,
  WindowHeader,
  WindowContent,
  Separator,
  Button,
} from "react95";
import { ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";
import { cn } from "@/lib/utils";
import type { StartMenuItem } from "./StartMenuPanel";
import SafeAvatar from "./SafeAvatar";

interface ExtendedProfile extends StartMenuItem {
  age?: number;
  rank?: string;
}

interface ProfilePreviewWindowProps {
  profile: ExtendedProfile;
  className?: string;
  onClose?: () => void;
}

const ProfilePreviewWindow: React.FC<ProfilePreviewWindowProps> = ({ profile, className, onClose }) => (
  <ThemeProvider theme={original}>
    <Window
      variant="outside"
      className={cn(
        "startmenu-border startmenu-bevel w-96 sm:w-80 min-h-[300px]", // wider preview
        className,
      )}
      role="dialog"
      aria-label={`${profile.label} preview`}
    >
      {/* Header with close button */}
      <WindowHeader
        className="flex justify-between items-center select-none"
        onDoubleClick={onClose}
      >
        <span>{profile.label}</span>
        <Button
          onClick={onClose}
          className="p-0 w-6 h-6 flex items-center justify-center"
          aria-label="Close preview"
        >
          ✕
        </Button>
      </WindowHeader>

      <WindowContent className="p-2">
        {/* Inset bevelled area */}
        <div className="mx-auto w-64 sm:w-56 border-2 border-[#fff] shadow-[inset_-3px_-3px_0_0_#000] bg-[#dcdcdc]">
          {/* Banner */}
          {profile.bannerSrc ? (
            <div
              className="h-16 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.bannerSrc})` }}
            />
          ) : (
            <div className="h-16 w-full bg-black" />
          )}

          {/* Avatar overlapping banner */}
          <div className="flex justify-center -mt-6 mb-2">
            {profile.avatarSrc && (
              <SafeAvatar
                src={profile.avatarSrc}
                size={56}
                className="border-2 border-white shadow-[0_0_0_2px_#000]"
              />
            )}
          </div>

          <Separator className="bg-black h-[2px]" />

          {/* Textual info */}
          <div className="py-4 px-3 text-center space-y-2">
            {/* Username */}
            <div className="font-bold tracking-wide uppercase">
              {profile.label}
            </div>

            {/* UID */}
            {typeof profile.uid === "number" && (
              <div className="text-xs" style={{ fontFamily: "HomeVideo, monospace" }}>
                UID #{profile.uid}
              </div>
            )}

            {/* Rank */}
            {profile.rank && (
              <div
                className={cn(
                  "text-xs font-bold uppercase",
                  profile.rank === "Owner"
                    ? "text-red-600 animate-pulse drop-shadow-[0_0_2px_red]"
                    : profile.rank === "Admin"
                    ? "text-blue-700"
                    : "text-gray-700",
                )}
                style={{ fontFamily: "GothicPixels, monospace" }}
              >
                {profile.rank}
              </div>
            )}

            {/* Mini Bio */}
            {profile.bio && (
              <div className="text-sm whitespace-pre-wrap leading-snug">
                {profile.bio}
              </div>
            )}

            {/* Age & Location */}
            <div className="space-y-1 text-xs font-mono opacity-80">
              {typeof profile.age === "number" && (
                <div style={{ fontFamily: "Xaphan, monospace" }}>Age: {profile.age}</div>
              )}
              {profile.location && (
                <div style={{ fontFamily: "VTC-SumiSlasherOneJitteryBasterd, monospace" }}>
                  {profile.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </WindowContent>
    </Window>
  </ThemeProvider>
);

export default withWindow({
  title: "Profile Preview",
  icon: <span className="User_16x16_4 inline-block w-4 h-4 bg-contain" />,
  type: "modal",
  parentId: "profiles-submenu",
})(ProfilePreviewWindow); 