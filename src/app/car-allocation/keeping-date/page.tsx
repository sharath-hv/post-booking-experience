import {
  ConciergeMomentArtifact,
  ConciergeMomentProvider,
  ConciergeMomentTurn,
} from "@/components/organisms/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";

/**
 * Standard demo — user declined early delivery; manufacturing wait continues
 * on the original date (same shape as allocation pending).
 */
export default function CarAllocationKeepingDatePage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMomentProvider moment="earlyDeliveryKept">
        <ConciergeMomentTurn>
          <ConciergeMomentArtifact />
        </ConciergeMomentTurn>
      </ConciergeMomentProvider>
    </ModifyNoChargesGatedPage>
  );
}
