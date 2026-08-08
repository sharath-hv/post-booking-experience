"use client";

import { cn } from "@/lib/utils";
import styles from "./aurora-light-layer.module.scss";

export type AuroraLightLayerProps = {
  className?: string;
  /** Radial fade — desktop favors top-right; mobile uses a wider centered ellipse so the glow reads on narrow viewports. */
  showRadialGradient?: boolean;
};

/**
 * Light-only aurora mesh. For cards and sections on white/light UI.
 * Mobile: stronger opacity, softer blur, full-bleed insets, larger background-size so motion stays visible on small screens / iOS Safari.
 */
export function AuroraLightLayer({ className, showRadialGradient = true }: AuroraLightLayerProps) {
  return (
    <div className={cn(styles.root, className)} aria-hidden>
      <div
        className={cn(
          styles.mesh,
          "aurora-light-layer-motion",
          showRadialGradient && styles.meshMasked,
        )}
      />
    </div>
  );
}
