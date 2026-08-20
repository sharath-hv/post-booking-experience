import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";

/**
 * Legacy — interstitial removed; the choose screen hands off straight to the
 * full payment action turn.
 */
export default function FullPaymentOptionConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <LegacyPathRedirect to="/payment/full-payment-confirmed" />
    </Suspense>
  );
}
