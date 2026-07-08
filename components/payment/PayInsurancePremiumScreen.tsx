"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { INSURANCE_PREMIUM_INR } from "@/components/payment/insurance-coverage-content";
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

function parseInsuranceAmount(raw: string | null): number {
  if (!raw) return INSURANCE_PREMIUM_INR;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : INSURANCE_PREMIUM_INR;
}

/**
 * Insurance premium payment gate — after tenure selection.
 * Reads `insurance_amount` from URL (set by ChooseInsuranceTenureScreen);
 * falls back to the standard 1+3 premium.
 */
export function PayInsurancePremiumScreen() {
  const searchParams = useSearchParams();

  const insuranceAmountInr = useMemo(
    () => parseInsuranceAmount(searchParams.get("insurance_amount")),
    [searchParams],
  );

  const journeyParams = useMemo((): InsuranceJourneyQuery => {
    return {
      bank: searchParams.get("bank"),
      loanAmount: searchParams.get("loan_amount"),
      tenure: searchParams.get("tenure"),
      insuranceAmount: insuranceAmountInr,
    };
  }, [searchParams, insuranceAmountInr]);

  const nextHref = useMemo(
    () => buildInsurancePremiumCheckoutHref(insuranceAmountInr, journeyParams),
    [insuranceAmountInr, journeyParams],
  );

  return (
    <KycBookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      heroIllustrationSrc={KYC_ASSETS.insurancePremiumHero}
      nextHref={nextHref}
      prefetchHref={nextHref}
      nextCtaLabel={`Pay ${formatInr(insuranceAmountInr)}`}
      heroSummaryCard={<ShieldPolicyCard mode="quote" />}
      callLabel="Price questions? I can call you"
      manageBookingShowVehicleIdentification
    />
  );
}
