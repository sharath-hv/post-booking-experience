"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AmountReceivedCard } from "@/components/organisms/artifacts";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { BankTransferUtrConfirmBottomSheet } from "@/components/organisms/payment/BankTransferUtrConfirmBottomSheet";
import { MarginMoneySlipCard } from "@/components/organisms/payment/MarginMoneySlipCard";
import {
  NAMED_DEALER_LABEL,
  NAMED_DEALER_LABEL_CAPITALIZED,
  NAMED_DEALER_NAME,
} from "@/constants/dealer-attribution-content";
import {
  cashDownPaymentDueInr,
  SELF_FINANCE_LOAN_DEFAULT_INR,
} from "@/constants/loan-amount-demo-constants";
import styles from "./MarginMoneySlipActionScreen.module.scss";

const SLIP_READY_QUERY = "slip_ready";

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
 * Self finance — dealer down-payment confirm takes 2-3 hours (ongoing wait).
 * Demo skip reveals the margin money slip; then the user can confirm the bank transfer.
 */
export function MarginMoneySlipActionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bank = searchParams.get("bank");
  const loanAmount = searchParams.get("loan_amount");
  const originalDownPayment = searchParams.get("original_down_payment");
  const dealerConfirmed = searchParams.get(SLIP_READY_QUERY) === "1";

  const downPaymentInr = useMemo(() => {
    if (originalDownPayment != null && Number.isFinite(Number(originalDownPayment))) {
      const n = Math.round(Number(originalDownPayment));
      if (n > 0) return n;
    }
    return cashDownPaymentDueInr(parseLoanAmount(loanAmount));
  }, [loanAmount, originalDownPayment]);

  const [bankTransferSheetOpen, setBankTransferSheetOpen] = useState(false);

  const marginMoneyHref = useCallback(
    (slipReady: boolean) => {
      const q = new URLSearchParams();
      if (bank) q.set("bank", bank);
      if (loanAmount) q.set("loan_amount", loanAmount);
      if (originalDownPayment) q.set("original_down_payment", originalDownPayment);
      if (slipReady) q.set(SLIP_READY_QUERY, "1");
      const qs = q.toString();
      return qs ? `/payment/margin-money-slip?${qs}` : "/payment/margin-money-slip";
    },
    [bank, loanAmount, originalDownPayment],
  );

  const transferVerificationHref = useMemo(() => {
    const q = new URLSearchParams();
    if (bank) q.set("bank", bank);
    if (loanAmount) q.set("loan_amount", loanAmount);
    if (originalDownPayment) q.set("original_down_payment", originalDownPayment);
    const qs = q.toString();
    return qs
      ? `/payment/self-finance-transfer-verification?${qs}`
      : "/payment/self-finance-transfer-verification";
  }, [bank, loanAmount, originalDownPayment]);

  const loanConfirmedHref = useMemo(() => {
    const q = new URLSearchParams();
    if (loanAmount) q.set("loan_amount", loanAmount);
    const qs = q.toString();
    return qs
      ? `/payment/self-finance-loan-confirmed?${qs}`
      : "/payment/self-finance-loan-confirmed";
  }, [loanAmount]);

  const onBankTransferConfirm = useCallback(() => {
    router.push(transferVerificationHref);
  }, [router, transferVerificationHref]);

  const markSlipReady = useCallback(() => {
    // Replace so history keeps one margin-money entry (slip-ready), and browser
    // back from transfer-verification restores this beat instead of the wait.
    router.replace(marginMoneyHref(true));
  }, [marginMoneyHref, router]);

  const onBack = useCallback(() => {
    // Same-URL two-beat turn — don't skip the checking state via history.
    if (dealerConfirmed) {
      router.replace(marginMoneyHref(false));
      return;
    }
    router.replace(loanConfirmedHref);
  }, [dealerConfirmed, loanConfirmedHref, marginMoneyHref, router]);

  const says = useMemo(
    () =>
      dealerConfirmed
        ? [
            `${NAMED_DEALER_NAME} confirmed your ${formatInr(downPaymentInr)} down payment.`,
            `Your margin money slip is ready. Share it with your bank and they will release the loan amount directly to ${NAMED_DEALER_LABEL}.`,
          ]
        : [
            `Checking your down payment with ${NAMED_DEALER_LABEL}.`,
            `Confirming with ${NAMED_DEALER_LABEL} usually takes 2-3 hours. I'll hand you the margin money slip the moment they confirm.`,
          ],
    [dealerConfirmed, downPaymentInr],
  );

  return (
    <>
      <ConciergeTurnShell
        key={dealerConfirmed ? "slip-ready" : "dealer-check"}
        says={says}
        workingBeforeArtifact
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
            <div className={styles.artifactStack}>
              <MarginMoneySlipCard variant="glass" />
              <AmountReceivedCard
                variant="glass"
                amountInr={downPaymentInr}
                title="Down payment confirmed"
                status="received"
                rows={[
                  {
                    label: "Confirmed by",
                    value: NAMED_DEALER_LABEL_CAPITALIZED,
                  },
                ]}
              />
            </div>
          ) : null
        }
        replies={
          dealerConfirmed
            ? [
                {
                  label: "Bank has transferred the amount",
                  onClick: () => setBankTransferSheetOpen(true),
                  echo: null,
                },
              ]
            : undefined
        }
        timeSkip={
          dealerConfirmed
            ? undefined
            : {
                label: "Dealer confirmed down payment",
                onSelect: markSlipReady,
              }
        }
        dateHolder={dealerConfirmed ? "you" : "shivi"}
        onBack={onBack}
        callLabel="Need help?"
        showMenu
        manageShowVehicleIdentification
      />
      <BankTransferUtrConfirmBottomSheet
        open={bankTransferSheetOpen}
        onClose={() => setBankTransferSheetOpen(false)}
        onConfirm={onBankTransferConfirm}
      />
    </>
  );
}
