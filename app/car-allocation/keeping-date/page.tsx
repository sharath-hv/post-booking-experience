import { ConciergeMoment } from "@/components/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/kyc/ModifyNoChargesGatedPage";

/**
 * Standard demo — user declined early delivery; manufacturing wait continues
 * on the original date (same shape as allocation pending).
 */
export default function CarAllocationKeepingDatePage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMoment moment="earlyDeliveryKept" />
    </ModifyNoChargesGatedPage>
  );
}
