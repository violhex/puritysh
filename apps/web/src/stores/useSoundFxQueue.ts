"use client";

import { create } from "zustand";
import type { StateCreator } from "zustand";

export interface SoundFxMeta {
  id: string;
  title: string;
  src: string;
}

interface SoundFxQueueState {
  queue: SoundFxMeta[];
  current: SoundFxMeta | null;
  /** underlying <audio> element used for playback */
  element: HTMLAudioElement;

  /* actions */
  enqueue: (fx: SoundFxMeta | SoundFxMeta[]) => void;
  clear: () => void;
}

// Helper to safely create an HTMLAudioElement client-side
const createAudio = () =>
  typeof Audio !== "undefined" ? new Audio() : ({} as HTMLAudioElement);

const creator: StateCreator<SoundFxQueueState> = (set, get) => {
  const audio = createAudio();
  audio.preload = "auto";

  /* ---- private helpers ---- */
  const playNext = () => {
    const q = get().queue;
    if (!q.length) {
      set({ current: null });
      return;
    }
    const [next, ...rest] = q;
    audio.src = next.src;
    audio.load();
    audio.play().catch(() => {/* autoplay blocked */});
    set({ current: next, queue: rest });
  };

  /* ---- event listeners ---- */
  if (typeof window !== "undefined" && typeof audio.addEventListener === "function") {
    audio.addEventListener("ended", playNext);
  }

  return {
    element: audio,
    queue: [],
    current: null,

    enqueue: (fx: SoundFxMeta | SoundFxMeta[]) => {
      const list = Array.isArray(fx) ? fx : [fx];
      set((s) => ({ queue: [...s.queue, ...list] }));
      // if nothing is currently playing, kick off playback
      if (!get().current) {
        playNext();
      }
    },

    clear: () => {
      audio.pause();
      audio.src = "";
      set({ queue: [], current: null });
    },
  };
};

export const useSoundFxQueue = create<SoundFxQueueState>(creator); 