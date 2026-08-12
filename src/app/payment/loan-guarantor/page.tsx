import { Suspense } from "react";

import { LoanGuarantorScreen } from "@/components/organisms/payment/LoanGuarantorScreen";

/**
 * Guarantor details for a conditional same-bank recovery path after rejection.
 */
export default function LoanGuarantorPage() {
  return (
    <Suspense fallback={null}>
      <LoanGuarantorScreen />
    </Suspense>
  );
}
