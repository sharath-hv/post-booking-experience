import type { CSSProperties, ReactNode } from "react";

import infoIcon from "@/assets/Info.svg";
import timeIcon from "@/assets/Time.svg";
import warningIcon from "@/assets/Warning.svg";

import { cn } from "@/lib/utils";
import styles from "./ShimmerInfoCard.module.scss";

type ShimmerInfoIcon = "alert" | "clock" | "info";

const WARNING_ICON_MASK_STYLE = {
  maskImage: `url(${warningIcon.src})`,
  WebkitMaskImage: `url(${warningIcon.src})`,
} satisfies CSSProperties;

const INFO_ICON_MASK_STYLE = {
  maskImage: `url(${infoIcon.src})`,
  WebkitMaskImage: `url(${infoIcon.src})`,
} satisfies CSSProperties;

const CLOCK_ICON_MASK_STYLE = {
  maskImage: `url(${timeIcon.src})`,
  WebkitMaskImage: `url(${timeIcon.src})`,
} satisfies CSSProperties;

export type ShimmerInfoCardProps = {
  /** `alert` for caveats/checks, `clock` for deadlines/expectations, `info` for general information. */
  icon?: ShimmerInfoIcon;
  /** Bold scent-word prefix, e.g. “Quick check:”. */
  lead?: string;
  children: ReactNode;
  className?: string;
};

/**
 * The app's highlighted-info style: amber outline, soft yellow-to-white
 * gradient, shimmer sweep. Use wherever a line of info must not be missed
 * (caveats, deadlines, stakes).
 */
export function ShimmerInfoCard({ icon = "alert", lead, children, className }: ShimmerInfoCardProps) {
  return (
    <div
      className={cn(styles.next_step_shimmer_0, "next-step-shimmer",
        className
      )}
    >
      {icon === "alert" ? (
        <span
          aria-hidden
          className={styles.h_4_0}
          style={WARNING_ICON_MASK_STYLE}
        />
      ) : icon === "info" ? (
        <span
          aria-hidden
          className={styles.h_5_1}
          style={INFO_ICON_MASK_STYLE}
        />
      ) : (
        <span aria-hidden className={styles.clockIcon} style={CLOCK_ICON_MASK_STYLE} />
      )}
      <div className={styles.text_xs_3}>
        {lead ? <span className={styles.font_semibold_4}>{lead} </span> : null}
        {children}
      </div>
    </div>
  );
}
