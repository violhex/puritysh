"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "@/stores/useAudioPlayer";
import { trpc } from "@/utils/trpc";

/**
 * Global provider that mounts once and wires:<br/>
 * • Guest playlist fetch<br/>
 * • Persisted volume restore<br/>
 * • Keyboard shortcuts<br/>
 */
export default function AudioProvider({ children }: { children: React.ReactNode }) {
  // Immutable actions from Zustand store
  const {
    setVolume,
    toggle,
    next,
    prev,
    toggleShuffle,
  } = useAudioPlayer((s) => ({
    setVolume: s.setVolume,
    toggle: s.toggle,
    next: s.next,
    prev: s.prev,
    toggleShuffle: s.toggleShuffle,
  }));

  /* ---------------- Guest playlist fetch ---------------- */
  const guestTracksQuery = useQuery(trpc.audio.guest.queryOptions());

  useEffect(() => {
    if (guestTracksQuery.data && Array.isArray(guestTracksQuery.data)) {
      useAudioPlayer.setState({ tracks: guestTracksQuery.data });
      // Autoplay first track once list is ready
      const first = guestTracksQuery.data[0];
      if (first) {
        try {
          useAudioPlayer.getState().play(first.id);
        } catch {
          /* autoplay blocked */
        }
      }
    }
  }, [guestTracksQuery.data]);

  /* ---------------- Restore persisted volume ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem("volume");
    if (stored) setVolume(Number(stored));
  }, [setVolume]);

  /* ---------------- Keyboard shortcuts ---------------- */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Skip when typing
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      switch (e.key) {
        case " ": // Space
          e.preventDefault();
          toggle();
          break;
        case "ArrowRight":
          next();
          break;
        case "ArrowLeft":
          prev();
          break;
        case "r":
        case "R":
          toggleShuffle();
          break;
        case "ArrowUp":
          if (e.ctrlKey) setVolume(Math.min(1, useAudioPlayer.getState().volume + 0.05));
          break;
        case "ArrowDown":
          if (e.ctrlKey) setVolume(Math.max(0, useAudioPlayer.getState().volume - 0.05));
          break;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggle, next, prev, toggleShuffle, setVolume]);

  /* ---------------- Autoplay warm-up ---------------- */
  const warmed = useRef(false);
  useEffect(() => {
    if (warmed.current) return;
    warmed.current = true;
    try {
      const { play } = useAudioPlayer.getState();
      play();
    } catch {
      // Autoplay blocked, ignore
    }
  }, []);

  return <>{children}</>;
} 