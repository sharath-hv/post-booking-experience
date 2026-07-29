"use client";

import { ShimmerInfoCard } from "@/components/molecules/ShimmerInfoCard";

const RTO_REGISTRATION_INFO_COPY =
  "I'll share your registration number as soon as the RTO issues it.";

/**
 * RTO registration status — info shimmer callout.
 */
export function RtoRegistrationStatusCard() {
  return (
    <ShimmerInfoCard>{RTO_REGISTRATION_INFO_COPY}</ShimmerInfoCard>
  );
}
