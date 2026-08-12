import { ConciergeMoment } from "@/components/organisms/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";

/**
 * Standard demo — ongoing wait while the partner confirms early delivery.
 * Demo time-skip advances once the earlier slot is “locked in”.
 */
export default function CarAllocationEarlyConfirmingPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMoment moment="earlyDeliveryConfirming" />
    </ModifyNoChargesGatedPage>
  );
}
