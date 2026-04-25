import { Suspense } from "react";

import { LoanDocumentsReceivedPageClient } from "@/components/payment/LoanDocumentsReceivedPageClient";

/**
 * Loan application — documents submitted success (same layout as KYC documents received).
 */
export default function LoanDocumentsReceivedPage() {
  return (
    <Suspense fallback={null}>
      <LoanDocumentsReceivedPageClient />
    </Suspense>
  );
}
