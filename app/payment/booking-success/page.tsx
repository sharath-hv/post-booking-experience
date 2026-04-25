"use client";

import { Suspense } from "react";

import { PaymentSuccessCelebration } from "@/components/payment/PaymentSuccessCelebration";

import { BOOKING_LOCK_AMOUNT_INR } from "@/lib/paymentUrls";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function BookingPaymentSuccessInner() {
  return (
    <PaymentSuccessCelebration
      subline={`${formatInr(BOOKING_LOCK_AMOUNT_INR)} booking amount received`}
      upNextDetail=" KYC verification"
      ctaLabel="Continue"
      ctaHref="/kyc"
    />
  );
}

export default function BookingPaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BookingPaymentSuccessInner />
    </Suspense>
  );
}
