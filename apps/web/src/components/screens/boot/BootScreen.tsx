"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "react95";
import LogoPulse from "./LogoPulse";
import EkgWave from "./EkgWave";
import ConsentForm from "./ConsentForm";
import { PROGRESS_DURATION, EKG_DELAY, WELCOME_DURATION } from "./constants";
import { useAudioPlayer } from "@/stores/useAudioPlayer";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { showR95Toast } from "@/components/ui/r95-toast";

export interface BootScreenProps {
  /** Callback fired when the user presses any key or clicks after the sequence */
  onFinish: () => void;
}

/**
 * BootScreen – Orchestrates the PurityOS boot sequence (logo pulse → system string →
 * diagnostic feed → continue prompt) and plays the startup SFX.
 */
type Phase = "logo" | "ekg" | "progress" | "welcome" | "consent" | "ready";

const BootScreen: React.FC<BootScreenProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<Phase>("logo");
  const [progress, setProgress] = useState(0);
  const [progressStarted, setProgressStarted] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [bootEl, setBootEl] = useState<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastShownRef = useRef(false);

  const { play } = useAudioPlayer((s) => ({ play: s.play }));

  const { data: bootFx } = useQuery(trpc.soundfx.getByTitle.queryOptions({ title: "boot_sequence_audio" }));

  // Has the user previously accepted the Data & Privacy consent?
  const consentGiven = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem("purity_consent") === "true";
    } catch (_) {
      return false;
    }
  }, []);

  // play startup sfx during progress phase
  useEffect(() => {
    if (phase === "progress" && progressStarted && bootFx?.src) {
      const sfx = new Audio(bootFx.src);
      sfx.crossOrigin = "anonymous";
      audioRef.current = sfx;
      sfx.volume = 0.6;
      sfx.play().catch(() => {});
      setBootEl(sfx);

      const startedAt = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startedAt;
        const pct = Math.min(100, (elapsed / PROGRESS_DURATION) * 100);
        setProgress(pct);
        if (pct < 100) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);

      sfx.onended = () => {
        setProgress(100);
        setPhase("welcome");
      };

      return () => {
        sfx.pause();
      };
    }
  }, [phase, progressStarted, bootFx]);

  // Attempt to resume SFX on first user interaction if autoplay blocked
  useEffect(() => {
    function resumeAudio() {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      // Also resume shared AudioContext if still suspended
      // eslint-disable-next-line no-restricted-globals
      const ctx: AudioContext | undefined = (globalThis as any).__purity_audio_ctx;
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      document.removeEventListener("pointerdown", resumeAudio);
      document.removeEventListener("keydown", resumeAudio);
    }
    if (phase === "progress") {
      document.addEventListener("pointerdown", resumeAudio);
      document.addEventListener("keydown", resumeAudio);
    }
    return () => {
      document.removeEventListener("pointerdown", resumeAudio);
      document.removeEventListener("keydown", resumeAudio);
    };
  }, [phase]);

  /* ---------- auto advance phases ---------- */
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
    if (phase === "welcome") {
      const id = setTimeout(() => {
        if (consentGiven) {
          // User already consented previously – proceed automatically
          play();
          onFinish();
        } else {
          // auto advance to consent if user doesn't click after delay
          setPhase("consent");
        }
      }, WELCOME_DURATION + 1000);
      return () => clearTimeout(id);
    }
    if (phase === "consent") {
      // waiting for user interaction
    }
  }, [phase, play, consentGiven, onFinish]);

  /* ---------- exit handler ---------- */
  const maybeExit = useCallback(() => {
    if (phase === "ready") onFinish();
  }, [phase, onFinish]);

  useEffect(() => {
    const handler = () => maybeExit();
    window.addEventListener("keydown", handler);
    window.addEventListener("mousedown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("mousedown", handler);
    };
  }, [maybeExit]);

  const stackSpacing = phase === "consent" ? "gap-4" : "gap-6";

  const topOffsetClass = phase === "consent" ? "top-[45%]" : "top-1/2";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white font-home-video text-sm select-none">
      {/* Centre stack */}
      <div className={`absolute left-1/2 ${topOffsetClass} -translate-x-1/2 -translate-y-1/2 flex flex-col items-center ${stackSpacing}`}>
        {/* Logo */}
        <LogoPulse amplitude={0.08} className="scale-75" />

        {/* Site title */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: phase !== "logo" ? 1 : 0.6 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-xaphan text-3xl tracking-widest select-none"
        >
          PURITY.SH
        </motion.span>

        {/* EKG */}
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
              <EkgWave source={bootEl ?? undefined} intensity={1} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress */}
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
                // Show system toast prompting user to click
                toast("Boot sequence paused", {
                  description: "Click the waveform or progress bar to initiate.",
                  duration: 8000,
                  icon: (<span className="Info_16x16_4 inline-block w-4 h-4 bg-contain" />),
                });
              }}
            >
              <Progress value={progress} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome text clickable */}
        <AnimatePresence>
          {phase === "welcome" && (
            <motion.button
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="font-satonda text-lg mt-3 animate-pulse focus:outline-none"
              onClick={() => {
                if (consentGiven) {
                  play();
                  onFinish();
                } else {
                  setPhase("consent");
                }
              }}
            >
              Welcome To PurityOS – Click To Continue
            </motion.button>
          )}
        </AnimatePresence>

        {/* Consent Form */}
        {phase === "consent" && (
          <ConsentForm
            onAccept={() => {
              play();
              onFinish();
            }}
          />
        )}
      </div>

      {/* Ready phase prompt (unused now) */}
      {phase === "ready" && <div className="animate-pulse">➜ Press any key to continue …</div>}
    </div>
  );
};

export default BootScreen; 