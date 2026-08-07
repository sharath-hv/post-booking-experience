import { Suspense } from "react";

import { LoanRejectedScreen } from "@/components/payment/LoanRejectedScreen";
/**
 * Bank declined the loan — demo branch off loan under-review.
 * Shivi offers an alternative bank; nothing restarts.
 */
export default function LoanRejectedPage() {
  return (
    <Suspense fallback={null}>
      <LoanRejectedScreen />
    </Suspense>
  );
}
