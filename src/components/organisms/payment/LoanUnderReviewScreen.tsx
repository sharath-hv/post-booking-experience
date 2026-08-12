"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/organisms/artifacts";
import { bankForQueryParam } from "@/components/organisms/payment/acko-drive-finance-bank";
import { BookingProcessingScreen } from "@/components/organisms/BookingProcessingScreen";
import {
  ACKO_LOAN_DOWN_PAYMENT_INR,
  BANK_DISBURSEMENT_INR,
} from "@/constants/loan-amount-demo-constants";
import { loanAdditionalDocumentsPath } from "@/helpers/loan-application-urls";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function loanSanctionedHref(bank: string | null) {
  return bank
    ? `/payment/loan-sanctioned?bank=${encodeURIComponent(bank)}`
    : "/payment/loan-sanctioned";
}

/**
 * Post-OTP bank review — loan is with the bank for 2–3 working days.
 * Demo branches: more docs, or bank declines. Skip ahead → sanctioned.
 */
export function LoanUnderReviewScreen() {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);
  const nextHref = loanSanctionedHref(bankId);
  const subline = useMemo(
    () =>
      `${bank.name} usually takes 2–3 working days to process. I'll chase them and message you the moment there's news.`,
    [bank.name],
  );

  return (
    <BookingProcessingScreen
      headline="Your loan is being processed."
      subline={subline}
      heroSummaryCard={
        <AmountReceivedCard
          amountInr={BANK_DISBURSEMENT_INR}
          title="Requested loan amount"
          status="processing"
          variant="glass"
          rows={[
            {
              label: "Down payment to be paid",
              value: formatInr(ACKO_LOAN_DOWN_PAYMENT_INR),
            },
          ]}
          note="Typically takes 2–3 working days."
        />
      }
      nextHref={nextHref}
      prefetchHref={nextHref}
      altTimeSkip={[
        {
          label: "More docs needed",
          href: bankId
            ? loanAdditionalDocumentsPath(bankId)
            : "/payment/loan-additional-documents",
        },
        {
          label: "If the bank declines",
          href: bankId
            ? `/payment/loan-rejected?bank=${encodeURIComponent(bankId)}&outcome=alt_bank`
            : "/payment/loan-rejected?outcome=alt_bank",
        },
      ]}
      dateHolder="shivi"
      callLabel="Anxious about the loan? I can call you"
      manageBookingShowVehicleIdentification
      suppressEcho
    />
  );
}
