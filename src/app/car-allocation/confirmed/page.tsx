import { ConciergeMoment } from "@/components/organisms/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";

/**
 * Exact unit assigned — engine + chassis in the user's name.
 * Demo: `?early=1` after the user accepts early delivery (date already updated).
 */
export default function CarAllocationConfirmedPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMoment moment="allocationDone" />
    </ModifyNoChargesGatedPage>
  );
}
