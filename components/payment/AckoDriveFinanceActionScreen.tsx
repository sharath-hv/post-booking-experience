"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { AckoDriveBankPartnerRow } from "@/components/payment/AckoDriveBankPartnerRow";
import { LoanDocumentsChecklistCard } from "@/components/payment/LoanDocumentsChecklistCard";
import {
  ackoDriveFinanceActionPath,
  bankForQueryParam,
} from "@/components/payment/acko-drive-finance-bank";
import { loanApplicationEntryPath } from "@/lib/loan-application-urls";
import { BankSelectionBottomSheet } from "@/components/payment/BankSelectionBottomSheet";

const HEADLINE_LINE_1 = "Good choice — I'll run";
const HEADLINE_LINE_2 = "your loan from here.";

const SUBLINE =
  "I take your application to the bank, chase the approval, and keep you posted at every step. Here's everything the bank will ask for — have them nearby and we can start right now.";

/**
 * ACKO Drive finance — action step after celebration confirmation.
 * Same shell as {@link SelfFinanceActionScreen}: processing hero + What's next + primary CTA.
 */
export function AckoDriveFinanceActionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);
  const [bankSheetOpen, setBankSheetOpen] = useState(false);

  const uploadHref = useMemo(() => loanApplicationEntryPath(bank.id, { fresh: true }), [bank.id]);

  const onBankChange = useCallback(() => setBankSheetOpen(true), []);

  const onBankSheetConfirm = useCallback(
    (nextBankId: string) => {
      setBankSheetOpen(false);
      router.replace(ackoDriveFinanceActionPath(nextBankId));
    },
    [router],
  );

  const belowHeadline = useMemo(
    () => <AckoDriveBankPartnerRow bank={bank} onChange={onBankChange} />,
    [bank, onBankChange],
  );

  const heroSummaryCard = useMemo(() => <LoanDocumentsChecklistCard />, []);

  return (
    <>
      <KycBookingProcessingScreen
        headline={HEADLINE_LINE_1}
        headlineLine2={HEADLINE_LINE_2}
        belowHeadline={belowHeadline}
        subline={SUBLINE}
        heroSummaryCard={heroSummaryCard}
        nextHref={uploadHref}
        prefetchHref={uploadHref}
        nextCtaLabel="Start my loan application"
        manageBookingShowVehicleIdentification
      />
      <BankSelectionBottomSheet
        open={bankSheetOpen}
        onClose={() => setBankSheetOpen(false)}
        onConfirm={onBankSheetConfirm}
        initialBankId={bank.id}
      />
    </>
  );
}
