import { Suspense } from "react";

import { EnterSanctionedLoanAmountScreen } from "@/components/payment/EnterSanctionedLoanAmountScreen";

/**
 * Self finance — enter the bank-sanctioned loan amount so we can derive the disbursement.
 */
export default function EnterSanctionedLoanAmountPage() {
  return (
    <Suspense fallback={null}>
      <EnterSanctionedLoanAmountScreen />
    </Suspense>
  );
}
