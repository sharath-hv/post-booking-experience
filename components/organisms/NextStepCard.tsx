"use client";

import Image from "next/image";

import otpCallIcon from "@/assets/OTP_Call.svg";
import { IconWell } from "@/components/molecules/IconWell";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import { cn } from "@/lib/utils";
import styles from "./NextStepCard.module.scss";

export type NextStepCardProps = {
  /** Tight imperative — e.g. “Pick up my call”. */
  title: string;
  body: string;
};

/**
 * The user's single pending action. Glass artifact surface + purple icon node.
 * Stakes go in a ShimmerInfoCard next to it, not in here.
 */
export function NextStepCard({ title, body }: NextStepCardProps) {
  return (
    <div className={cn(styles.card, OVERLAY_GLASS_CARD_CLASS)}>
      <div className={styles.flex_32}>
        <IconWell aria-hidden className={styles.iconTone}>
          <Image
            src={otpCallIcon}
            alt=""
            width={20}
            height={20}
            className={styles.shrink_0_36}
            unoptimized
          />
        </IconWell>
        <div className={styles.min_w_0_3}>
          <p className={styles.text_base_37}>{title}</p>
          <p className={styles.mt_1_38}>{body}</p>
        </div>
      </div>
    </div>
  );
}
