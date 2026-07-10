"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard, NextStepCard } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";
import {
  BANK_DISBURSEMENT_INR,
  BOOKING_AMOUNT_PAID_INR,
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

/**
 * Loan approved — Shivi notifies the user, explains the dealer-call down-payment
 * flow, and waits for the user to confirm the payment is arranged before
 * instructing the bank to disburse.
 */
export function LoanSanctionedScreen() {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);

  const says = useMemo(
    () => [
      "Your loan is approved, Sharath.",
      `${bank.name} has sanctioned ${formatInr(BANK_DISBURSEMENT_INR)}. ${PARTNER_DEALER_LABEL_CAPITALIZED} will call you to arrange the down payment. Pay it directly to them.`,
      `Once they confirm receipt, I'll instruct ${bank.name} to release the funds to the dealer.`,
    ],
    [bank.name],
  );

  const dealerConfirmedHref = useMemo(() => {
    const params = new URLSearchParams();
    if (bankId) params.set("bank", bankId);
    params.set("loan_amount", String(BANK_DISBURSEMENT_INR));
    return `/payment/down-payment-dealer-confirmed?${params.toString()}`;
  }, [bankId]);

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className="flex flex-col gap-5">
          <NextStepCard
            title={`Watch for ${PARTNER_DEALER_LABEL}'s call`}
            body="Pick up their call. They'll share the payment details so you can pay them directly."
          />
          <AmountReceivedCard
            amountInr={BANK_DISBURSEMENT_INR}
            title={`Approved by ${bank.name}`}
            rows={[
              { label: "Disburses to", value: PARTNER_DEALER_LABEL },
              { label: "Price lock (already paid)", value: formatInr(BOOKING_AMOUNT_PAID_INR) },
            ]}
            note={`${bank.name} releases the remaining funds to ${PARTNER_DEALER_LABEL} once they confirm your down payment.`}
          />
        </div>
      }
      timeSkip={{ label: "After the dealer's call · demo", href: dealerConfirmedHref }}
      callLabel="Questions on the loan? I can call you"
      showMenu
    />
  );
}
