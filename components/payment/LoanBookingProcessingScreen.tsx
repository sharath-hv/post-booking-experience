"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { NextStepCard } from "@/components/concierge/artifacts";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";
import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import {
  loanAdditionalDocumentsPath,
} from "@/lib/loan-application-urls";
import styles from "./LoanBookingProcessingScreen.module.scss";


const LOAN_PROCESSING_HEADLINE = "Your application is with the bank.";

function loanSanctionedHref(bank: string | null) {
  return bank
    ? `/payment/loan-sanctioned?bank=${encodeURIComponent(bank)}`
    : "/payment/loan-sanctioned";
}

/**
 * Loan under review — bank reviews take days (honest time), and the bank's
 * verification call is the user's pending action (NextStepCard with stakes).
 * “Skip ahead” goes to `/payment/loan-sanctioned` (preserves `?bank=`).
 * Demo branches: bank declines, or bank asks for one more document.
 */
export function LoanBookingProcessingScreen() {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);
  const nextHref = loanSanctionedHref(bankId);
  const subline = useMemo(
    () =>
      `${bank.name} usually takes 2–3 business days to review. I'll chase them and message you the moment there's news.`,
    [bank.name],
  );

  return (
    <KycBookingProcessingScreen
      headline={LOAN_PROCESSING_HEADLINE}
      subline={subline}
      heroSummaryCard={
        <div className={styles.flex_0}>
          <NextStepCard
            title={`Pick up ${bank.name}'s call`}
            body="A bank representative will call within 2 business days to confirm your loan details. Share the OTP they ask for."
          />
        </div>
      }
      nextHref={nextHref}
      prefetchHref={nextHref}
      altTimeSkip={[
        {
          label: "If the bank needs more docs",
          href: bankId
            ? loanAdditionalDocumentsPath(bankId)
            : "/payment/loan-additional-documents",
        },
        {
          label: "If the bank declines",
          href: bankId
            ? `/payment/loan-rejected?bank=${encodeURIComponent(bankId)}`
            : "/payment/loan-rejected",
        },
      ]}
      callLabel="Anxious about the loan? I can call you"
      manageBookingShowVehicleIdentification
    />
  );
}
