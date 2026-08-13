"use client";

import { useState } from "react";

import { AmountReceivedCard } from "@/components/organisms/artifacts";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import {
  cancelBookingRefundAmountInr,
  cancelBookingRefundBookingAmountInr,
  formatCancelBookingInr,
} from "@/constants/cancel-booking-content";
import { MODIFY_BOOKING_CANCEL_FEE_INR } from "@/helpers/manage-booking-modify";

type RefundPhase = "initiated" | "succeeded";

/**
 * Loan-rejected decision SLA timed out. Car is already allocated
 * (engine/chassis assigned), so the post-lock 50% cancellation fee applies —
 * unlike allocation decision-cancelled, where the unit was never assigned.
 */
export function LoanDecisionCancelledScreen() {
  const [phase, setPhase] = useState<RefundPhase>("initiated");
  const paidInr = cancelBookingRefundBookingAmountInr();
  const chargeInr = MODIFY_BOOKING_CANCEL_FEE_INR;
  const refundInr = cancelBookingRefundAmountInr();

  const refundCard = (
    title: string,
    note: string,
    status: "received" | "processing",
  ) => (
    <AmountReceivedCard
      amountInr={refundInr}
      title={title}
      variant="glass"
      status={status}
      rows={[
        { label: "Booking amount paid", value: formatCancelBookingInr(paidInr) },
        {
          label: "Cancellation charge",
          value: `− ${formatCancelBookingInr(chargeInr)}`,
        },
      ]}
      note={note}
    />
  );

  if (phase === "succeeded") {
    return (
      <ConciergeTurnShell
        says={[
          "Your refund has landed, Sharath.",
          `${formatCancelBookingInr(refundInr)} is back with you. Whenever you're ready to book again, I'll be here.`,
        ]}
        artifact={refundCard(
          "Refund successful",
          "Credited to the original payment method. This booking is closed.",
          "received",
        )}
        timeSkip={{ label: "Back to the start", href: "/quote" }}
        onBack={() => setPhase("initiated")}
        showMenu={false}
      />
    );
  }

  return (
    <ConciergeTurnShell
      says={[
        "You ran out of time to choose, Sharath.",
        `Without a decision on the loan, I couldn't keep the booking open, so it's been cancelled. We're past the lock point, so 50% of your booking amount is held back. ${formatCancelBookingInr(refundInr)} is heading back to your account in 5 to 7 business days. I'll let you know when it lands.`,
      ]}
      artifact={refundCard(
        "Refund initiated",
        "Refunds go to the original payment method within 5–7 business days.",
        "processing",
      )}
      timeSkip={{
        label: "After refund is processed",
        onSelect: () => setPhase("succeeded"),
      }}
      showMenu={false}
    />
  );
}
