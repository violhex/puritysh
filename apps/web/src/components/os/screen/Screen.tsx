"use client";

import React from "react";
import { BootRouter } from "@/components/screens/boot";

export type ScreenVariant = "boot" | "content";

interface ScreenProps {
  /** Which screen variant to render */
  current: ScreenVariant;
  /** Callback when boot finishes (required if current = "boot") */
  onBootFinish?: () => void;
  /** Children used when current === "content" */
  children?: React.ReactNode;
}

/**
 * Screen – The active display area that sits INSIDE the Frame bezel.
 * It automatically offsets itself by the bezel padding (32px mobile / 50px desktop).
 */
const Screen: React.FC<ScreenProps> = ({ current, onBootFinish, children }) => {
  const wrapperCls =
    "absolute inset-0 p-[32px] md:p-[50px] overflow-hidden z-[50]";

  const screenBoxCls =
    "relative w-full h-full bg-black border-2 border-[#3a3a3a] shadow-[inset_0_0_0_1px_#000]";

  switch (current) {
    case "boot":
      return (
        <div className={wrapperCls}>
          <div className={screenBoxCls}>
            <BootRouter onDone={onBootFinish ?? (() => {})} />
          </div>
        </div>
      );

    case "content":
    default:
      return (
        <div className={wrapperCls}>
          <div className={screenBoxCls}>{children}</div>
        </div>
      );
  }
};

export default Screen; 