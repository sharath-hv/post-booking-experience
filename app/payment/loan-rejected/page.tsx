import { Suspense } from "react";

import { LoanRejectedScreen } from "@/components/payment/LoanRejectedScreen";
/**
 * Bank declined the loan — demo branch off `/payment/loan-processing`.
 * Shivi flips the application to a pre-approved alternative; nothing restarts.
 */
export default function LoanRejectedPage() {
  return (
    <Suspense fallback={null}>
      <LoanRejectedScreen />
    </Suspense>
  );
}
