"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import moneyRoundIcon from "@/assets/Money round.svg";
import { AmountReceivedCard, NextStepCard } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import styles from "./FullPaymentConfirmedScreen.module.scss";

import {
  BOOKING_AMOUNT_PAID_INR,
  FULL_PAYMENT_CAR_AMOUNT_INR,
  FULL_PAYMENT_INSURANCE_INR,
  ON_ROAD_PRICE_INR,
} from "@/components/payment/loan-amount-demo-constants";
import {
  PARTNER_DEALER_LABEL,
  PARTNER_DEALER_LABEL_CAPITALIZED,
} from "@/lib/dealer-attribution-content";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

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
      `Your ₹10,000 booking amount already counts toward the price. ${PARTNER_DEALER_LABEL_CAPITALIZED} will call you to arrange the transfer. Pay the car amount directly to them.`,
    ],
    [],
  );

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className={styles.flex_0}>
          <NextStepCard
            title={`Watch for ${PARTNER_DEALER_LABEL}'s call`}
            body="They'll share the payment details. Transfer the car amount directly to the dealer. Insurance will be collected separately, just before car registration."
          />
          <AmountReceivedCard
            amountInr={ON_ROAD_PRICE_INR}
            title="Your locked price"
            iconSrc={moneyRoundIcon}
            iconBgClassName={styles.bgGray}
            rows={[
              {
                label: "Booking amount",
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
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
