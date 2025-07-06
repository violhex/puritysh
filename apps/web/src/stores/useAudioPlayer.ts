"use client";

import { create } from "zustand";
import type { StateCreator } from "zustand";

// --- Types --------------------------------------------------------------
export interface TrackMeta {
  id: string;
  title: string;
  src: string;
  profile?: string;
}

export interface AudioPlayerState {
  /* reactive */
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  track: TrackMeta | null;
  tracks: TrackMeta[];

  /* controls */
  play: (id?: string) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  toggleShuffle: () => void;
  setVolume: (v: number) => void;
}

// Safe Audio creation on client only
const createAudio = () =>
  typeof Audio !== "undefined" ? new Audio() : ({} as HTMLAudioElement);

const creator: StateCreator<AudioPlayerState> = (set, get) => {
  const audio = createAudio();
  audio.preload = "metadata";

  // Helpers
  const setTrackById = (id: string) => {
    const t = get().tracks.find((tr: TrackMeta) => tr.id === id);
    if (t) {
      audio.src = t.src;
      set({ track: t, duration: 0, currentTime: 0 });
    }
  };

  // Event listeners (client only)
  if (typeof window !== "undefined" && typeof audio.addEventListener === "function") {
    audio.addEventListener("loadedmetadata", () => {
      set({ duration: audio.duration });
    });
    let lastUpdate = 0;
    audio.addEventListener("timeupdate", () => {
      const now = performance.now();
      if (now - lastUpdate > 250) {
        set({ currentTime: audio.currentTime });
        lastUpdate = now;
      }
    });
    audio.addEventListener("ended", () => get().next());
  }

  // State & API
  return {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    shuffle: false,
    track: null,
    tracks: [],

    play: (id?: string) => {
      if (id) setTrackById(id);
      audio.play();
      set({ isPlaying: true });
    },
    pause: () => {
      audio.pause();
      set({ isPlaying: false });
    },
    toggle: () => (get().isPlaying ? get().pause() : get().play()),
    next: () => {
      const { tracks, track, shuffle } = get();
      if (!tracks.length) return;
      const currentIdx = tracks.findIndex((t: TrackMeta) => t.id === track?.id);
      const nextIdx = shuffle
        ? Math.floor(Math.random() * tracks.length)
        : (currentIdx + 1) % tracks.length;
      setTrackById(tracks[nextIdx].id);
      audio.play();
      set({ isPlaying: true });
    },
    prev: () => {
      const { tracks, track } = get();
      if (!tracks.length) return;
      const currentIdx = tracks.findIndex((t: TrackMeta) => t.id === track?.id);
      const prevIdx = (currentIdx - 1 + tracks.length) % tracks.length;
      setTrackById(tracks[prevIdx].id);
      audio.play();
      set({ isPlaying: true });
    },
    toggleShuffle: () => set((s: AudioPlayerState) => ({ shuffle: !s.shuffle })),
    setVolume: (v: number) => {
      const value = Math.min(1, Math.max(0, v));
      audio.volume = value;
      localStorage.setItem("volume", value.toString());
      set({ volume: value });
    },
  };
};

export const useAudioPlayer = create<AudioPlayerState>(creator); 