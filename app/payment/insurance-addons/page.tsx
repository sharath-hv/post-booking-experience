import { Suspense } from "react";

import { InsuranceAddonSelectionScreen } from "@/components/payment/InsuranceAddonSelectionScreen";

export default function InsuranceAddonsPage() {
  return (
    <Suspense fallback={null}>
      <InsuranceAddonSelectionScreen />
    </Suspense>
  );
}
