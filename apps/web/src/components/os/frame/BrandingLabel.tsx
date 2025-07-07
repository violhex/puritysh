"use client";

import { motion } from "framer-motion";

export function BrandingLabel() {
  return (
    <motion.span
      className="absolute left-1/2 top-0 z-35 select-none font-bold"
      style={{
        transform: "translateX(-50%)",
        height: 50,
        display: "flex",
        alignItems: "center",
        color: "#ffffff",
        textShadow: "1px 1px 0 #000",
        fontSize: 14,
      }}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      PurityOS
    </motion.span>
  );
}

export default BrandingLabel;