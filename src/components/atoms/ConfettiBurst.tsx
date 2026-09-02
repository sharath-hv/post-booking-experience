"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { createCannon, fireBasicCannon } from "@/utils/confetti-basic-cannon";
import styles from "./ConfettiBurst.module.scss";

const RESET_MS = 5000;

/**
 * Full-viewport confetti on `document.body` so shell stacking / overflow cannot hide it.
 */
export function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.body);
  }, []);

  useEffect(() => {
    if (target == null) return;
    const canvas = canvasRef.current;
    if (canvas == null) return;

    const fire = createCannon(canvas);
    if (fire == null) return;

    let reset = 0;
    const raf = requestAnimationFrame(() => {
      fireBasicCannon(fire);
      reset = window.setTimeout(() => fire.reset(), RESET_MS);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(reset);
      fire.reset();
    };
  }, [target]);

  if (target == null) return null;

  return createPortal(
    <canvas ref={canvasRef} className={styles.canvas} aria-hidden />,
    target,
  );
}
