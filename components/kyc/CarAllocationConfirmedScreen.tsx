"use client";

import { BookingCelebrationSuccessScreen } from "@/components/kyc/BookingCelebrationSuccessScreen";

const USER_NAME = "Sharath";

/**
 * Shown after car allocation pending — same celebration + car card as booking confirmed; Okay → payment.
 */
export function CarAllocationConfirmedScreen() {
  return (
    <BookingCelebrationSuccessScreen
      headline={`Your car has been allocated, ${USER_NAME}!`}
      okayPath="/payment/default"
    />
  );
}
