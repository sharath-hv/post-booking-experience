import { ConciergeAllocationDecisionCancelledScreen } from "@/components/concierge/ConciergeAllocationDecisionCancelledScreen";

/**
 * Allocation remediation SLA timed out. Booking auto-cancelled, full refund
 * initiated. Demo entry: “SLA timed out” on `/car-allocation/failed`.
 */
export default function CarAllocationDecisionCancelledPage() {
  return <ConciergeAllocationDecisionCancelledScreen />;
}
