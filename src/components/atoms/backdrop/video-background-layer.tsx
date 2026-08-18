"use client";

import { cn } from "@/utils/utils";
import { publicAssetPath } from "@/utils/public-asset-path";
import styles from "./video-background-layer.module.scss";

export type VideoBackgroundLayerProps = {
  className?: string;
};

/**
 * Looping video backdrop — experiment alternative to AuroraLightLayer.
 * Framing: scale 1, pos 56% 0%, opacity 0.25, radial mask on.
 */
export function VideoBackgroundLayer({ className }: VideoBackgroundLayerProps) {
  return (
    <div className={cn(styles.root, className)} aria-hidden>
      <video
        className={styles.video}
        src={publicAssetPath("aurora-bg.mp4")}
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
