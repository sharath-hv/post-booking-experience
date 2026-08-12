import { ConciergeMoment } from "@/components/organisms/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";
/**
 * Dealer found — configuration matched and shortlisted; OTP on Hyundai portal assigns the unit.
 */
export default function KycBookingAcceptedPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMoment moment="dealerFound" />
    </ModifyNoChargesGatedPage>
  );
}
