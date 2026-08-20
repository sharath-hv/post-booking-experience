import { Suspense } from "react";

import { DownPaymentSuccessScreen } from "@/components/organisms/payment/DownPaymentSuccessScreen";

export default function DownPaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <DownPaymentSuccessScreen />
    </Suspense>
  );
}
