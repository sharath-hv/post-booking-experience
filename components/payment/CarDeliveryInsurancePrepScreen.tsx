"use client";

import { useSearchParams } from "next/navigation";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { useFullPaymentJourney } from "@/components/payment/use-full-payment-journey";
import { ShieldPolicyCard } from "@/components/payment/ShieldPolicyCard";
import type { InsuranceTenureId } from "@/components/payment/insurance-coverage-content";
import { DEMO_NAV_CTA_LABEL } from "@/lib/demo-nav-cta";

const HEADLINE = "Your Creta is covered, Sharath";
const SUBLINE =
  "Zero depreciation cover, active from today. Next, I'll take your registration file to the RTO.";

/** Policy issued instantly (ACKO is the insurer) — news turn, then on to the RTO wait. */
export function CarDeliveryInsurancePrepScreen() {
  const { withBank } = useFullPaymentJourney();
  const searchParams = useSearchParams();
  const tenure = (searchParams.get("tenure") ?? "1+3") as InsuranceTenureId;

  return (
    <KycBookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      callLabel="Questions about coverage? I can call you"
      heroIllustrationSrc={KYC_ASSETS.insuranceInProgressHero}
      nextHref={withBank("/payment/car-delivery-rto")}
      prefetchHref={withBank("/payment/car-delivery-rto")}
      nextCtaLabel={DEMO_NAV_CTA_LABEL}
      timeSkipLabel="RTO registration"
      heroSummaryCard={<ShieldPolicyCard mode="active" tenure={tenure} />}
      manageBookingShowVehicleIdentification
    />
  );
}
