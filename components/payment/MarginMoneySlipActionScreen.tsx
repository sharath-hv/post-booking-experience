"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { BankTransferUtrConfirmBottomSheet } from "@/components/payment/BankTransferUtrConfirmBottomSheet";
import { MarginMoneySlipCard } from "@/components/payment/MarginMoneySlipCard";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";

const HEADLINE = "Your margin money slip is ready!";

const SUBLINE =
  "The dealer has confirmed your down payment. Share this slip with your bank and they will release the loan amount directly to the dealer.";

/**
 * Self finance — after full down payment; user downloads margin money slip for the bank.
 */
export function MarginMoneySlipActionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bank = searchParams.get("bank");
  const loanAmount = searchParams.get("loan_amount");
  const originalDownPayment = searchParams.get("original_down_payment");

  const [bankTransferSheetOpen, setBankTransferSheetOpen] = useState(false);

  const { nextHref, prefetchHref } = useMemo(() => {
    const q = new URLSearchParams();
    if (bank) q.set("bank", bank);
    if (loanAmount) q.set("loan_amount", loanAmount);
    if (originalDownPayment) q.set("original_down_payment", originalDownPayment);
    const qs = q.toString();
    const base = qs
      ? `/payment/self-finance-transfer-verification?${qs}`
      : "/payment/self-finance-transfer-verification";
    return { nextHref: base, prefetchHref: base };
  }, [bank, loanAmount, originalDownPayment]);

  const onBankTransferConfirm = useCallback(() => {
    setBankTransferSheetOpen(false);
    const q = new URLSearchParams();
    if (loanAmount) q.set("loan_amount", loanAmount);
    const qs = q.toString();
    const href = qs
      ? `/payment/self-finance-transfer-verification?${qs}`
      : "/payment/self-finance-transfer-verification";
    router.push(href);
  }, [router, loanAmount]);

  const heroSummaryCard = useMemo(() => <MarginMoneySlipCard />, []);

  return (
    <>
      <KycBookingProcessingScreen
        headline={HEADLINE}
        subline={SUBLINE}
        heroIllustrationSrc={PAYMENT_CHOOSE_ASSETS.documentsReceived}
        heroSummaryCard={heroSummaryCard}
        nextHref={nextHref}
        prefetchHref={prefetchHref}
        nextCtaLabel="Bank has transferred the amount"
        onPrimaryCtaClick={() => setBankTransferSheetOpen(true)}
        manageBookingShowVehicleIdentification
      />
      <BankTransferUtrConfirmBottomSheet
        open={bankTransferSheetOpen}
        onClose={() => setBankTransferSheetOpen(false)}
        onConfirm={onBankTransferConfirm}
      />
    </>
  );
}
