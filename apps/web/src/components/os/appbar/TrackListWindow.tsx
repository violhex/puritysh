"use client";

import React, { useEffect, useRef } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  MenuList,
  MenuListItem,
  Separator,
  ScrollView,
} from "react95";
import { AnimatePresence, motion } from "framer-motion";
import { useAudioPlayer } from "@/stores/useAudioPlayer";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";
import { useWindowRegistration } from "@/components/contexts/window-manager";

export interface TrackListWindowProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * TrackListWindow – Retro Win95 style popup listing the current profile's playlist.
 * Renders above the AppBar, supports keyboard navigation and double-click to play.
 */
const TrackListWindow: React.FC<TrackListWindowProps> = ({ open, onClose, className }) => {
  const { tracks: profileTracks, track: currentTrack, play, next, prev } = useAudioPlayer((s) => ({
    tracks: s.tracks,
    track: s.track,
    play: s.play,
    next: s.next,
    prev: s.prev,
  }));

  // Fetch full catalogue
  const { data: allTracksData } = useQuery({
    ...trpc.audio.list.queryOptions(),
    staleTime: Infinity,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Register with WindowManager when open
  useWindowRegistration(
    open 
      ? {
          id: "tracklist",
          title: "Track-list",
          icon: <span className="Cdplayer110_16x16_4 inline-block w-4 h-4 bg-contain" />,
          type: "normal",
        } 
      : undefined
  );

  const playable = profileTracks;
  const allTracks = allTracksData ?? [];

  /* ---------- Keyboard shortcuts (Esc + Ctrl+Arrow) ---------- */
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.ctrlKey && e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.ctrlKey && e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose, next, prev]);

  /* ---------- Click outside closes window ---------- */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="tracklist"
        ref={containerRef}
        className={cn("fixed bottom-[50px] z-50", className)}
        style={{ right: 180 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        role="dialog"
        aria-label="Track list"
      >
        <ThemeProvider theme={original}>
          <Window
            variant="outside"
            className="startmenu-border startmenu-bevel w-[40rem] sm:w-[34rem] max-h-[60vh] overflow-hidden"
          >
            <WindowHeader
              className="flex justify-between items-center select-none"
              onDoubleClick={onClose}
            >
              <span className="flex items-center gap-2">
                <span className={cn("Cdplayer110_16x16_4", "inline-block w-4 h-4 bg-contain")}></span>
                Track-list
              </span>
              <Button
                onClick={onClose}
                className="p-0 w-6 h-6 flex items-center justify-center"
              >
                ✕
              </Button>
            </WindowHeader>
            <WindowContent className="p-2">
              <div className="space-y-2">
                {/* Section: Profile Tracks */}
                <div className="bg-[#c0c0c0] px-2 py-1 text-xs font-bold uppercase">Current Profile</div>
                <ScrollView style={{ height: "18vh" }}>
                  <MenuList className="w-full block" style={{ width: "100%" }}>
                    {playable.map((t, idx) => {
                      const isActive = currentTrack?.id === t.id;
                      return (
                        <MenuListItem
                          key={t.id}
                          role="menuitem"
                          tabIndex={0}
                          onDoubleClick={() => play(t.id)}
                          onClick={() => play(t.id)}
                          className={cn(
                            "flex items-center gap-2 cursor-pointer pr-4 pl-2",
                            isActive && "bg-[#000080]/20 font-bold",
                          )}
                        >
                          <span className="w-8 text-right font-mono text-xs">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 truncate text-left">{t.title}</span>
                        </MenuListItem>
                      );
                    })}
                  </MenuList>
                </ScrollView>

                {allTracks.length > 0 && (
                  <>
                    <Separator className="my-1" />
                    <div className="bg-[#c0c0c0] px-2 py-1 text-xs font-bold uppercase">All Tracks</div>
                    <ScrollView style={{ height: "24vh" }}>
                      <MenuList className="w-full block" style={{ width: "100%" }}>
                        {allTracks.map((t, idx) => (
                          <MenuListItem
                            key={t.id}
                            role="menuitem"
                            aria-disabled="true"
                            className="flex items-center gap-2 pr-4 pl-2 cursor-not-allowed select-none text-gray-500"
                          >
                            <span className="w-8 text-right font-mono text-xs">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1 truncate text-left">{t.title}</span>
                          </MenuListItem>
                        ))}
                      </MenuList>
                    </ScrollView>
                  </>
                )}
              </div>
            </WindowContent>
          </Window>
        </ThemeProvider>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrackListWindow; 