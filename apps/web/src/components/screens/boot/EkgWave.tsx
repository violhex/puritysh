"use client";

import React, { useEffect, useRef } from "react";
import { useAudioPlayer } from "@/stores/useAudioPlayer";

interface EkgWaveProps {
  intensity?: number; // legacy prop kept for amplitude scaling
  source?: HTMLAudioElement | null;
  className?: string;
}

/** Simple canvas waveform renderer – not medically accurate, just aesthetic */
const EkgWave: React.FC<EkgWaveProps> = ({ intensity = 1, source, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultAudio: HTMLAudioElement | null = (useAudioPlayer.getState() as any).getAudio?.() ?? null;

  // Keep latest intensity without retriggering audio graph creation
  const intensityRef = useRef(intensity);
  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  // subscribe to player state for reactive sensitivity
  useAudioPlayer((s) => {
    playingRef.current = s.isPlaying;
  });

  // We keep a single shared AudioContext for the whole module to avoid context-mix issues.
  // Browsers limit the number of active contexts and connecting nodes across different
  // contexts throws InvalidAccessError.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getSharedCtx = () => {
    if (audioCtxRef.current) return audioCtxRef.current;
    // eslint-disable-next-line no-restricted-globals
    if (!(globalThis as any).__purity_audio_ctx) {
      // resume automatically on first interaction when suspended
      // (Safari starts suspended by default)
      (globalThis as any).__purity_audio_ctx = new AudioContext();
    }
    audioCtxRef.current = (globalThis as any).__purity_audio_ctx as AudioContext;
    return audioCtxRef.current;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const audio = source ?? defaultAudio;
    if (!audio) return;

    const audioCtx = getSharedCtx();

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048; // higher resolution for smoother waveform
    analyser.smoothingTimeConstant = 0.8;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray: Uint8Array = new Uint8Array(bufferLength) as Uint8Array;

    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    // Ensure MediaElementSource uses SAME context
    let srcNode: MediaElementAudioSourceNode | null = null;
    try {
      srcNode = (audio as any)._mediaElementSource ?? null;
      if (!srcNode) {
        srcNode = audioCtx.createMediaElementSource(audio);
        // store for reuse
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (audio as any)._mediaElementSource = srcNode;
      }
      srcNode.connect(analyser);
    } catch (_) {
      // Already connected – ignore
    }

    analyser.connect(audioCtx.destination);
    srcRef.current = audio;

    // Make sure context is running so audio is heard (especially for boot SFX)
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      if (!analyserRef.current || !dataArrayRef.current) return;
      // Keep context alive & resumed on user interaction / playback
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended" && playingRef.current) {
        audioCtxRef.current.resume().catch(() => {});
      }

      (analyserRef.current as any).getByteTimeDomainData(dataArrayRef.current as Uint8Array);

      ctx.strokeStyle = "#c0c0c0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const sliceWidth = width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayRef.current[i] / 128 - 1; // convert to -1..1 waveform
        const y = height / 2 + v * height * 0.9 * intensityRef.current;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      requestAnimationFrame(draw);
    };
    draw();

    return () => {
      try {
        srcNode?.disconnect();
      } catch (_) {
        /* ignore */
      }
      analyser.disconnect();
    };
  }, [source, defaultAudio]);

  return <canvas ref={canvasRef} width={600} height={60} className={className} style={{ maxWidth: "100%" }} />;
};

export default EkgWave; 