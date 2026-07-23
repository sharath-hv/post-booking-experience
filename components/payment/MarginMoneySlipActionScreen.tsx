"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { BankTransferUtrConfirmBottomSheet } from "@/components/payment/BankTransferUtrConfirmBottomSheet";
import { MarginMoneySlipCard } from "@/components/payment/MarginMoneySlipCard";
import { PARTNER_DEALER_LABEL } from "@/lib/dealer-attribution-content";

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

  const [bankTransferSheetOpen, setBankTransferSheetOpen] = useState(false);
  const [dealerConfirmed, setDealerConfirmed] = useState(false);

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

  const onBankTransferConfirm = useCallback(() => {
    setBankTransferSheetOpen(false);
    router.push(transferVerificationHref);
  }, [router, transferVerificationHref]);

  const says = useMemo(
    () =>
      dealerConfirmed
        ? [
            "Your margin money slip is ready, Sharath.",
            `The dealer has confirmed your down payment. Share this slip with your bank and they will release the loan amount directly to ${PARTNER_DEALER_LABEL}.`,
          ]
        : [
            "I'm checking with the dealer on your down payment, Sharath.",
            `Confirming with ${PARTNER_DEALER_LABEL} usually takes 2-3 hours. I'll hand you the margin money slip the moment they confirm.`,
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
                  "Checking with our dealer partner",
                  "Confirming they've received your down payment",
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
                onSelect: () => setDealerConfirmed(true),
              }
        }
        dateHolder={dealerConfirmed ? "you" : "shivi"}
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
