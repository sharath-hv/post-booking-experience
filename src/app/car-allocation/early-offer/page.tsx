import { ConciergeMoment } from "@/components/organisms/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";

/**
 * Standard demo — manufacturing finished early; user chooses early delivery
 * or keeps the original date.
 */
export default function CarAllocationEarlyOfferPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMoment moment="earlyDeliveryOffer" />
    </ModifyNoChargesGatedPage>
  );
}
