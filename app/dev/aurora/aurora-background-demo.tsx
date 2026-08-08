"use client";

import { useState } from "react";

import { useReducedMotion } from "@/lib/animations/utils";
import { publicAssetPath } from "@/lib/public-asset-path";
import styles from "./aurora-background-demo.module.scss";

type BgControls = {
  scale: number;
  posX: number;
  posY: number;
  opacity: number;
  mask: boolean;
};

const DEFAULTS: BgControls = {
  scale: 1,
  posX: 56,
  posY: 0,
  opacity: 0.4,
  mask: true,
};

/**
 * Dev-only experiment: video backdrop in place of AuroraLightLayer.
 * Does not affect production concierge / KYC screens.
 */
export function AuroraBackgroundDemo() {
  const reduceMotion = useReducedMotion();
  const [controls, setControls] = useState<BgControls>(DEFAULTS);

  const set = <K extends keyof BgControls>(key: K, value: BgControls[K]) => {
    setControls((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.shell}>
      {!reduceMotion ? (
        <div
          className={styles.videoLayer}
          data-mask={controls.mask ? "on" : "off"}
          aria-hidden
        >
          <video
            className={styles.video}
            src={publicAssetPath("aurora-bg.mp4")}
            autoPlay
            muted
            loop
            playsInline
            style={{
              opacity: controls.opacity,
              objectPosition: `${controls.posX}% ${controls.posY}%`,
              transform: `scale(${controls.scale})`,
              transformOrigin: `${controls.posX}% ${controls.posY}%`,
            }}
          />
        </div>
      ) : null}

      <div className={styles.content}>
        <div className={styles.headline}>Video background experiment</div>
        <div className={styles.subline}>
          Drag the sliders — values update live. Dev-only page.
        </div>
      </div>

      <aside className={styles.panel} aria-label="Background controls">
        <div className={styles.panelTitle}>Background</div>

        <label className={styles.control}>
          <span>Scale {controls.scale.toFixed(2)}×</span>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.05}
            value={controls.scale}
            onChange={(e) => set("scale", Number(e.target.value))}
          />
        </label>

        <label className={styles.control}>
          <span>Pos X {controls.posX}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={controls.posX}
            onChange={(e) => set("posX", Number(e.target.value))}
          />
        </label>

        <label className={styles.control}>
          <span>Pos Y {controls.posY}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={controls.posY}
            onChange={(e) => set("posY", Number(e.target.value))}
          />
        </label>

        <label className={styles.control}>
          <span>Opacity {controls.opacity.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={controls.opacity}
            onChange={(e) => set("opacity", Number(e.target.value))}
          />
        </label>

        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={controls.mask}
            onChange={(e) => set("mask", e.target.checked)}
          />
          <span>Radial mask</span>
        </label>

        <button
          type="button"
          className={styles.reset}
          onClick={() => setControls(DEFAULTS)}
        >
          Reset
        </button>

        <pre className={styles.values}>
          {`scale: ${controls.scale}
pos: ${controls.posX}% ${controls.posY}%
opacity: ${controls.opacity}
mask: ${controls.mask}`}
        </pre>
      </aside>
    </div>
  );
}
