"use client";

import React from "react";
import { cn } from "@/lib/utils";
import StartButtonMenu from "./StartButtonMenu";
import ActiveTabsStrip from "./ActiveTabsStrip";
import MediaControls from "./MediaControls";
import TracklistToggle from "./TracklistToggle";
import HelpButton from "./HelpButton";
import ClockWidget from "./ClockWidget";
import TrackListWindow from "./TrackListWindow";
import { useWindowManager } from "@/components/contexts/window-manager";

// Shared button dimensions for consistent AppBar styling
export const APPBAR_BUTTON_CLASS = "w-[45px] h-[45px] p-0 flex items-center justify-center";

export interface AppBarProps {
  className?: string;
  accent?: string;
}

const AppBar: React.FC<AppBarProps> = ({ className, accent = "#8f8f8f" }) => {
  const [showTrackList, setShowTrackList] = React.useState(false);
  const { bringToFront } = useWindowManager();

  // Register TrackList as a window when it opens
  React.useEffect(() => {
    if (showTrackList) {
      // TrackListWindow should register itself via withWindow or manual registration
    }
  }, [showTrackList]);

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 flex h-[45px] items-center gap-1 px-1 select-none",
          className,
        )}
        style={{
          "--bar": accent,
          "--highlight": "#ffffff",
          "--shadow": "#000000",
          backgroundColor: "var(--bar)",
          boxShadow: "inset 0 2px 0 0 var(--highlight), 0 -2px 0 var(--shadow)",
        } as React.CSSProperties}
      >
        {/* Start Button & Menu */}
        <StartButtonMenu accent={accent} />

        {/* Active Tasks - clicking brings window to front */}
        <ActiveTabsStrip 
          className="flex-1 overflow-x-auto ml-2" 
          onTaskClick={(id) => bringToFront(id)}
        />

        {/* Utility Cluster */}
        <div className="flex items-center gap-1">
          <MediaControls className="mr-2" />
          <TracklistToggle onClick={() => setShowTrackList((o) => !o)} />
          <HelpButton />
          <ClockWidget />
        </div>
      </div>

      {/* TrackList Window - z-index managed by WindowManager */}
      <TrackListWindow open={showTrackList} onClose={() => setShowTrackList(false)} />
    </>
  );
};

export default AppBar; 