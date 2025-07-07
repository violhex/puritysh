"use client";

import React, { useEffect, useState } from "react";
import { collectDiag } from "./browserInfo";

function useTypewriter(lines: string[], msPerChar = 12, jitter = 3) {
  const [printed, setPrinted] = useState<string[]>([]);
  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let buf = "";

    const id = setInterval(() => {
      if (lineIdx >= lines.length) return;
      buf += lines[lineIdx][charIdx++];
      if (charIdx >= lines[lineIdx].length) {
        setPrinted((prev) => [...prev, buf]);
        buf = "";
        charIdx = 0;
        lineIdx++;
      }
    }, msPerChar + Math.random() * jitter);

    return () => clearInterval(id);
  }, [lines, msPerChar, jitter]);

  return printed;
}

const TypewriterFeed: React.FC<{ className?: string }> = ({ className }) => {
  const diag = collectDiag();
  const lines = diag.map((d) =>
    `[ ${d.ok ? " OK  " : "WARN"} ] ${d.label.padEnd(24, ".")} ${String(d.value)}`,
  );
  const printed = useTypewriter(lines);

  return (
    <pre className={className} aria-live="polite">
      {printed.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </pre>
  );
};

export default TypewriterFeed; 