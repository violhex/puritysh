"use client";

import React from "react";
import { cn } from "@/lib/utils";
import StartButtonMenu from "./StartButtonMenu";
import ActiveTabsStrip, { WindowTask } from "./ActiveTabsStrip";
import MediaControls from "./MediaControls";
import TracklistToggle from "./TracklistToggle";
import HelpButton from "./HelpButton";
import ClockWidget from "./ClockWidget";

export interface AppBarProps {
  className?: string;
  accent?: string;
  tasks?: WindowTask[];
}

const AppBar: React.FC<AppBarProps> = ({ className, accent = "#8f8f8f", tasks = [] }) => {
  return (
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

      {/* Active Tasks */}
      <ActiveTabsStrip tasks={tasks} className="flex-1 overflow-x-auto" />

      {/* Utility Cluster */}
      <div className="flex items-center gap-1">
        <MediaControls className="mr-2" />
        <TracklistToggle />
        <HelpButton />
        <ClockWidget />
      </div>
    </div>
  );
};

export default AppBar; 