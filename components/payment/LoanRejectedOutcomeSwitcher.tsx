"use client";

import {
  LOAN_REJECTED_OUTCOME_DEFINITIONS,
  LOAN_REJECTED_OUTCOMES,
  type LoanRejectedOutcome,
} from "@/lib/loan-rejected-content";
import { cn } from "@/lib/utils";
import styles from "./LoanRejectedOutcomeSwitcher.module.scss";

type LoanRejectedOutcomeSwitcherProps = {
  value: LoanRejectedOutcome;
  onChange: (outcome: LoanRejectedOutcome) => void;
};

/**
 * Demo / QA control: preview post-rejection analysis outcomes on one screen.
 */
export function LoanRejectedOutcomeSwitcher({
  value,
  onChange,
}: LoanRejectedOutcomeSwitcherProps) {
  return (
    <div className={styles.wrap}>
      <p className={styles.caption}>
        Loan outcome <span className={styles.demoTag}>· demo</span>
      </p>
      <div
        className={styles.tablist}
        role="tablist"
        aria-label="Loan rejection analysis outcomes"
      >
        {LOAN_REJECTED_OUTCOMES.map((id) => {
          const selected = value === id;
          const { label } = LOAN_REJECTED_OUTCOME_DEFINITIONS[id];
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(id)}
              className={cn(styles.tab, selected ? styles.tabSelected : styles.tabIdle)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
