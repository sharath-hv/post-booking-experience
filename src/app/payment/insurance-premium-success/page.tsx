import { Suspense } from "react";

import { InsurancePremiumSuccessScreen } from "@/components/organisms/payment/InsurancePremiumSuccessScreen";

/** Insurance premium ack; auto-advances to car insurance prep. */
export default function InsurancePremiumSuccessPage() {
  return (
    <Suspense fallback={null}>
      <InsurancePremiumSuccessScreen />
    </Suspense>
  );
}
