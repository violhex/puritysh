"use client";

import React, { useEffect } from "react";
import { useAudioPlayer } from "@/stores/useAudioPlayer";
import type { AudioPlayerState } from "@/stores/useAudioPlayer";

interface Props {
  children: React.ReactNode;
}

export default function AudioProvider({ children }: Props) {
  const { setVolume, toggle, next, prev, toggleShuffle } = useAudioPlayer((state: AudioPlayerState) => ({
    setVolume: state.setVolume,
    toggle: state.toggle,
    next: state.next,
    prev: state.prev,
    toggleShuffle: state.toggleShuffle,
  }));

  // Restore volume from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("volume");
    if (stored) {
      const v = Number(stored);
      if (!Number.isNaN(v)) setVolume(v);
    }
  }, [setVolume]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          toggle();
          break;
        case "ArrowRight":
          next();
          break;
        case "ArrowLeft":
          prev();
          break;
        case "KeyR":
          toggleShuffle();
          break;
        case "ArrowUp":
          if (e.ctrlKey) {
            const vol = useAudioPlayer.getState().volume;
            setVolume(Math.min(1, vol + 0.05));
          }
          break;
        case "ArrowDown":
          if (e.ctrlKey) {
            const vol = useAudioPlayer.getState().volume;
            setVolume(Math.max(0, vol - 0.05));
          }
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle, next, prev, toggleShuffle, setVolume]);

  return <>{children}</>;
} 