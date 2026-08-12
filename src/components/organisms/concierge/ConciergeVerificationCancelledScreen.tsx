"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

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

/** Why the purchase was cancelled — drives Shivi's opening lines. */
type CancelCause = "retries" | "timeout";

const CANCEL_SAYS: Record<CancelCause, readonly [string, string]> = {
  retries: [
    "I wasn't able to verify your documents after the retry, Sharath.",
    `That means I can't keep the purchase open. It's been cancelled. The full ${formatInr(REFUND_INR)} is heading back to your account. 5 to 7 business days. I'll let you know when it lands.`,
  ],
  timeout: [
    "Your verification didn't make it in time, Sharath.",
    `I couldn't keep the purchase open, so it's been cancelled. The full ${formatInr(REFUND_INR)} is heading back to your account in 5 to 7 business days. I'll let you know when it lands.`,
  ],
};

/**
 * Concierge-voice screen shown after a KYC purchase auto-cancels — either the
 * second verification failure, or the re-upload SLA timer running out —
 * then refund initiated → refund successful.
 */
export function ConciergeVerificationCancelledScreen() {
  const searchParams = useSearchParams();
  const cause: CancelCause = searchParams.get("cause") === "timeout" ? "timeout" : "retries";
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
          "Your refund's in your account, Sharath.",
          `${formatInr(REFUND_INR)} is back with you. Whenever you're ready for another car, you know where I am.`,
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
      says={CANCEL_SAYS[cause]}
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
