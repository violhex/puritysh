"use client";

import React from "react";
import { Button } from "react95";
import { cn } from "@/lib/utils";

const R95Icon: React.FC<{ name: string }> = ({ name }) => (
  <span className={cn(name, "inline-block w-8 h-8 bg-contain")}></span>
);

const TracklistToggle: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <Button
    onClick={onClick}
    title="Tracklist"
    className="p-0 w-[45px] h-[45px] flex items-center justify-center"
  >
    <R95Icon name="CdMusic_32x32_4" />
  </Button>
);

export default TracklistToggle; 