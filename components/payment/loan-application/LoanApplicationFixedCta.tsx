"use client";

import type { ReactNode } from "react";

import { LoanApplicationPageStagger } from "@/components/payment/loan-application/LoanApplicationPageStagger";
import styles from "./LoanApplicationFixedCta.module.scss";


type LoanApplicationFixedCtaProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children?: ReactNode;
  /** When set, CTA fades in after main content (ms). Omit to show immediately. */
  staggerDelayMs?: number;
};

export function LoanApplicationFixedCta({
  label,
  onClick,
  disabled = false,
  children,
  staggerDelayMs,
}: LoanApplicationFixedCtaProps) {
  const inner = (
    <div className={styles.mx_auto_0}>
      {children}
      <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className={[styles.primary_cta_1, "primary-cta"].filter(Boolean).join(" ")}
        >
          {label}
        </button>
    </div>
  );

  return (
    <div className={[styles.fixed_2, "footer-elevated"].filter(Boolean).join(" ")}>
      {staggerDelayMs != null ? (
        <LoanApplicationPageStagger delayMs={staggerDelayMs}>{inner}</LoanApplicationPageStagger>
      ) : (
        inner
      )}
    </div>
  );
}
