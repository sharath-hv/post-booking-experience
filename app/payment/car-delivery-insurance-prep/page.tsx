"use client";

import { Suspense } from "react";

import { CarDeliveryInsurancePrepScreen } from "@/components/payment/CarDeliveryInsurancePrepScreen";

export default function CarDeliveryInsurancePrepPage() {
  return (
    <Suspense fallback={null}>
      <CarDeliveryInsurancePrepScreen />
    </Suspense>
  );
}
