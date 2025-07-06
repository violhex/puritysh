"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DirectoryLabelProps {
  path?: string;
}

export function DirectoryLabel({ path }: DirectoryLabelProps) {
  return (
    <AnimatePresence>
      {path && (
        <motion.span
          key={path}
          className="absolute left-1/2 top-0 z-35 pointer-events-none font-mono"
          style={{
            transform: "translateX(-50%)",
            height: 50,
            display: "flex",
            alignItems: "flex-end",
            paddingBottom: 4,
            color: "#c0c0c0",
            textShadow: "1px 1px 0 #000",
            fontSize: 12,
          }}
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {path}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default DirectoryLabel; 