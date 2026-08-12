"use client";

import { useState } from "react";

import { AmountReceivedCard } from "@/components/organisms/artifacts";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { BOOKING_LOCK_AMOUNT_INR } from "@/helpers/paymentUrls";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

const REFUND_INR = BOOKING_LOCK_AMOUNT_INR;

type RefundPhase = "initiated" | "succeeded";

/**
 * Allocation decision SLA timed out. No remediation choices left.
 * Same grammar as KYC retries-exhausted / verification-cancelled.
 */
export function ConciergeAllocationDecisionCancelledScreen() {
  const [phase, setPhase] = useState<RefundPhase>("initiated");

  const refundCard = (
    title: string,
    note: string,
    status: "received" | "processing",
  ) => (
    <AmountReceivedCard
      amountInr={REFUND_INR}
      title={title}
      variant="glass"
      status={status}
      rows={[
        { label: "Booking amount paid", value: formatInr(REFUND_INR) },
        { label: "Cancellation charge", value: "₹0" },
      ]}
      note={note}
    />
  );

  if (phase === "succeeded") {
    return (
      <ConciergeTurnShell
        says={[
          "Your refund has landed, Sharath.",
          `${formatInr(REFUND_INR)} is back with you. Whenever you're ready to book again, I'll be here.`,
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
        `Without a decision, I couldn't keep the booking open, so it's been cancelled. The full ${formatInr(REFUND_INR)} is on its way back to your account within 5 to 7 business days. I'll let you know when it lands.`,
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
