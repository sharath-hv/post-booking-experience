"use client";

import Image from "next/image";

import tickIcon from "@/assets/tick01.svg";
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
        <Image
          src={tickIcon}
          alt=""
          width={14}
          height={14}
          aria-hidden
          className={styles.shrink_0_2}
          unoptimized
        />
      </div>
    </div>
  );
}
