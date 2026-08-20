import { Suspense } from "react";

import { CarDeliveryScheduleScreen } from "@/components/organisms/payment/CarDeliveryScheduleScreen";

export default function CarDeliverySchedulePage() {
  return (
    <Suspense fallback={null}>
      <CarDeliveryScheduleScreen />
    </Suspense>
  );
}
