import { ConciergeMoment } from "@/components/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/kyc/ModifyNoChargesGatedPage";
/**
 * Dealer found — Shivi reserved the exact car; OTP confirmation expected.
 */
export default function KycBookingAcceptedPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMoment moment="dealerFound" />
    </ModifyNoChargesGatedPage>
  );
}
