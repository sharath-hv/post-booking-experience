import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";
import { ModifySelectionAccessoryKitScreen } from "@/components/organisms/kyc/ModifySelectionAccessoryKitScreen";

/** Change selection — choose accessory kit before confirm. */
export default function ModifySelectionAccessoriesPage() {
  return (
    <ModifySelectionFlowGuard>
      <ModifySelectionAccessoryKitScreen />
    </ModifySelectionFlowGuard>
  );
}
