import type { ReactNode } from "react";

import { OVERLAY_GLASS_CARD_CLASS } from "@/helpers/overlay-glass-card";
import { cn } from "@/utils/utils";

import styles from "./Surface.module.scss";

export type SurfaceProps = {
  children: ReactNode;
  variant?: "solid" | "glass";
  padding?: "none" | "md";
  elevated?: boolean;
  className?: string;
};

/** Card shell — solid bordered white or overlay glass. */
export function Surface({
  children,
  variant = "solid",
  padding = "none",
  elevated = false,
  className,
}: SurfaceProps) {
  return (
    <div
      className={cn(
        variant === "glass" ? OVERLAY_GLASS_CARD_CLASS : styles.solid,
        padding === "md" && styles.padMd,
        elevated && "card-elevated",
        className,
      )}
    >
      {children}
    </div>
  );
}
