import { Suspense } from "react";

import { LoanSanctionedScreen } from "@/components/organisms/payment/LoanSanctionedScreen";

/**
 * Loan sanctioned — same layout and enter behaviour as `/payment/loan-processing` (no celebration slide-in).
 */
export default function LoanSanctionedPage() {
  return (
    <Suspense fallback={null}>
      <LoanSanctionedScreen />
    </Suspense>
  );
}
