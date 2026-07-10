"use client";

import carAllocationHero from "@/assets/Car allocation.svg";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { CAR_ALLOCATION_PENDING_INFO_BOX_EXPRESS } from "@/lib/experience-flow-content";

/**
 * Car allocation pending — same copy and layout for express and standard;
 * delivery date/colour differ elsewhere via readExperienceFlow().
 */
export function CarAllocationPendingPageClient() {
  return (
    <KycBookingProcessingScreen
      headline="A car is being assigned to your booking, Sharath"
      subline="We're allocating your exact Creta variant and colour. This usually takes 24-48 hours."
      infoBox={{ body: CAR_ALLOCATION_PENDING_INFO_BOX_EXPRESS }}
      nextHref="/car-allocation/confirmed"
      prefetchHref="/car-allocation/confirmed"
      heroIllustrationSrc={carAllocationHero}
      heroIllustrationWidth={280}
      heroIllustrationHeight={80}
    />
  );
}
