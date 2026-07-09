"use client";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { useFullPaymentJourney } from "@/components/payment/use-full-payment-journey";
import { RtoRegistrationStatusCard } from "@/components/payment/RtoRegistrationStatusCard";

const HEADLINE = "Your file is at the RTO, Sharath.";
const SUBLINE =
  "I've submitted your registration paperwork. The RTO takes a few working days. Government clocks, not mine. I'll keep nudging and keep you posted.";

/**
 * After insurance is set up — RTO is the active delivery milestone (see What&apos;s next nested rail).
 */
export function CarDeliveryRtoPrepScreen() {
  const { withBank } = useFullPaymentJourney();

  return (
    <KycBookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      callLabel="Want an update? I can call you"
      heroIllustrationSrc={KYC_ASSETS.rtoRegistrationProcessHero}
      nextHref={withBank("/payment/car-delivery-schedule")}
      prefetchHref={withBank("/payment/car-delivery-schedule")}
      nextCtaLabel="Next"
      heroSummaryCard={<RtoRegistrationStatusCard />}
      manageBookingShowVehicleIdentification
    />
  );
}
