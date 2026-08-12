import { Suspense } from "react";

import { ChooseInsuranceTenureScreen } from "@/components/organisms/payment/ChooseInsuranceTenureScreen";

export default function ChooseInsuranceTenurePage() {
  return (
    <Suspense fallback={null}>
      <ChooseInsuranceTenureScreen />
    </Suspense>
  );
}
