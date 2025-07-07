import { create } from "zustand";

interface ProfileState {
  current: "bleed" | "luna" | "tone";
  set: (id: "bleed" | "luna" | "tone") => void;
}

export const useCurrentProfile = create<ProfileState>((set) => ({
  current: "bleed",
  set: (id) => set({ current: id }),
})); 