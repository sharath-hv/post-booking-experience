"use client";

import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";

const RTO_REGISTRATION_INFO_COPY =
  "You'll get your registration number the moment the RTO issues it.";

/**
 * RTO registration status — info shimmer callout.
 */
export function RtoRegistrationStatusCard() {
  return (
    <ShimmerInfoCard icon="info">
      {RTO_REGISTRATION_INFO_COPY}
    </ShimmerInfoCard>
  );
}
