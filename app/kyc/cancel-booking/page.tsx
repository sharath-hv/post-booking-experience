import { Suspense } from "react";

import { ConciergeCancelScreen } from "@/components/concierge/ConciergeCancelScreen";

/**
 * Cancellation — available in every flow at every stage (policy §7):
 * free before a dealer is identified, 50% of booking amount from booking accepted onward.
 */
export default function CancelBookingPage() {
  return (
    <Suspense fallback={null}>
      <ConciergeCancelScreen />
    </Suspense>
  );
}
