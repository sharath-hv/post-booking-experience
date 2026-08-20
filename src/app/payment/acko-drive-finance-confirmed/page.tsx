import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";

/**
 * Legacy — the “Payment option confirmed” interstitial broke the conversation;
 * the choose screen now hands off straight to the finance action turn.
 */
export default function AckoDriveFinanceConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <LegacyPathRedirect to="/payment/acko-drive-finance-action" />
    </Suspense>
  );
}
