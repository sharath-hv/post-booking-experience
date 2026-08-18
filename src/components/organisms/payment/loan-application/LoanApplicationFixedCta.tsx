"use client";

import type { ReactNode } from "react";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { LoanApplicationPageStagger } from "@/components/organisms/payment/loan-application/LoanApplicationPageStagger";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import styles from "./LoanApplicationFixedCta.module.scss";


type LoanApplicationFixedCtaProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children?: ReactNode;
  /** When set, CTA fades in after main content (ms). Omit to show immediately. */
  staggerDelayMs?: number;
  /** False when this click only opens a sheet. Default true (navigates). */
  showsLoader?: boolean;
};

export function LoanApplicationFixedCta({
  label,
  onClick,
  disabled = false,
  children,
  staggerDelayMs,
  showsLoader = true,
}: LoanApplicationFixedCtaProps) {
  const { loading, start } = useCtaNavigation();

  const handleClick = () => {
    if (disabled) return;
    if (showsLoader) {
      start(onClick);
      return;
    }
    onClick();
  };

  const inner = (
    <div className={styles.mx_auto_0}>
      {children}
      <PrimaryCta
          disabled={disabled}
          loading={showsLoader && loading}
          onClick={handleClick}
          className={styles.primary_cta_1}
        >
          {label}
        </PrimaryCta>
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
