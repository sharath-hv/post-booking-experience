"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import loanIcon from "@/assets/loan.svg";
import { AmountReceivedCard, NextStepCard } from "@/components/organisms/artifacts";
import { bankForQueryParam } from "@/helpers/acko-drive-finance-bank";
import { BookingProcessingScreen } from "@/components/organisms/BookingProcessingScreen";
import {
  ACKO_LOAN_DOWN_PAYMENT_INR,
  BANK_DISBURSEMENT_INR,
} from "@/constants/loan-amount-demo-constants";
import { loanUnderReviewPath } from "@/helpers/loan-application-urls";
import styles from "./LoanBookingProcessingScreen.module.scss";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/**
 * Bank verification call — user confirms the OTP. Skip ahead → under-review
 * (loan processing for 2–3 working days).
 */
export function LoanBookingProcessingScreen() {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);
  const nextHref = bankId ? loanUnderReviewPath(bankId) : "/payment/loan-under-review";
  const subline = useMemo(
    () =>
      `${bank.name} will call to confirm your details. Share the OTP they ask for — that's how the application moves into processing.`,
    [bank.name],
  );

  return (
    <BookingProcessingScreen
      headline="Confirm with a one-time code."
      subline={subline}
      heroSummaryCard={
        <div className={styles.flex_0}>
          <NextStepCard
            title={`Pick up ${bank.name}'s call`}
            body="A bank representative will call within 2 business days to confirm your loan details. Share the OTP they ask for."
          />
          <AmountReceivedCard
            variant="glass"
            amountInr={BANK_DISBURSEMENT_INR}
            title="Requested loan amount"
            status="due"
            iconSrc={loanIcon}
            rows={[
              {
                label: "Down payment to be paid",
                value: formatInr(ACKO_LOAN_DOWN_PAYMENT_INR),
              },
            ]}
          />
        </div>
      }
      nextHref={nextHref}
      prefetchHref={nextHref}
      timeSkipLabel="After the call"
      dateHolder="you"
      callLabel="Anxious about the loan? I can call you"
      manageBookingShowVehicleIdentification
      suppressEcho
    />
  );
}
