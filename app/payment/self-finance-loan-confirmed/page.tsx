import { Suspense } from "react";

import { SelfFinanceLoanConfirmedScreen } from "@/components/payment/SelfFinanceLoanConfirmedScreen";

/**
 * Self finance — Shivi acknowledges the sanctioned loan amount and explains
 * that the dealer will call to arrange the down payment offline.
 */
export default function SelfFinanceLoanConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <SelfFinanceLoanConfirmedScreen />
    </Suspense>
  );
}
