import { ChooseModifyBookingScreen } from "@/components/organisms/kyc/ChooseModifyBookingScreen";
import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";

/**
 * Manage booking → Change selection — pick colour, variant, or different car.
 * Only active in the modify-no-charges experience flow.
 */
export default function ModifySelectionPage() {
  return (
    <ModifySelectionFlowGuard>
      <ChooseModifyBookingScreen />
    </ModifySelectionFlowGuard>
  );
}
