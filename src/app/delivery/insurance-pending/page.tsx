import { Suspense } from "react";

import { CarDeliveryInsurancePendingScreen } from "@/components/organisms/payment/CarDeliveryInsurancePendingScreen";

/** Demo branch — insurance issuance takes time. */
export default function CarDeliveryInsurancePendingPage() {
  return (
    <Suspense fallback={null}>
      <CarDeliveryInsurancePendingScreen />
    </Suspense>
  );
}
