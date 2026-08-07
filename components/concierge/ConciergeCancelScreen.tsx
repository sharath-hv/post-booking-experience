"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import moneyIcon from "@/assets/money.svg";
import { AmountReceivedCard } from "@/components/organisms/artifacts";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { CancelBookingReasonBottomSheet } from "@/components/organisms/CancelBookingReasonBottomSheet";
import { MODIFY_BOOKING_CANCEL_FEE_INR } from "@/lib/manage-booking-modify";
import { BOOKING_LOCK_AMOUNT_INR } from "@/lib/paymentUrls";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

type CancelPhase = "confirm" | "initiated" | "succeeded";

/**
 * Cancellation — policy-correct at every stage:
 * - Before a dealer is identified: full refund, no questions.
 * - From booking accepted onward (even before OTP): 50% of the booking amount
 *   is retained; other payments come back.
 * Shivi tries to save the deal first; the refund math is shown before any
 * commitment; reasons are collected in her voice; then refund initiated →
 * refund successful (terminal).
 */
export function ConciergeCancelScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reasonSheetOpen, setReasonSheetOpen] = useState(false);
  const [phase, setPhase] = useState<CancelPhase>("confirm");

  const paidInr = useMemo(() => {
    const raw = Number(searchParams.get("paid"));
    return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : BOOKING_LOCK_AMOUNT_INR;
  }, [searchParams]);

  const postConfirmation = searchParams.get("stage") === "post";
  /** Second model/colour change — policy §1.9 treats it as cancel + rebook. */
  const secondChange = searchParams.get("reason") === "second-change";
  /** ACKO couldn't deliver — policy §1.14: 100% refund at any stage. */
  const ourFailure = searchParams.get("reason") === "our-failure";

  const chargeInr =
    postConfirmation && !ourFailure ? MODIFY_BOOKING_CANCEL_FEE_INR : 0;
  const refundInr = Math.max(0, paidInr - chargeInr);

  const refundCard = (
    title: string,
    note: string,
    status?: "received" | "processing",
    iconSrc?: typeof moneyIcon,
  ) => (
    <AmountReceivedCard
      amountInr={refundInr}
      title={title}
      variant="glass"
      status={status}
      iconSrc={iconSrc}
      rows={[
        { label: "Booking amount paid", value: formatInr(paidInr) },
        {
          label: "Cancellation charge",
          value: chargeInr > 0 ? `− ${formatInr(chargeInr)}` : "₹0",
        },
      ]}
      note={note}
    />
  );

  if (phase === "succeeded") {
    return (
      <ConciergeTurnShell
        says={[
          "It's in your account, Sharath.",
          `${formatInr(refundInr)} is back with you. Whenever you're ready for another car, you know where I am.`,
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

  if (phase === "initiated") {
    return (
      <ConciergeTurnShell
        says={[
          "On its way, Sharath.",
          `${formatInr(refundInr)} is heading back to your account. 5 to 7 business days. I'll let you know when it lands.`,
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
        onBack={() => setPhase("confirm")}
        showMenu={false}
      />
    );
  }

  return (
    <>
      <ConciergeTurnShell
        says={
          ourFailure
            ? [
                "This one's on me, Sharath.",
                "I couldn't deliver, so every rupee you've paid comes back, no questions asked.",
              ]
            : secondChange
            ? [
                "A second change means starting over, Sharath.",
                "You've used your one change. That's the line in the policy I can't move. Changing again works as a cancel-and-rebook: 50% of your booking amount is held back, and you start fresh with the car you actually want. Your call entirely.",
              ]
            : postConfirmation
              ? [
                  "Before I cancel anything, Sharath…",
                  "We're past the lock point, so cancelling holds back 50% of your booking amount. That's the one rule I can't bend. If it's the car that's wrong, a colour or model change costs just ₹5,000. If it's anything else, talk to me first. I can usually fix it.",
                ]
              : [
                  "Want to stop here, Sharath?",
                  "No charge at this stage. Every rupee comes straight back. But tell me what went wrong first; if it's the car or the timing, I can usually fix it before you go.",
                ]
        }
        artifact={refundCard(
          "Comes back to you if you cancel now",
          "Refunds land in 5–7 business days.",
          undefined,
          moneyIcon,
        )}
        replies={[
          {
            label: ourFailure
              ? "Refund me " + formatInr(refundInr)
              : "Yes, cancel and refund " + formatInr(refundInr),
            // When WE failed, asking "what went wrong" is tone-deaf — skip the reason sheet.
            onClick: () => (ourFailure ? setPhase("initiated") : setReasonSheetOpen(true)),
            echo: null,
          },
          {
            label: "Let me think. Go back",
            onClick: () => router.back(),
            kind: "soft",
            echo: null,
          },
        ]}
        showMenu={false}
      />
      <CancelBookingReasonBottomSheet
        open={reasonSheetOpen}
        onClose={() => setReasonSheetOpen(false)}
        onConfirm={() => {
          setReasonSheetOpen(false);
          setPhase("initiated");
        }}
      />
    </>
  );
}
