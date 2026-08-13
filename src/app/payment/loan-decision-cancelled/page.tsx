import { LoanDecisionCancelledScreen } from "@/components/organisms/payment/LoanDecisionCancelledScreen";

/**
 * Loan-rejected remediation SLA timed out. Booking auto-cancelled with the
 * post-lock 50% cancellation fee. Demo entry: “SLA timed out” on
 * `/payment/loan-rejected`.
 */
export default function LoanDecisionCancelledPage() {
  return <LoanDecisionCancelledScreen />;
}
