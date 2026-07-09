import { Suspense } from "react";

import { FullCashPaymentVerificationScreen } from "@/components/payment/FullCashPaymentVerificationScreen";

/**
 * Full cash payment — Shivi verifies the car amount transfer with the dealer.
 */
export default function FullCashPaymentVerificationPage() {
  return (
    <Suspense fallback={null}>
      <FullCashPaymentVerificationScreen />
    </Suspense>
  );
}
