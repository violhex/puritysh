"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NOISE_SVG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIxIiB5PSIyIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIi8+PC9zdmc+";

interface OuterBezelProps {
  className?: string;
}

export function OuterBezel({ className }: OuterBezelProps) {
  return (
    <motion.div
      role="presentation"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "fixed inset-0 pointer-events-none z-30",
        "bg-[color:var(--frame)] shadow-[0_0_0_3px_var(--shadow)]",
        "after:absolute after:inset-0 after:[box-shadow:inset_0_0_0_1px_var(--highlight)]",
        className,
      )}
      style={{
        "--frame": "#8f8f8f",
        "--highlight": "#ffffff",
        "--shadow": "#000000",
      } as React.CSSProperties}
    >
      {/* subtle noise */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url(${NOISE_SVG})`, backgroundRepeat: "repeat" }}
      />
    </motion.div>
  );
}

export default OuterBezel; 