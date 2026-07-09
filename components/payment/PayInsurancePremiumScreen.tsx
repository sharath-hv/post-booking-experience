"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { ShieldPolicyCard } from "@/components/payment/ShieldPolicyCard";
import {
  buildChooseInsuranceTenureHref,
  type InsuranceJourneyQuery,
} from "@/lib/paymentUrls";

const HEADLINE = "Your car's nearly ready. One last payment.";
const SUBLINE =
  "The RTO won't register a car without an active policy, so insurance is the final gate before delivery. Pay and your policy is issued on the spot. Insurance is us, after all.";

/**
 * Step 1 of insurance — shows coverage summary.
 * CTA proceeds to choose-insurance-tenure (step 2).
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
    () => buildChooseInsuranceTenureHref(journeyParams),
    [journeyParams],
  );

  return (
    <KycBookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      heroIllustrationSrc={KYC_ASSETS.insurancePremiumHero}
      nextHref={nextHref}
      prefetchHref={nextHref}
      nextCtaLabel="Choose your tenure"
      heroSummaryCard={<ShieldPolicyCard mode="quote" />}
      callLabel="Coverage questions? I can call you"
      manageBookingShowVehicleIdentification
    />
  );
}
