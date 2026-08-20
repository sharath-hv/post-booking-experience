import {
  ConciergeMomentArtifact,
  ConciergeMomentProvider,
  ConciergeMomentTurn,
} from "@/components/organisms/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";
/**
 * Dealer search — verified; Shivi is out finding the exact car.
 */
export default function KycProcessingPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMomentProvider moment="dealerSearch">
        <ConciergeMomentTurn>
          <ConciergeMomentArtifact />
        </ConciergeMomentTurn>
      </ConciergeMomentProvider>
    </ModifyNoChargesGatedPage>
  );
}
