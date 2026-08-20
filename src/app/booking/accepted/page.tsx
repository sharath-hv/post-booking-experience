import {
  ConciergeMomentArtifact,
  ConciergeMomentProvider,
  ConciergeMomentTurn,
} from "@/components/organisms/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";
/**
 * Dealer found — configuration matched and shortlisted; OTP on Hyundai portal assigns the unit.
 */
export default function KycBookingAcceptedPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMomentProvider moment="dealerFound">
        <ConciergeMomentTurn>
          <ConciergeMomentArtifact />
        </ConciergeMomentTurn>
      </ConciergeMomentProvider>
    </ModifyNoChargesGatedPage>
  );
}
