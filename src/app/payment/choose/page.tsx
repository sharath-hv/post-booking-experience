import { Suspense } from "react";

import { ChoosePaymentOptionsScreen } from "@/components/organisms/payment/ChoosePaymentOptionsScreen";

export default function ChoosePaymentPage() {
  return (
    <Suspense fallback={null}>
      <ChoosePaymentOptionsScreen />
    </Suspense>
  );
}
