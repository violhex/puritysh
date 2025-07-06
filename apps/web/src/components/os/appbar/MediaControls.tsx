"use client";

import React from "react";
import { Button } from "react95";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/stores/useAudioPlayer";
import type { AudioPlayerState } from "@/stores/useAudioPlayer";

interface MediaControlsProps {
  className?: string;
}

/**
 * Convenience component for React95 CSS-based icons.
 * Pass the exact class name (e.g. "ArrowLeft_32x32_4") coming from
 * `@react95/icons/icons.css`.
 */
const R95Icon: React.FC<{ name: string }> = ({ name }) => (
  <span className={cn(name, "inline-block w-8 h-8 bg-contain")}></span>
);

const MediaControls: React.FC<MediaControlsProps> = ({ className }) => {
  const {
    isPlaying,
    shuffle,
    volume,
    toggle,
    next,
    prev,
    toggleShuffle,
    setVolume,
  } = useAudioPlayer((s: AudioPlayerState) => ({
    isPlaying: s.isPlaying,
    shuffle: s.shuffle,
    volume: s.volume,
    toggle: s.toggle,
    next: s.next,
    prev: s.prev,
    toggleShuffle: s.toggleShuffle,
    setVolume: s.setVolume,
  }));

  const muted = volume === 0;

  const btnCls = "p-0 w-[45px] h-[45px] flex items-center justify-center";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        title="Shuffle (R)"
        aria-label="Toggle shuffle"
        onClick={toggleShuffle}
        active={shuffle}
        className={btnCls}
      >
        <R95Icon name="Syncui120_32x32_4" />
      </Button>

      <Button title="Previous (←)" aria-label="Previous track" onClick={prev} className={btnCls}>
        <R95Icon name="ArrowLeft_32x32_4" />
      </Button>

      <Button
        title="Play / Pause (Space)"
        aria-label="Play or pause"
        onClick={toggle}
        className={btnCls}
      >
        <AnimatePresence initial={false} mode="wait">
          {isPlaying ? (
            <motion.span key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <R95Icon name="Cdplayer110_32x32_4" />
            </motion.span>
          ) : (
            <motion.span key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <R95Icon name="Cdplayer107_32x32_4" />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <Button title="Next (→)" aria-label="Next track" onClick={next} className={btnCls}>
        <R95Icon name="ArrowRight_32x32_4" />
      </Button>

      <Button
        title="Mute"
        aria-label="Toggle mute"
        onClick={() => setVolume(muted ? 1 : 0)}
        className={btnCls}
      >
        <R95Icon name={muted ? "Mute_32x32_4" : "Unmute_32x32_4"} />
      </Button>
    </div>
  );
};

export default MediaControls; 