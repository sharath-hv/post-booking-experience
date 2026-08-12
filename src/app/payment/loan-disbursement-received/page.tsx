import { Suspense } from "react";

import { LoanDisbursementReceivedScreen } from "@/components/organisms/payment/LoanDisbursementReceivedScreen";
/**
 * Loan disbursement success — between down-payment setup and car insurance prep.
 */
export default function LoanDisbursementReceivedPage() {
  return (
    <Suspense fallback={null}>
      <LoanDisbursementReceivedScreen />
    </Suspense>
  );
}
