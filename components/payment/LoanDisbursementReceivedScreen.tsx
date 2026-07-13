"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";
import {
  DEMO_DEFAULT_LOAN_DISBURSEMENT_INR,
  DEMO_LOAN_DISBURSEMENT_TRANSACTION_ID,
  FULL_PAYMENT_INSURANCE_INR,
} from "@/components/payment/loan-amount-demo-constants";
import { buildPayInsurancePremiumHref } from "@/lib/paymentUrls";
import { PARTNER_DEALER_LABEL, PARTNER_DEALER_LABEL_CAPITALIZED } from "@/lib/dealer-attribution-content";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function parseLoanAmountInr(raw: string | null): number {
  if (raw == null || raw === "") return DEMO_DEFAULT_LOAN_DISBURSEMENT_INR;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return DEMO_DEFAULT_LOAN_DISBURSEMENT_INR;
  return Math.round(n);
}

type LoanDisbursementReceivedScreenProps = {
  /** Primary CTA destination (defaults to pay insurance premium). */
  okayHref?: string;
};

export function LoanDisbursementReceivedScreen({
  okayHref: okayHrefProp,
}: LoanDisbursementReceivedScreenProps) {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);

  const disbursedAmountInr = useMemo(
    () => parseLoanAmountInr(searchParams.get("loan_amount")),
    [searchParams],
  );

  const transactionId = useMemo(() => {
    const fromUrl = searchParams.get("transaction_id")?.trim();
    return fromUrl && fromUrl.length > 0
      ? fromUrl
      : DEMO_LOAN_DISBURSEMENT_TRANSACTION_ID;
  }, [searchParams]);

  const okayHref = useMemo(
    () =>
      okayHrefProp ??
      buildPayInsurancePremiumHref({
        bank: bankId,
        loanAmount: searchParams.get("loan_amount"),
      }),
    [okayHrefProp, bankId, searchParams],
  );

  const says = useMemo(
    () => [
      "Loan disbursed, Sharath.",
      `I've confirmed the transfer to ${PARTNER_DEALER_LABEL}. Delivery prep starts now, and nothing more is needed from you until just before the car arrives.`,
    ],
    [],
  );

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className="flex flex-col gap-4">
          <AmountReceivedCard
            amountInr={disbursedAmountInr}
            title={`Disbursed by ${bank.name}`}
            status="received"
            variant="glass"
            rows={[
              { label: "Transferred to", value: PARTNER_DEALER_LABEL_CAPITALIZED },
              { label: "Transaction ID", value: transactionId },
            ]}
            note="Funds are with the dealer. Delivery prep is now underway."
          />
          <ShimmerInfoCard icon="info">
            <strong>One thing still ahead:</strong>{` your ${formatInr(FULL_PAYMENT_INSURANCE_INR)} insurance. The RTO won't register your car without a live policy, and I'll ask you at exactly the right moment.`}
          </ShimmerInfoCard>
        </div>
      }
      timeSkip={{ label: "When your car's nearly ready", href: okayHref }}
      callLabel="Questions? I can call you"
      showMenu
    />
  );
}
