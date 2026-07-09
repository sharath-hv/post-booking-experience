"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import moneyRoundIcon from "@/assets/Money round.svg";
import { AmountReceivedCard, NextStepCard } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import {
  BOOKING_AMOUNT_PAID_INR,
  FULL_PAYMENT_CAR_AMOUNT_INR,
  FULL_PAYMENT_INSURANCE_INR,
  ON_ROAD_PRICE_INR,
} from "@/components/payment/loan-amount-demo-constants";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

const DEALER_NAME = "Advaith Hyundai";

const VERIFICATION_HREF = `/payment/full-cash-payment-verification?car_amount=${FULL_PAYMENT_CAR_AMOUNT_INR}`;

/**
 * Full cash payment — Shivi shows the price breakdown and explains that the
 * dealer will call to arrange the offline transfer. Consistent with the
 * self-finance loan-confirmed pattern.
 */
export function FullPaymentConfirmedScreen() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(VERIFICATION_HREF);
  }, [router]);

  const says = useMemo(
    () => [
      "Here's what you're paying, Sharath.",
      `Your ₹10,000 lock already counts toward the price. ${DEALER_NAME} will call you to arrange the transfer. Pay the car amount directly to them.`,
    ],
    [],
  );

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className="flex flex-col gap-4">
          <NextStepCard
            title={`Watch for ${DEALER_NAME}'s call`}
            body="They'll share the payment details. Transfer the car amount directly to the dealer. Insurance will be collected separately, just before car registration."
          />
          <AmountReceivedCard
            amountInr={ON_ROAD_PRICE_INR}
            title="Your locked price"
            iconSrc={moneyRoundIcon}
            iconBgClassName="bg-[#f0f0f0]"
            rows={[
              {
                label: "Price lock",
                value: `− ${formatInr(BOOKING_AMOUNT_PAID_INR)}`,
                tag: { text: "Paid ✓", variant: "green" },
              },
              {
                label: "Insurance",
                value: `− ${formatInr(FULL_PAYMENT_INSURANCE_INR)}`,
                tag: { text: "Later · before delivery", variant: "amber" },
              },
            ]}
          />
        </div>
      }
      replies={[
        {
          label: "I've transferred the amount",
          href: VERIFICATION_HREF,
          echo: "I've transferred the amount",
        },
      ]}
      timeSkip={{ label: "After you've transferred the amount", href: VERIFICATION_HREF }}
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
