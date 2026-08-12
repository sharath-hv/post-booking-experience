import { Suspense } from "react";

import { LoanBookingProcessingScreen } from "@/components/organisms/payment/LoanBookingProcessingScreen";

/**
 * Loan application — bank verification OTP after submit.
 */
export default function LoanProcessingPage() {
  return (
    <Suspense fallback={null}>
      <LoanBookingProcessingScreen />
    </Suspense>
  );
}
