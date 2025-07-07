"use client";

import React, { useEffect, useState } from "react";
import { Button } from "react95";
import { format } from "date-fns";
import { APPBAR_BUTTON_CLASS } from "./AppBar";

const zones = ["local", "America/New_York", "Europe/London", "Asia/Tokyo", "UTC"] as const;

const ClockWidget: React.FC = () => {
  const [zoneIdx, setZoneIdx] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const zone = zones[zoneIdx];
  const localeDate = zone === "local" ? now : new Date(now.toLocaleString("en-US", { timeZone: zone }));
  const timeStr = format(localeDate, "HH:mm");
  const dateStr = format(localeDate, "MMM dd");

  return (
    <Button
      variant="flat"
      onClick={() => setZoneIdx((i) => (i + 1) % zones.length)}
      title={zone === "local" ? Intl.DateTimeFormat().resolvedOptions().timeZone : zone}
      aria-label={`Time is ${timeStr}`}
      className={APPBAR_BUTTON_CLASS}
    >
      <div className="flex flex-col leading-none text-[10px] font-mono">
        <span>{timeStr}</span>
        <span>{dateStr}</span>
      </div>
    </Button>
  );
};

export default ClockWidget; 