"use client";

import Image from "next/image";

import phoneIcon from "@/assets/Phone.svg";
import styles from "./NextStepCard.module.scss";

export type NextStepCardProps = {
  /** Tight imperative — e.g. “Pick up my call”. */
  title: string;
  body: string;
};

/**
 * The user's single pending action. Action grammar: purple outline +
 * lavender fill, with a slow radar pulse on the node — something is coming
 * for you. Stakes go in a ShimmerInfoCard next to it, not in here.
 */
export function NextStepCard({ title, body }: NextStepCardProps) {
  return (
    <div className={[styles.rounded_2xl_31, "card-elevated"].filter(Boolean).join(" ")}>
      <div className={styles.flex_32}>
        <span className={styles.relative_33}>
          <span
            aria-hidden
            className={styles.absolute_34}
          />
          <span className={styles.relative_35}>
            <Image
              src={phoneIcon}
              alt=""
              width={20}
              height={20}
              className={styles.shrink_0_36}
              unoptimized
              aria-hidden
            />
          </span>
        </span>
        <div className={styles.min_w_0_3}>
          <p className={styles.text_base_37}>{title}</p>
          <p className={styles.mt_1_38}>{body}</p>
        </div>
      </div>
    </div>
  );
}
