"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import styles from "./TimeSkipChip.module.scss";


export type TimeSkipChipProps = {
  /** e.g. “Next morning” / “2 days later”. */
  label: string;
  href: string;
  /** Side effect before navigating (e.g. record a demo verification failure). */
  onBeforeNavigate?: () => void;
  className?: string;
};

/**
 * Demo-only time travel — the journey plays out over days; this pill stands in
 * for time passing between turns. Prototype chrome, deliberately not product UI.
 */
export function TimeSkipChip({ label, href, onBeforeNavigate, className }: TimeSkipChipProps) {
  const router = useRouter();
  return (
    <div className={cn(styles.flex_2, className)}>
      <button
        type="button"
        className={[styles.time_skip_chip_0, "time-skip-chip"].filter(Boolean).join(" ")}
        onClick={() => {
          onBeforeNavigate?.();
          router.push(href);
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 5v14l8-7-8-7zM13 5v14l8-7-8-7z"
            fill="currentColor"
            fillOpacity="0.7"
          />
        </svg>
        <span>
          {label} <span className={styles.text_a6a6a6__1}>· demo</span>
        </span>
      </button>
    </div>
  );
}
