"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "react95";
import { cn } from "@/lib/utils";
import StartMenuPanel from "./StartMenuPanel";
import { APPBAR_BUTTON_CLASS } from "./AppBar";
import { useCurrentProfile } from "@/stores/useCurrentProfile";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  dividerAfter?: boolean;
  children?: MenuItem[];
  avatarSrc?: string;
  bannerSrc?: string;
  bio?: string;
  location?: string;
  age?: number;
  rank?: string;
  uid?: number;
}

interface StartButtonMenuProps {
  accent?: string;
  items?: MenuItem[];
}

interface ProfileMeta {
  age: number;
  rank: string;
}

const PROFILE_META: Record<string, ProfileMeta> = {
  bleed: { age: 19, rank: "Owner" },
  luna: { age: 16, rank: "Admin" },
  tone: { age: 18, rank: "Friend" },
};

const R95Icon: React.FC<{ name: string }> = ({ name }) => (
  <span className={cn(name, "inline-block w-8 h-8 bg-contain")}></span>
);

const StartButtonMenu: React.FC<StartButtonMenuProps> = ({ accent = "#8f8f8f" }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const setProfile = useCurrentProfile((s) => s.set);

  const { data: profilesData } = useQuery({
    ...trpc.profile.list.queryOptions(),
    staleTime: Infinity,
  });

  const { data: iconUrl } = useQuery({
    ...trpc.upload.getIcon.queryOptions({ title: "startmenu-icon" }),
    staleTime: Infinity,
  });

  const menuItems: MenuItem[] = React.useMemo(() => {
    if (!profilesData) return [];
    const profileChildren: MenuItem[] = profilesData.map((p: any) => ({
      id: p.displayName.toLowerCase(),
      label: p.displayName,
      avatarSrc: p.avatarUrl ?? undefined,
      bannerSrc: p.bannerUrl ?? undefined,
      bio: p.bio ?? undefined,
      location: p.location ?? undefined,
      age: PROFILE_META[p.displayName.toLowerCase()]?.age,
      rank: PROFILE_META[p.displayName.toLowerCase()]?.rank,
      uid: p.uid,
    }));
    return [
      {
        id: "profiles",
        label: "Profiles",
        dividerAfter: true,
        children: profileChildren,
      },
      { id: "settings", label: "Settings", dividerAfter: true },
      { id: "extras", label: "Extras" },
    ];
  }, [profilesData]);

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
        {...(open && { active: true })}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-pressed={open}
        style={{ backgroundColor: accent }}
        className={cn(APPBAR_BUTTON_CLASS, "min-w-[96px] gap-1 pl-2 pr-3")}
      >
        {iconUrl ? (
          <Image src={iconUrl} alt="Start icon" width={32} height={32} priority unoptimized />
        ) : (
          <R95Icon name="WindowsExplorer_32x32_4" />
        )}
        <span className="hidden sm:inline text-sm">Start</span>
      </Button>

      {open && (
        <StartMenuPanel
          items={menuItems}
          onClose={() => setOpen(false)}
          onSelect={(id) => {
            if (id === "settings") {
              // future: open settings window
            } else {
              setProfile(id as "bleed" | "luna" | "tone");
            }
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default StartButtonMenu; 