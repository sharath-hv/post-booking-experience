import { ConciergeMoment } from "@/components/organisms/concierge/ConciergeMoment";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";

/**
 * Documents in — Shivi acknowledges and visibly starts the verification.
 */
export default function KycDocumentsReceivedPage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeMoment moment="documentsReceived" />
    </ModifyNoChargesGatedPage>
  );
}
