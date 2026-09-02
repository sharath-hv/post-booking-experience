import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";
import { ModifySelectionInsuranceTenureScreen } from "@/components/organisms/kyc/ModifySelectionInsuranceTenureScreen";

/** Change selection — choose insurance tenure before confirm. */
export default function ModifySelectionInsurancePage() {
  return (
    <ModifySelectionFlowGuard>
      <ModifySelectionInsuranceTenureScreen />
    </ModifySelectionFlowGuard>
  );
}
