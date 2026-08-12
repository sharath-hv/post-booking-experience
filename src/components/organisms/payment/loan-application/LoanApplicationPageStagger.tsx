"use client";

import type { ReactNode } from "react";

import { RevealStagger } from "@/components/molecules/stagger-container";

type LoanApplicationPageStaggerProps = {
  children: ReactNode;
  className?: string;
  /** Delay in milliseconds (nav / milestone / CTA chrome stay immediate). */
  delayMs: number;
};

export function LoanApplicationPageStagger({
  children,
  className = "",
  delayMs,
}: LoanApplicationPageStaggerProps) {
  return (
    <RevealStagger className={className} delay={delayMs / 1000}>
      {children}
    </RevealStagger>
  );
}
