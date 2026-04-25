"use client";

import { Suspense } from "react";

import { CarDeliveryScheduleScreen } from "@/components/payment/CarDeliveryScheduleScreen";

export default function CarDeliverySchedulePage() {
  return (
    <Suspense fallback={null}>
      <CarDeliveryScheduleScreen />
    </Suspense>
  );
}
