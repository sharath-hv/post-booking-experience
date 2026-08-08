import { Suspense } from "react";

import { LoanUnderReviewScreen } from "@/components/payment/LoanUnderReviewScreen";

/**
 * Post–bank OTP — loan under review (2–3 working days).
 */
export default function LoanUnderReviewPage() {
  return (
    <Suspense fallback={null}>
      <LoanUnderReviewScreen />
    </Suspense>
  );
}
