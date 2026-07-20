"use client";

import {
  KYC_VERIFICATION_FAILURE_REASONS,
  KYC_VERIFICATION_FAILED_VARIANTS,
  type KycVerificationFailureReason,
} from "@/components/kyc/kyc-verification-failed-content";
import styles from "./VerificationFailureReasonSwitcher.module.scss";
import { cn } from "@/lib/utils";

type VerificationFailureReasonSwitcherProps = {
  value: KycVerificationFailureReason;
  onChange: (reason: KycVerificationFailureReason) => void;
};

/**
 * Demo / QA control — preview the three verification failure messages on one screen.
 */
export function VerificationFailureReasonSwitcher({
  value,
  onChange,
}: VerificationFailureReasonSwitcherProps) {
  return (
    <div
      className={styles.flex_0}
      role="tablist"
      aria-label="Verification failure reason"
    >
      {KYC_VERIFICATION_FAILURE_REASONS.map((id) => {
        const selected = value === id;
        const { label } = KYC_VERIFICATION_FAILED_VARIANTS[id];
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(id)}
            className={cn(styles.min_w_0_0, selected ? styles.bg_white_0 : styles.text_6b7280__0)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
