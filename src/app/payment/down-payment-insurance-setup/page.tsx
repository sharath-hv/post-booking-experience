"use client";

import { Suspense } from "react";

import { DownPaymentInsuranceSetupScreen } from "@/components/organisms/payment/DownPaymentInsuranceSetupScreen";

export default function DownPaymentInsuranceSetupPage() {
  return (
    <Suspense fallback={null}>
      <DownPaymentInsuranceSetupScreen />
    </Suspense>
  );
}
