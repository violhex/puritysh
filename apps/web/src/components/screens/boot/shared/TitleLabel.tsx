import { motion } from "framer-motion";

/**
 * Large boot title shown below the logo. Designed for reuse by Intro and Consent phases.
 */
export default function TitleLabel() {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="font-xaphan text-3xl tracking-widest select-none"
    >
      PURITY.SH
    </motion.span>
  );
} 