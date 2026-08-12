import { ModifySelectionCarBrandScreen } from "@/components/organisms/kyc/ModifySelectionCarBrandScreen";
import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";

/**
 * Choose a different car — brand selection (Figma 2686:11633).
 */
export default function ModifySelectionDifferentCarPage() {
  return (
    <ModifySelectionFlowGuard>
      <ModifySelectionCarBrandScreen />
    </ModifySelectionFlowGuard>
  );
}
