"use client";

import { BookingCelebrationSuccessScreen } from "@/components/kyc/BookingCelebrationSuccessScreen";
import { DownPaymentInstalmentSuccess } from "@/components/payment/DownPaymentInstalmentSuccess";
import { type ActiveBookingSnapshot } from "@/lib/active-booking-snapshot";
import { BUYING_GUIDE_ENTRY_PATH } from "@/lib/buying-guide-urls";
import { isModifyNoChargesFlow } from "@/lib/experience-flow";
import { JOURNEY_PATHS } from "@/lib/journey-routes";
import { BOOKING_LOCK_AMOUNT_INR } from "@/lib/paymentUrls";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type KycBookingConfirmedScreenProps = {
  /** `payment` — after booking-lock checkout; default — end of KYC processing. */
  variant?: "default" | "payment";
  /** Paid booking-lock amount from mock checkout (`?paid=`). */
  paidAmountInr?: number;
  /**
   * Modify-selection pay (colour / variant / different-car) — auto-advance
   * “Payment received” ack; next route is journey-aware.
   */
  afterModifySelection?: boolean;
  activeBooking?: ActiveBookingSnapshot | null;
};

/**
 * Booking confirmation success — Figma Post-booking-experience / node 1880:7088.
 *
 * All three modify-selection paths share this return: auto-advance payment ack.
 * - `modify_no_charges` (pre-verification demo) → `/kyc`
 * - post-verification returns (express/standard after allocation-failed,
 *   `modify_with_charges`) → `/kyc/processing` — never re-ask for identity
 */
export function KycBookingConfirmedScreen({
  variant = "default",
  paidAmountInr = BOOKING_LOCK_AMOUNT_INR,
  afterModifySelection = false,
  activeBooking = null,
}: KycBookingConfirmedScreenProps) {
  const isPayment = variant === "payment";

  if (isPayment && afterModifySelection) {
    const resumeAfterVerification = !isModifyNoChargesFlow();
    const nextHref = resumeAfterVerification
      ? JOURNEY_PATHS.kyc.processing
      : JOURNEY_PATHS.kyc.hub;
    const receivedInr =
      activeBooking?.lastBookingAmountPaidInr ?? paidAmountInr;

    return (
      <DownPaymentInstalmentSuccess
        subline={`We've received ${formatInr(receivedInr)}.`}
        nextHref={nextHref}
      />
    );
  }

  if (isPayment) {
    return (
      <DownPaymentInstalmentSuccess
        subline={`We've received ${formatInr(paidAmountInr)}.`}
        nextHref={BUYING_GUIDE_ENTRY_PATH}
      />
    );
  }

  return (
    <BookingCelebrationSuccessScreen
      headline="Your booking is confirmed with Hyundai"
      okayPath="/car-allocation/pending"
      ctaLabel="Continue"
      upNextText="Car allocation"
    />
  );
}
