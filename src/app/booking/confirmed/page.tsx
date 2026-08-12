import { Suspense } from "react";

import { KycBookingConfirmedPageClient } from "@/components/organisms/kyc/KycBookingConfirmedPageClient";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";
/**
 * KYC — booking confirmed success (Figma node 1880:7088).
 * `?source=payment&return_source=modify-selection` — auto-advance Payment
 * received after modify-selection pay (initial lock uses `/booking/received`).
 */
export default function KycBookingConfirmedPage() {
  return (
    <ModifyNoChargesGatedPage>
      <Suspense fallback={null}>
        <KycBookingConfirmedPageClient />
      </Suspense>
    </ModifyNoChargesGatedPage>
  );
}
