"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { FULL_PAYMENT_INSURANCE_INR } from "@/components/payment/loan-amount-demo-constants";
import { ShieldPolicyCard } from "@/components/payment/ShieldPolicyCard";
import {
  buildInsurancePremiumCheckoutHref,
  type InsuranceJourneyQuery,
} from "@/lib/paymentUrls";

const HEADLINE = "Your car's nearly ready — one last payment.";
const SUBLINE =
  "The RTO won't register a car without an active policy, so insurance is the final gate before delivery. Pay and your policy is issued on the spot — insurance is us, after all.";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/**
 * Fixed insurance premium before {@link CarDeliveryInsurancePrepScreen}.
 * Full payment, ACKO Drive loan, and self finance — fixed insurance premium before car insurance prep.
 */
export function PayInsurancePremiumScreen() {
  const searchParams = useSearchParams();

  const journeyParams = useMemo((): InsuranceJourneyQuery => {
    return {
      bank: searchParams.get("bank"),
      loanAmount: searchParams.get("loan_amount"),
    };
  }, [searchParams]);

  const nextHref = useMemo(
    () => buildInsurancePremiumCheckoutHref(FULL_PAYMENT_INSURANCE_INR, journeyParams),
    [journeyParams],
  );

  return (
    <KycBookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      heroIllustrationSrc={KYC_ASSETS.insurancePremiumHero}
      nextHref={nextHref}
      prefetchHref={nextHref}
      nextCtaLabel={`Pay ${formatInr(FULL_PAYMENT_INSURANCE_INR)}`}
      heroSummaryCard={<ShieldPolicyCard mode="quote" />}
      callLabel="Price questions? I can call you"
      manageBookingShowVehicleIdentification
    />
  );
}
