import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";
import { ModifySelectionReviewPayScreen } from "@/components/organisms/kyc/ModifySelectionReviewPayScreen";

/**
 * Change colour — review selection and pay booking amount delta.
 */
export default function ModifySelectionColourConfirmPage() {
  return (
    <ModifySelectionFlowGuard>
      <ModifySelectionReviewPayScreen flow="colour" />
    </ModifySelectionFlowGuard>
  );
}
