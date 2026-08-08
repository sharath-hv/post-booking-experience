import { Suspense } from "react";

import { ChoosePaymentOptionsScreen } from "@/components/payment/ChoosePaymentOptionsScreen";

export default function ChoosePaymentPage() {
  return (
    <Suspense fallback={null}>
      <ChoosePaymentOptionsScreen />
    </Suspense>
  );
}
