import { ConciergeMoment } from "@/components/organisms/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";

/**
 * Exact-unit assignment underway — Shivi pushes the dealer for fresh stock.
 */
export default function CarAllocationPendingPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMoment moment="allocationPending" />
    </ModifyNoChargesGatedPage>
  );
}
