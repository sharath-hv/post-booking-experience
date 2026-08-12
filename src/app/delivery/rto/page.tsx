"use client";

import { Suspense } from "react";

import { CarDeliveryRtoPrepScreen } from "@/components/organisms/payment/CarDeliveryRtoPrepScreen";

export default function CarDeliveryRtoPage() {
  return (
    <Suspense fallback={null}>
      <CarDeliveryRtoPrepScreen />
    </Suspense>
  );
}
