import { Suspense } from "react";

import { SelfFinanceTransferVerificationScreen } from "@/components/payment/SelfFinanceTransferVerificationScreen";

/**
 * Self finance — Shivi verifies the bank transfer with the dealer after the user confirms.
 */
export default function SelfFinanceTransferVerificationPage() {
  return (
    <Suspense fallback={null}>
      <SelfFinanceTransferVerificationScreen />
    </Suspense>
  );
}
