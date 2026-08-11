import { Suspense } from "react";

import { LoanRejectedScreen } from "@/components/payment/LoanRejectedScreen";
/**
 * Bank declined the loan — demo branch off loan under-review.
 * Post-analysis outcomes (non-doable, co-applicant, guarantor, alt bank)
 * are previewed via `?outcome=` on the rejected screen.
 */
export default function LoanRejectedPage() {
  return (
    <Suspense fallback={null}>
      <LoanRejectedScreen />
    </Suspense>
  );
}
