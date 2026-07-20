"use client";

import { BUYING_GUIDE_STEP_COUNT } from "@/components/kyc/buying-guide-content";
import styles from "./BuyingGuideProgress.module.scss";


type BuyingGuideProgressProps = {
  currentStep: number;
};

/**
 * Header progress — three segments with 8px gaps; each fills when its step is reached.
 */
export function BuyingGuideProgress({ currentStep }: BuyingGuideProgressProps) {
  return (
    <div
      className={styles.flex_0}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={BUYING_GUIDE_STEP_COUNT}
      aria-valuenow={currentStep}
      aria-label={`Step ${currentStep} of ${BUYING_GUIDE_STEP_COUNT}`}
    >
      {Array.from({ length: BUYING_GUIDE_STEP_COUNT }, (_, index) => {
        const segmentStep = index + 1;
        const filled = segmentStep <= currentStep;

        return (
          <div
            key={segmentStep}
            className={styles.h_full_1}
            aria-hidden
          >
            {filled ? <div className={styles.segment_fill} /> : null}
          </div>
        );
      })}
    </div>
  );
}
