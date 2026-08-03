"use client";

import { AuroraLightLayer } from "@/components/atoms/aurora-light-layer";
import { VideoBackgroundLayer } from "@/components/atoms/video-background-layer";
import { useReducedMotion } from "@/lib/animations/utils";
import { useBackdropMode } from "@/lib/concierge/use-backdrop-mode";
import styles from "./experience-backdrop.module.scss";

/**
 * Aurora CSS mesh by default; swaps to the tuned video layer when the
 * manage-menu “Video background” switch is on.
 * Positioned fixed so it does not scroll with page content.
 */
export function ExperienceBackdrop() {
  const [mode] = useBackdropMode();
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.root} aria-hidden>
      {mode === "video" && !reduceMotion ? (
        <VideoBackgroundLayer />
      ) : (
        <AuroraLightLayer />
      )}
    </div>
  );
}
