"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { CarPriceBreakupCard } from "@/components/concierge/artifacts";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";
import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import {
  ACKO_LOAN_DOWN_PAYMENT_INR,
  BANK_DISBURSEMENT_INR,
  BOOKING_AMOUNT_PAID_INR,
  FULL_PAYMENT_INSURANCE_INR,
  ON_ROAD_PRICE_INR,
} from "@/components/payment/loan-amount-demo-constants";
import { buildDownPaymentCheckoutHref } from "@/lib/paymentUrls";

const LOAN_SANCTIONED_HEADLINE = "Your loan is approved, Sharath!";

/** Urgency line above the CTA — consequence, not a deadline to procrastinate against. */
const CTA_WARNING_LINE =
  "Delivery prep starts the moment this lands — every day here moves your delivery date";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/**
 * Loan sanctioned — the bank's disbursement is the bank's decision (no slider);
 * the down payment is DERIVED from the price identity and shown in full. This is
 * the one place the split appears — the CTA goes straight to checkout.
 */
export function LoanSanctionedScreen() {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);

  const subline = useMemo(
    () =>
      `${bank.name} will disburse ${formatInr(BANK_DISBURSEMENT_INR)} straight to the dealer. With your ${formatInr(BOOKING_AMOUNT_PAID_INR)} already in and insurance saved for just before delivery, your down payment works out to ${formatInr(ACKO_LOAN_DOWN_PAYMENT_INR)} — here's the whole picture.`,
    [bank.name],
  );

  const nextHref = useMemo(
    () =>
      buildDownPaymentCheckoutHref(
        bankId,
        String(BANK_DISBURSEMENT_INR),
        ACKO_LOAN_DOWN_PAYMENT_INR,
      ),
    [bankId],
  );

  return (
    <KycBookingProcessingScreen
      headline={LOAN_SANCTIONED_HEADLINE}
      subline={subline}
      heroSummaryCard={
        <CarPriceBreakupCard
          totalInr={ON_ROAD_PRICE_INR}
          bookingPaidInr={BOOKING_AMOUNT_PAID_INR}
          disbursementLabel={`${bank.name} disburses`}
          disbursementInr={BANK_DISBURSEMENT_INR}
          insuranceInr={FULL_PAYMENT_INSURANCE_INR}
          dueLabel="Your down payment — due now"
          dueInr={ACKO_LOAN_DOWN_PAYMENT_INR}
        />
      }
      nextHref={nextHref}
      prefetchHref={nextHref}
      nextCtaLabel={`Pay down payment ${formatInr(ACKO_LOAN_DOWN_PAYMENT_INR)}`}
      ctaWarningLine={CTA_WARNING_LINE}
      callLabel="Questions on the split? I can call you"
      manageBookingShowVehicleIdentification
    />
  );
}
