"use client";

import { useSearchParams } from "next/navigation";

import { FULL_PAYMENT_BANK_ID } from "@/helpers/paymentUrls";

/**
 * Reads finance query (`bank`, `loan_amount`) and builds hrefs that preserve
 * them across delivery / insurance screens — full payment, ACKO loan, or self-finance.
 */
export function useFullPaymentJourney() {
  const searchParams = useSearchParams();
  const bank = searchParams.get("bank");
  const loanAmount = searchParams.get("loan_amount");
  const isFullPayment = bank === FULL_PAYMENT_BANK_ID;

  const withBank = (path: string) => {
    const q = new URLSearchParams();
    if (bank) q.set("bank", bank);
    if (loanAmount) q.set("loan_amount", loanAmount);
    const qs = q.toString();
    if (!qs) return path;
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}${qs}`;
  };

  return { isFullPayment, withBank };
}
