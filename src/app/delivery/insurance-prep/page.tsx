import { Suspense } from "react";

import { CarDeliveryInsurancePrepScreen } from "@/components/organisms/payment/CarDeliveryInsurancePrepScreen";

export default function CarDeliveryInsurancePrepPage() {
  return (
    <Suspense fallback={null}>
      <CarDeliveryInsurancePrepScreen />
    </Suspense>
  );
}
