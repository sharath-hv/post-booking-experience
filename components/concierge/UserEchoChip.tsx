"use client";

import { cn } from "@/lib/utils";
import styles from "./UserEchoChip.module.scss";


export type UserEchoChipProps = {
  /** The user's last reply, landing on this turn. */
  text: string;
  className?: string;
};

/**
 * Your side of the conversation — a single sent-message chip, right-aligned.
 * Only ever one on screen; the thread never accumulates.
 */
export function UserEchoChip({ text, className }: UserEchoChipProps) {
  return (
    <div className={cn(styles.flex_3, className)}>
      <div className={[styles.concierge_echo_in_0, "concierge-echo-in"].filter(Boolean).join(" ")}>
        <span className={styles.text_sm_1}>{text}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className={styles.shrink_0_2}>
          <path
            d="M5 13l4 4L19 7"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
