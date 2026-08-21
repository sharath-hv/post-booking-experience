"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/organisms/artifacts";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { ShimmerInfoCard } from "@/components/molecules/ShimmerInfoCard";
import {
  DEMO_LOAN_DISBURSEMENT_TRANSACTION_ID,
  FULL_PAYMENT_INSURANCE_INR,
  SELF_FINANCE_LOAN_DEFAULT_INR,
} from "@/constants/loan-amount-demo-constants";
import { buildPayInsurancePremiumHref } from "@/helpers/paymentUrls";
import styles from "./SelfFinanceTransferConfirmedScreen.module.scss";

import {
  NAMED_DEALER_LABEL,
  NAMED_DEALER_LABEL_CAPITALIZED,
} from "@/constants/dealer-attribution-content";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function parseLoanAmount(raw: string | null): number {
  if (!raw) return SELF_FINANCE_LOAN_DEFAULT_INR;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : SELF_FINANCE_LOAN_DEFAULT_INR;
}

/**
 * Self finance — dealer has confirmed the bank transfer.
 * Card layout mirrors ACKO Drive {@link LoanDisbursementReceivedScreen}.
 */
export function SelfFinanceTransferConfirmedScreen() {
  const searchParams = useSearchParams();
  const loanAmountInr = useMemo(
    () => parseLoanAmount(searchParams.get("loan_amount")),
    [searchParams],
  );

  const transactionId = useMemo(() => {
    const fromUrl = searchParams.get("transaction_id")?.trim();
    return fromUrl && fromUrl.length > 0
      ? fromUrl
      : DEMO_LOAN_DISBURSEMENT_TRANSACTION_ID;
  }, [searchParams]);

  const says = useMemo(
    () => [
      "Transfer confirmed, Sharath.",
      `${NAMED_DEALER_LABEL_CAPITALIZED} has confirmed they received the loan amount. Delivery prep starts now, and nothing more is needed from you until just before the car arrives.`,
    ],
    [],
  );

  const insuranceHref = useMemo(
    () =>
      buildPayInsurancePremiumHref({
        bank: "self_finance",
        loanAmount: String(loanAmountInr),
      }),
    [loanAmountInr],
  );

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className={styles.flex_0}>
          <AmountReceivedCard
            amountInr={loanAmountInr}
            title={`Received by ${NAMED_DEALER_LABEL}`}
            status="received"
            variant="glass"
            rows={[
              { label: "Transferred to", value: NAMED_DEALER_LABEL_CAPITALIZED },
              { label: "Transaction ID", value: transactionId },
            ]}
            note={`Funds are with ${NAMED_DEALER_LABEL}. Delivery prep is now underway.`}
          />
          <ShimmerInfoCard lead="One thing still ahead">
            {`Your ${formatInr(FULL_PAYMENT_INSURANCE_INR)} insurance. The RTO won't register your car without a live policy, and I'll ask you at exactly the right moment.`}
          </ShimmerInfoCard>
        </div>
      }
      timeSkip={{ label: "When your car's nearly ready", href: insuranceHref }}
      callLabel="Need help?"
      showMenu
    />
  );
}
