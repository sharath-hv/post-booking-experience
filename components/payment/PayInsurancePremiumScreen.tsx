"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { ShieldPolicyCard } from "@/components/payment/ShieldPolicyCard";
import { buildInsuranceAddonsHref } from "@/lib/paymentUrls";

const HEADLINE = "Your car's nearly ready. One last payment.";
const SUBLINE =
  "The RTO won't register a car without an active policy, so insurance is the final gate before delivery. Start with ACKO Drive Shield, add protection if you want, then choose how long to lock it in.";

/**
 * Step 1 of insurance — Shivi's intro + base ACKO Drive Shield quote.
 * CTA proceeds to the standalone add-on selection page, then tenure.
 */
export function PayInsurancePremiumScreen() {
  const searchParams = useSearchParams();

  const nextHref = useMemo(
    () =>
      buildInsuranceAddonsHref({
        bank: searchParams.get("bank"),
        loanAmount: searchParams.get("loan_amount"),
      }),
    [searchParams],
  );

  return (
    <KycBookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      heroIllustrationSrc={KYC_ASSETS.insurancePremiumHero}
      nextHref={nextHref}
      prefetchHref={nextHref}
      nextCtaLabel="Add more protection"
      replyEcho="Let's add more protection"
      heroSummaryCard={<ShieldPolicyCard mode="quote" />}
      callLabel="Coverage questions? I can call you"
      manageBookingShowVehicleIdentification
    />
  );
}
