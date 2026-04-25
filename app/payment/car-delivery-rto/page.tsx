"use client";

import { Suspense } from "react";

import { CarDeliveryRtoPrepScreen } from "@/components/payment/CarDeliveryRtoPrepScreen";

export default function CarDeliveryRtoPage() {
  return (
    <Suspense fallback={null}>
      <CarDeliveryRtoPrepScreen />
    </Suspense>
  );
}
