"use client";

import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import styles from "./AmountReceivedCard.module.scss";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

type RowTag = {
  text: string;
  /** `green` = paid, `amber` = pending/later, `grey` = neutral */
  variant: "green" | "amber" | "grey";
};

const ROW_TAG_CLASS: Record<RowTag["variant"], string> = {
  green: styles.bg_e7f6ee__1,
  amber: styles.bg_fff7e5__2,
  grey:  styles.bg_f5f5f5__1,
};

export type AmountReceivedCardProps = {
  amountInr: number;
  title: string;
  rows?: readonly { label: string; value: string; tag?: RowTag }[];
  /** Quiet reassurance under the rows (e.g. refundability). */
  note?: string;
  /** `processing` keeps the receipt live (spinner) until the payment settles. */
  status?: "received" | "processing";
  /** Custom icon image to replace the default tick / spinner. */
  iconSrc?: string | StaticImageData;
  /** Background class for the icon container (overrides the green / yellow default). */
  iconBgClassName?: string;
  /** `glass` — frosted gradient surface used on the manage-booking overlay. */
  variant?: "default" | "glass";
};

/** What she slides across the desk after money moves — a clean receipt. */
export function AmountReceivedCard({
  amountInr,
  title,
  rows,
  note,
  status = "received",
  iconSrc,
  iconBgClassName,
  variant = "default",
}: AmountReceivedCardProps) {
  const processing = status === "processing";
  const isGlass = variant === "glass";
  const defaultBg = processing ? styles.bg_fff7e5__3 : styles.bg_e7f6ee__4;
  return (
    <div
      className={cn(
        isGlass ? OVERLAY_GLASS_CARD_CLASS : styles.overflow_hidden_39, "card-elevated",
      )}
    >
      <div className={styles.flex_0}>
        <span
          className={cn(
            styles.flex_53,
            iconBgClassName ?? defaultBg,
          )}
        >
          {iconSrc ? (
            <Image src={iconSrc} alt="" width={20} height={20} className={styles.object_contain_1} unoptimized />
          ) : processing ? (
            <span
              className={styles.h_5_2}
              aria-hidden
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12.5l4.2 4.2L19 7"
                stroke="#0fa457"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <div className={styles.min_w_0_3}>
          <p className={styles.text_xl_4}>
            {formatInr(amountInr)}
          </p>
          <p className={styles.text_xs_5}>{title}</p>
        </div>
      </div>
      {rows?.length ? (
        <div className={styles.border_t_6}>
          <div className={styles.flex_7}>
            {rows.map((row) => (
              <div key={row.label} className={styles.flex_8}>
                <span className={styles.flex_9}>
                  {row.label}
                  {row.tag ? (
                    <span
                      className={cn(
                        styles.shrink_0_54,
                        ROW_TAG_CLASS[row.tag.variant],
                      )}
                    >
                      {row.tag.text}
                    </span>
                  ) : null}
                </span>
                <span className={styles.text_sm_10}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {note ? (
        <div className={cn(styles.border_t_55, !isGlass && styles.bg_fafafa__56)}>
          <p className={styles.text_xs_5}>{note}</p>
        </div>
      ) : null}
    </div>
  );
}
