import { Suspense } from "react";

import { InsuranceAddonSelectionScreen } from "@/components/organisms/payment/InsuranceAddonSelectionScreen";

export default function InsuranceAddonsPage() {
  return (
    <Suspense fallback={null}>
      <InsuranceAddonSelectionScreen />
    </Suspense>
  );
}
