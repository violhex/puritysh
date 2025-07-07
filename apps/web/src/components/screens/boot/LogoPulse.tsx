"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LogoPulseProps { amplitude?: number; className?: string }

const LogoPulse: React.FC<LogoPulseProps> = ({ amplitude = 0.08, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 1 }}
    animate={{ opacity: [0, 1, 1], scale: [1, 1 + amplitude, 1] }}
    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3, ease: [0.45, 0, 0.55, 1] }}
    aria-hidden="true"
  >
    <Image
      src="/images/logos/logo.png"
      alt="PurityOS logo"
      width={160}
      height={160}
      priority
      unoptimized
      draggable={false}
    />
  </motion.div>
);

export default LogoPulse; 