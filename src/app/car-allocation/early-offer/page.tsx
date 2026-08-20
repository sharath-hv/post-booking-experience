import {
  ConciergeMomentArtifact,
  ConciergeMomentProvider,
  ConciergeMomentTurn,
} from "@/components/organisms/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";

/**
 * Standard demo — manufacturing finished early; user chooses early delivery
 * or keeps the original date.
 */
export default function CarAllocationEarlyOfferPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMomentProvider moment="earlyDeliveryOffer">
        <ConciergeMomentTurn>
          <ConciergeMomentArtifact />
        </ConciergeMomentTurn>
      </ConciergeMomentProvider>
    </ModifyNoChargesGatedPage>
  );
}
