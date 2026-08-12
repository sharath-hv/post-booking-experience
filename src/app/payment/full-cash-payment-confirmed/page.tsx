import { Suspense } from "react";

import { FullCashPaymentConfirmedScreen } from "@/components/organisms/payment/FullCashPaymentConfirmedScreen";

/**
 * Full cash payment — dealer has confirmed receipt; Shivi moves user to insurance.
 */
export default function FullCashPaymentConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <FullCashPaymentConfirmedScreen />
    </Suspense>
  );
}
