"use client";

import React, { useEffect, useRef } from "react";

export interface SparkleTrailProps {
  /** Hex or any valid CSS color. When omitted we fall back to `--accent` CSS variable. */
  color?: string;
  /** Maximum particles kept in memory / on screen. */
  maxParticles?: number;
  /** Force enable / disable. Undefined → follow prefers-reduced-motion. */
  enabled?: boolean;
}

/* ------------------------------------------------------------------ */
/** Convert a hex colour (#rrggbb or #rgb) to "r,g,b" string. */
const hex2rgb = (hex: string) => {
  let h = hex.replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const num = parseInt(h, 16);
  // eslint-disable-next-line no-bitwise
  const r = (num >> 16) & 255;
  // eslint-disable-next-line no-bitwise
  const g = (num >> 8) & 255;
  // eslint-disable-next-line no-bitwise
  const b = num & 255;
  return `${r},${g},${b}`;
};

export const SparkleTrail: React.FC<SparkleTrailProps> = ({
  color,
  maxParticles = 150,
  enabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (enabled === false || (enabled === undefined && prefersReduce)) return;

    /* ------------------- canvas bootstrap ------------------- */
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------------------- particles ----------------------- */
    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number; // ms remaining
    }
    const particles: P[] = [];

    const spawn = (e: PointerEvent) => {
      if (particles.length > maxParticles) particles.shift();
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() * 2 - 1) * 10,
        vy: 20 + Math.random() * 20,
        life: 600,
      });
    };
    window.addEventListener("pointermove", spawn);

    /* --------------------- render loop ---------------------- */
    const col = color || getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#ff5ef7";
    const rgb = hex2rgb(col.trim());

    let prev = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw + update
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }
        p.x += p.vx * (dt / 1000);
        p.y += p.vy * (dt / 1000);
        const alpha = (p.life / 600).toFixed(3);
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.fillRect(p.x, p.y, 3, 3);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* ----------------------- cleanup ------------------------ */
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", spawn);
      cancelAnimationFrame(raf);
    };
  }, [color, enabled, maxParticles]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

export default SparkleTrail; 