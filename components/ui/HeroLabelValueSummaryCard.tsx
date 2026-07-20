import type { ReactNode } from "react";
import styles from "./HeroLabelValueSummaryCard.module.scss";


export type HeroLabelValueSummaryCardProps = {
  label: string;
  value: ReactNode;
  description: ReactNode;
  /** Accessible name for the card region. */
  ariaLabel?: string;
};

/**
 * Hero callout — label + value row, dashed divider, body copy (Figma sanctioned-amount pattern).
 */
export function HeroLabelValueSummaryCard({
  label,
  value,
  description,
  ariaLabel = "Summary",
}: HeroLabelValueSummaryCardProps) {
  return (
    <section
      className={[styles.w_full_0, "card-elevated"].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
    >
      <dl className={styles.m_0_1}>
        <dt className={styles.text_sm_2}>{label}</dt>
        <dd className={styles.text_base_3}>{value}</dd>
      </dl>

      <hr className={styles.my_3_4} />

      <p className={styles.text_xs_5}>{description}</p>
    </section>
  );
}
