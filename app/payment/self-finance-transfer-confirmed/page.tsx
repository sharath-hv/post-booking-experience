import { Suspense } from "react";

import { SelfFinanceTransferConfirmedScreen } from "@/components/payment/SelfFinanceTransferConfirmedScreen";

/**
 * Self finance — dealer has confirmed the bank transfer; delivery prep underway.
 */
export default function SelfFinanceTransferConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <SelfFinanceTransferConfirmedScreen />
    </Suspense>
  );
}
