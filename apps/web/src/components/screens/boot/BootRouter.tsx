"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IntroPhase from "./phases/IntroPhase";
import ConsentPhase from "./phases/ConsentPhase";

export default function BootRouter({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<"intro" | "consent">("intro");

  // When Intro finishes decide whether consent is needed
  const handleIntroFinish = () => {
    let consentGiven = false;
    try {
      if (typeof window !== "undefined") {
        consentGiven = window.localStorage.getItem("purity_consent") === "true";
      }
    } catch (_) {
      /* ignore */
    }

    if (consentGiven) {
      onDone();
    } else {
      setStep("consent");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === "intro" ? (
        <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <IntroPhase onFinish={handleIntroFinish} />
        </motion.div>
      ) : (
        <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ConsentPhase onAccept={onDone} />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 