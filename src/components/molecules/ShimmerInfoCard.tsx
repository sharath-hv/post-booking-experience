import type { ReactNode } from "react";

import { cn } from "@/utils/utils";
import styles from "./ShimmerInfoCard.module.scss";

export type ShimmerInfoCardProps = {
  /** Bold header line, e.g. “A quick heads-up”. */
  lead?: string;
  children: ReactNode;
  className?: string;
};

/** Bullet list under a lead — used by the KYC quick-check callout. */
export function ShimmerInfoCheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className={styles.checkList}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Highlighted info callout: amber outline, soft gradient, shimmer sweep.
 * Optional lead sits on its own line; body follows below. No icon.
 */
export function ShimmerInfoCard({ lead, children, className }: ShimmerInfoCardProps) {
  return (
    <div className={cn(styles.next_step_shimmer_0, "next-step-shimmer", className)}>
      <div className={styles.text_xs_3}>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        {children != null ? <div className={styles.body}>{children}</div> : null}
      </div>
    </div>
  );
}
