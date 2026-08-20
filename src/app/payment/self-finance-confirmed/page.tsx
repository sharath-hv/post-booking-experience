import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";

/**
 * Legacy — interstitial removed; the choose screen hands off straight to the
 * self-finance action turn.
 */
export default function SelfFinanceConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <LegacyPathRedirect to="/payment/self-finance-action" />
    </Suspense>
  );
}
