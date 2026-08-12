import { ConciergeAllocationFailedScreen } from "@/components/organisms/concierge/ConciergeAllocationFailedScreen";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";

/**
 * Variant discontinued (demo branch, express only) — selected variant is
 * unavailable; remediation without a wait-for-standard option.
 */
export default function CarAllocationVariantUnavailablePage() {
  return (
    <ModifyNoChargesGatedPage>
      <ConciergeAllocationFailedScreen mode="discontinued" />
    </ModifyNoChargesGatedPage>
  );
}
