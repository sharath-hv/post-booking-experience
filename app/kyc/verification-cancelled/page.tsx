import { Suspense } from "react";

import { ConciergeVerificationCancelledScreen } from "@/components/concierge/ConciergeVerificationCancelledScreen";

/**
 * Second KYC failure, or the re-upload SLA timer running out — purchase
 * auto-cancelled, full refund initiated. Also reachable directly via the
 * demo alt-skips on `/kyc/verification-failed`.
 */
export default function KycVerificationCancelledPage() {
  return (
    <Suspense fallback={null}>
      <ConciergeVerificationCancelledScreen />
    </Suspense>
  );
}
