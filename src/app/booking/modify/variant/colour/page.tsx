import { ModifySelectionVariantColourScreen } from "@/components/organisms/kyc/ModifySelectionVariantColourScreen";
import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";

/**
 * Change variant — pick colour for the selected variant (hero car card + colour cards).
 */
export default function ModifySelectionVariantColourPage() {
  return (
    <ModifySelectionFlowGuard>
      <ModifySelectionVariantColourScreen />
    </ModifySelectionFlowGuard>
  );
}
