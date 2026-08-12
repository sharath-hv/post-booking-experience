import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";
import { ModifySelectionReviewPayScreen } from "@/components/organisms/kyc/ModifySelectionReviewPayScreen";

/**
 * Change variant — review selection and pay booking amount delta.
 */
export default function ModifySelectionVariantConfirmPage() {
  return (
    <ModifySelectionFlowGuard>
      <ModifySelectionReviewPayScreen flow="variant" />
    </ModifySelectionFlowGuard>
  );
}
