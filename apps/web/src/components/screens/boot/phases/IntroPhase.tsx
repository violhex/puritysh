"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "react95";
import LogoPulse from "../LogoPulse";
import TitleLabel from "../shared/TitleLabel";
import EKGWave from "../EkgWave";
import { PROGRESS_DURATION, EKG_DELAY } from "../constants";
import { useAudioPlayer } from "@/stores/useAudioPlayer";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { showR95Toast } from "@/components/ui/r95-toast";

interface IntroPhaseProps {
  onFinish: () => void;
}

type LocalPhase = "logo" | "ekg" | "progress" | "done";

const IntroPhase: React.FC<IntroPhaseProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<LocalPhase>("logo");
  const [progress, setProgress] = useState(0);
  const [progressStarted, setProgressStarted] = useState(false);
  const toastShownRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bootEl, setBootEl] = useState<HTMLAudioElement | null>(null);

  const { play } = useAudioPlayer((s) => ({ play: s.play }));
  const { data: bootFx } = useQuery(trpc.soundfx.getByTitle.queryOptions({ title: "boot_sequence_audio" }));

  /* ---------------- phase timers ---------------- */
  useEffect(() => {
    if (phase === "logo") {
      const id = setTimeout(() => setPhase("ekg"), 700);
      return () => clearTimeout(id);
    }
    if (phase === "ekg") {
      const id = setTimeout(() => setPhase("progress"), EKG_DELAY);
      if (!toastShownRef.current) {
        showR95Toast({
          title: "System Notice",
          message: "Click waveform or progress bar to initiate boot.",
        });
        toastShownRef.current = true;
      }
      return () => clearTimeout(id);
    }
  }, [phase]);

  /* ---------------- progress / audio ---------------- */
  useEffect(() => {
    if (phase === "progress" && progressStarted && bootFx?.src) {
      const sfx = new Audio(bootFx.src);
      sfx.crossOrigin = "anonymous";
      sfx.volume = 0.6;
      audioRef.current = sfx;
      setBootEl(sfx);
      sfx.play().catch(() => {});

      const startedAt = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startedAt;
        const pct = Math.min(100, (elapsed / PROGRESS_DURATION) * 100);
        setProgress(pct);
        if (pct < 100) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      sfx.onended = () => {
        setProgress(100);
        // Wait 1.5 s for init then finish
        setTimeout(() => {
          play(); // start background audio loop
          setPhase("done");
          onFinish();
        }, 1500);
      };

      return () => {
        sfx.pause();
      };
    }
  }, [phase, progressStarted, bootFx, play, onFinish]);

  /* Attempt to resume audio if autoplay blocked */
  useEffect(() => {
    if (phase !== "progress") return;

    function resumeAudio() {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      // resume shared context
      // eslint-disable-next-line no-restricted-globals
      const ctx: AudioContext | undefined = (globalThis as any).__purity_audio_ctx;
      if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});

      document.removeEventListener("pointerdown", resumeAudio);
      document.removeEventListener("keydown", resumeAudio);
    }

    document.addEventListener("pointerdown", resumeAudio);
    document.addEventListener("keydown", resumeAudio);
    return () => {
      document.removeEventListener("pointerdown", resumeAudio);
      document.removeEventListener("keydown", resumeAudio);
    };
  }, [phase]);

  /* ---------------- render ---------------- */
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white font-home-video text-sm select-none">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
        <LogoPulse amplitude={0.08} className="scale-75" />
        <TitleLabel />
        {/* EKG appears after title */}
        <AnimatePresence>
          {phase !== "logo" && (
            <motion.div
              key="ekg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-2"
              onClick={() => {
                if (phase === "progress" && !progressStarted) setProgressStarted(true);
              }}
            >
              <EKGWave source={bootEl ?? undefined} intensity={1} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <AnimatePresence>
          {phase === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-64"
              onClick={() => {
                if (!progressStarted) setProgressStarted(true);
                toast("Boot sequence paused", {
                  description: "Click the waveform or progress bar to initiate.",
                  duration: 8000,
                  icon: <span className="Info_16x16_4 inline-block w-4 h-4 bg-contain" />,
                });
              }}
            >
              <Progress value={progress} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IntroPhase; 