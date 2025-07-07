"use client";

import React from "react";
import SystemString from "./SystemString";
import TypewriterFeed from "./TypewriterFeed";
import { motion } from "framer-motion";
import { Window, WindowContent, ScrollView } from "react95";

const TerminalFeed: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className={className}
  >
    <Window variant="outside" className="w-[80vw] max-w-xl mx-auto">
      <WindowContent className="p-2 bg-black text-white font-home-video text-xs">
        <ScrollView style={{ height: "40vh" }}>
          <SystemString />
          <div className="mt-2">
            <TypewriterFeed />
          </div>
        </ScrollView>
      </WindowContent>
    </Window>
  </motion.div>
);

export default TerminalFeed; 