"use client";

import {
  MODIFY_SELECTION_REVIEW_PAY_DEMO_DEFINITIONS,
  MODIFY_SELECTION_REVIEW_PAY_DEMO_SCENARIOS,
  type ModifySelectionReviewPayDemoScenario,
} from "@/lib/modify-selection-review-pay-demo";
import { cn } from "@/lib/utils";
import styles from "./ModifySelectionReviewPayDemoSwitcher.module.scss";

type ModifySelectionReviewPayDemoSwitcherProps = {
  value: ModifySelectionReviewPayDemoScenario;
  onChange: (scenario: ModifySelectionReviewPayDemoScenario) => void;
};

/**
 * Demo / QA control — preview booking-amount cases on review-and-pay.
 */
export function ModifySelectionReviewPayDemoSwitcher({
  value,
  onChange,
}: ModifySelectionReviewPayDemoSwitcherProps) {
  return (
    <div className={styles.wrap}>
      <p className={styles.caption}>
        Booking amount cases <span className={styles.demoTag}>· demo</span>
      </p>
      <div
        className={styles.tablist}
        role="tablist"
        aria-label="Booking amount demo scenarios"
      >
        {MODIFY_SELECTION_REVIEW_PAY_DEMO_SCENARIOS.map((id) => {
          const selected = value === id;
          const { label } = MODIFY_SELECTION_REVIEW_PAY_DEMO_DEFINITIONS[id];
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
