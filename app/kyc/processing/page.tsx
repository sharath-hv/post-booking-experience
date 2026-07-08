import { ConciergeMoment } from "@/components/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/kyc/ModifyNoChargesGatedPage";
/**
 * Dealer search — verified; Shivi is out finding the exact car.
 */
export default function KycProcessingPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMoment moment="dealerSearch" />
    </ModifyNoChargesGatedPage>
  );
}
