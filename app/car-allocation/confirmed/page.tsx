import { ConciergeMoment } from "@/components/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/kyc/ModifyNoChargesGatedPage";

/**
 * Exact unit assigned — engine + chassis in the user's name.
 * Demo: `?early=1` for manufacturing finished ahead of the estimated date.
 */
export default function CarAllocationConfirmedPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMoment moment="allocationDone" />
    </ModifyNoChargesGatedPage>
  );
}
