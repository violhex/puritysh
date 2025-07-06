"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Window, WindowHeader, WindowContent, Divider } from "react95";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface StartButtonMenuProps {
  accent?: string;
  items?: MenuItem[];
}

const DEFAULT_ITEMS: MenuItem[] = [
  { id: "bleed", label: "Bleed" },
  { id: "luna", label: "Luna" },
  { id: "tone", label: "Tone" },
  { id: "settings", label: "Settings" },
];

const R95Icon: React.FC<{ name: string }> = ({ name }) => (
  <span className={cn(name, "inline-block w-8 h-8 bg-contain")}></span>
);

const StartButtonMenu: React.FC<StartButtonMenuProps> = ({ accent = "#8f8f8f", items = DEFAULT_ITEMS }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        active={open}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-pressed={open}
        style={{ backgroundColor: accent }}
        className="p-0 h-[45px] min-w-[96px] flex items-center gap-1 pl-2 pr-3"
      >
        <R95Icon name="WindowsExplorer_32x32_4" />
        <span className="hidden sm:inline text-sm">Start</span>
      </Button>

      {open && (
        <Window className="absolute bottom-[45px] left-0 z-50 w-64" variant="outside">
          <WindowHeader>Start</WindowHeader>
          <WindowContent className="p-0">
            {items.map((item, idx) => (
              <React.Fragment key={item.id}>
                <Button
                  variant="menu"
                  className="w-full justify-start px-2 py-1"
                  onClick={() => {
                    // TODO: navigation handler
                    setOpen(false);
                  }}
                >
                  {item.label}
                </Button>
                {idx === 0 && <Divider />}
              </React.Fragment>
            ))}
          </WindowContent>
        </Window>
      )}
    </div>
  );
};

export default StartButtonMenu; 