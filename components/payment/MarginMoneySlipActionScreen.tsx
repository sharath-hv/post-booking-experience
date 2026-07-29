"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { BankTransferUtrConfirmBottomSheet } from "@/components/payment/BankTransferUtrConfirmBottomSheet";
import { MarginMoneySlipCard } from "@/components/payment/MarginMoneySlipCard";
import { NAMED_DEALER_LABEL, NAMED_DEALER_NAME } from "@/lib/dealer-attribution-content";

const SLIP_READY_QUERY = "slip_ready";

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
    setBankTransferSheetOpen(false);
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
            "Your margin money slip is ready, Sharath.",
            `${NAMED_DEALER_NAME} has confirmed your down payment. Share this slip with your bank and they will release the loan amount directly to ${NAMED_DEALER_LABEL}.`,
          ]
        : [
            `I'm checking with ${NAMED_DEALER_LABEL} on your down payment, Sharath.`,
            `Confirming with ${NAMED_DEALER_LABEL} usually takes 2-3 hours. I'll hand you the margin money slip the moment they confirm.`,
          ],
    [dealerConfirmed],
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
        artifact={dealerConfirmed ? <MarginMoneySlipCard /> : null}
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
        callLabel="Questions? I can call you"
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
