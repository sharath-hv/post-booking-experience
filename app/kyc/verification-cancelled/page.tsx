import { ConciergeVerificationCancelledScreen } from "@/components/concierge/ConciergeVerificationCancelledScreen";

/**
 * Second KYC failure — purchase auto-cancelled, full refund initiated.
 * Also reachable directly via the demo alt-skip on `/kyc/verification-failed`.
 */
export default function KycVerificationCancelledPage() {
  return <ConciergeVerificationCancelledScreen />;
}
