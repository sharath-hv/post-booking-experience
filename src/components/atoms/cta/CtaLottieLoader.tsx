"use client";

import { useMemo } from "react";
import Lottie from "lottie-react";

import ctaLoaderLottie from "@/assets/cta-loader.json";
import { useReducedMotion } from "@/lib/animations/utils";

import styles from "./CtaLottieLoader.module.scss";

type CtaLottieLoaderProps = {
  /** `onDark` = white + grey (primary CTA). `onLight` = black + grey (soft CTA). */
  tone?: "onDark" | "onLight";
};

const WHITE = [1, 1, 1];
const DARK = [18 / 255, 18 / 255, 18 / 255];

function recolorActiveDots(data: unknown, color: readonly number[]): unknown {
  const cloned = structuredClone(data) as Record<string, unknown>;

  const nearWhite = (k: number[]) =>
    k.length >= 3 && k[0] === 1 && k[1] === 1 && k[2] === 1;

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node == null || typeof node !== "object") return;
    const rec = node as Record<string, unknown>;
    if (rec.ty === "fl" && rec.c && typeof rec.c === "object") {
      const fill = rec.c as { k?: unknown };
      if (Array.isArray(fill.k) && nearWhite(fill.k as number[])) {
        const alpha = (fill.k as number[])[3] ?? 1;
        fill.k = [...color, alpha];
      }
    }
    Object.values(rec).forEach(walk);
  };

  walk(cloned);
  return cloned;
}

/** 24×24 bouncing-dot loader for navigate CTAs. */
export function CtaLottieLoader({ tone = "onDark" }: CtaLottieLoaderProps) {
  const reduceMotion = useReducedMotion();
  const animationData = useMemo(
    () =>
      tone === "onLight"
        ? recolorActiveDots(ctaLoaderLottie, DARK)
        : ctaLoaderLottie,
    [tone],
  );

  if (reduceMotion) {
    return (
      <span className={styles.staticDots} aria-hidden>
        •••
      </span>
    );
  }

  return (
    <Lottie
      animationData={animationData}
      loop
      className={styles.loader}
      aria-hidden
    />
  );
}
