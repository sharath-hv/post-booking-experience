"use client";

import { Suspense } from "react";

import { PayDownPaymentScreen } from "@/components/payment/PayDownPaymentScreen";

/**
 * After confirming loan amount — prompt to pay down payment (layout aligned with `/payment/loan-sanctioned`).
 */
export default function PayDownPaymentPage() {
  return (
    <Suspense fallback={null}>
      <PayDownPaymentScreen />
    </Suspense>
  );
}
