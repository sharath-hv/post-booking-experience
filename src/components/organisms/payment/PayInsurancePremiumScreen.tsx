"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { BookingProcessingScreen } from "@/components/organisms/BookingProcessingScreen";
import { KYC_ASSETS } from "@/utils/kyc-assets";
import { ShieldPolicyCard } from "@/components/organisms/payment/ShieldPolicyCard";
import { buildInsuranceAddonsHref } from "@/helpers/paymentUrls";

const HEADLINE = "Your car's nearly ready. One last payment.";
const SUBLINE =
  "The RTO won't register your car without an active policy, so here's your ACKO Drive Shield quote, your last step before delivery.";

/**
 * Step 1 of insurance — Shivi's intro + base ACKO Drive Shield quote.
 * CTA reads "Continue" (add-ons are optional, pitched on the next standalone page).
 * No echo — the next screen isn't a concierge turn.
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
    <BookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      heroIllustrationSrc={KYC_ASSETS.insurancePremiumHero}
      nextHref={nextHref}
      prefetchHref={nextHref}
      nextCtaLabel="Continue"
      replyEcho={null}
      heroSummaryCard={<ShieldPolicyCard mode="quote" />}
      callLabel="Coverage questions? I can call you"
      manageBookingShowVehicleIdentification
    />
  );
}
