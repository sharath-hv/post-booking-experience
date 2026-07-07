"use client";

import { AmountReceivedCard } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { BOOKING_LOCK_AMOUNT_INR } from "@/lib/paymentUrls";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

const REFUND_INR = BOOKING_LOCK_AMOUNT_INR;

/**
 * Concierge-voice screen shown after the second KYC verification failure —
 * purchase auto-cancelled, full refund initiated.
 */
export function ConciergeVerificationCancelledScreen() {
  return (
    <ConciergeTurnShell
      says={[
        "I wasn't able to verify your documents after the retry, Sharath.",
        `That means I can't keep the purchase open — it's been cancelled. The full ${formatInr(REFUND_INR)} is on its way back to your original payment method within 5–7 business days.`,
        "Nothing more needed from you. And whenever you want to try again, I'm here.",
      ]}
      artifact={
        <AmountReceivedCard
          amountInr={REFUND_INR}
          title="Refund on its way"
          rows={[
            { label: "Amount paid", value: formatInr(REFUND_INR) },
            { label: "Cancellation charge", value: "₹0" },
            { label: "Refund", value: formatInr(REFUND_INR) },
          ]}
          note="Back to your original payment method within 5–7 business days."
        />
      }
      timeSkip={{ label: "Back to the start", href: "/quote" }}
      showMenu={false}
    />
  );
}
