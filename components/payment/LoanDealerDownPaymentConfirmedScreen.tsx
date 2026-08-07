"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/organisms/artifacts";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";

import {
  BANK_DISBURSEMENT_INR,
  cashDownPaymentDueInr,
} from "@/lib/loan-amount-demo-constants";
import {
  NAMED_DEALER_LABEL,
  NAMED_DEALER_LABEL_CAPITALIZED,
  NAMED_DEALER_NAME,
} from "@/lib/dealer-attribution-content";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function parseLoanAmount(raw: string | null): number {
  if (!raw) return BANK_DISBURSEMENT_INR;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : BANK_DISBURSEMENT_INR;
}

/**
 * After the user pays the down payment: first confirm with the dealer (hours),
 * then instruct the bank to disburse. Bridges loan-sanctioned → loan-disbursement-received.
 */
export function LoanDealerDownPaymentConfirmedScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);
  const loanAmountInr = useMemo(
    () => parseLoanAmount(searchParams.get("loan_amount")),
    [searchParams],
  );
  const [dealerConfirmed, setDealerConfirmed] = useState(false);

  const downPaymentInr = useMemo(() => cashDownPaymentDueInr(loanAmountInr), [loanAmountInr]);

  const onBack = useCallback(() => {
    // Same-URL two-beat turn — don't skip the checking state via history.
    if (dealerConfirmed) {
      setDealerConfirmed(false);
      return;
    }
    const params = new URLSearchParams();
    if (bankId) params.set("bank", bankId);
    const qs = params.toString();
    router.replace(qs ? `/payment/loan-sanctioned?${qs}` : "/payment/loan-sanctioned");
  }, [bankId, dealerConfirmed, router]);

  const waitingSays = useMemo(
    () => [
      `I'm checking your down payment with ${NAMED_DEALER_LABEL}, Sharath.`,
      `It usually takes 2-3 hours. Once they confirm, I'll ask ${bank.name} to release the loan.`,
    ],
    [bank.name],
  );

  const confirmedSays = useMemo(
    () => [
      "Down payment confirmed.",
      `I've asked ${bank.name} to release the funds to ${NAMED_DEALER_LABEL}. Nothing more needed from you. I'll let you know the moment it lands.`,
    ],
    [bank.name],
  );

  const disbursementReceivedHref = useMemo(() => {
    const params = new URLSearchParams();
    if (bankId) params.set("bank", bankId);
    params.set("loan_amount", String(loanAmountInr));
    return `/payment/loan-disbursement-received?${params.toString()}`;
  }, [bankId, loanAmountInr]);

  return (
    <ConciergeTurnShell
      key={dealerConfirmed ? "dp-confirmed" : "dp-checking"}
      says={dealerConfirmed ? confirmedSays : waitingSays}
      workingBeforeArtifact={!dealerConfirmed}
      working={
        dealerConfirmed
          ? undefined
          : {
              mode: "ongoing",
              lines: [
                `Reaching out to ${NAMED_DEALER_NAME}`,
                "Verifying they've received your payment",
              ],
              etaLabel: "Usually 2-3 hours. I'll message you when it's confirmed.",
            }
      }
      artifact={
        dealerConfirmed ? (
          <AmountReceivedCard
            amountInr={loanAmountInr}
            title={`${bank.name} disbursement · in progress`}
            status="processing"
            variant="glass"
            rows={[
              { label: "Down payment confirmed", value: formatInr(downPaymentInr) },
              { label: "Releasing to", value: NAMED_DEALER_LABEL_CAPITALIZED },
            ]}
            note="Typically completes within 1-2 business days."
          />
        ) : null
      }
      timeSkip={
        dealerConfirmed
          ? { label: "Once the bank disburses", href: disbursementReceivedHref }
          : {
              label: "Dealer confirmed down payment",
              onSelect: () => setDealerConfirmed(true),
            }
      }
      dateHolder="shivi"
      onBack={onBack}
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
