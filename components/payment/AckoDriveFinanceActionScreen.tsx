"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { AckoDriveBankPartnerRow } from "@/components/payment/AckoDriveBankPartnerRow";
import { LoanDocumentsChecklistCard } from "@/components/payment/LoanDocumentsChecklistCard";
import {
  ackoDriveFinanceActionPath,
  bankForQueryParam,
} from "@/components/payment/acko-drive-finance-bank";
import { loanApplicationEntryPath } from "@/lib/loan-application-urls";
import { bankIdToken, bankSelectionPath } from "@/lib/payment/bank-selection-urls";

const HEADLINE_LINE_1 = "Good choice.";
const HEADLINE_LINE_2 = "I'll run your loan from here.";

const SUBLINE =
  "I take your application to the bank, chase the approval, and keep you posted at every step. Here's everything the bank will ask for. Have them nearby and we can start right now.";

/**
 * ACKO Drive finance — action step after celebration confirmation.
 * Same shell as {@link SelfFinanceActionScreen}: processing hero + What's next + primary CTA.
 */
export function AckoDriveFinanceActionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);

  const uploadHref = useMemo(() => loanApplicationEntryPath(bank.id, { fresh: true }), [bank.id]);

  const changeBankHref = useMemo(
    () => bankSelectionPath({ next: ackoDriveFinanceActionPath(bankIdToken()) }),
    [],
  );

  const onBankChange = useCallback(() => router.push(changeBankHref), [router, changeBankHref]);

  const belowHeadline = useMemo(
    () => <AckoDriveBankPartnerRow bank={bank} onChange={onBankChange} />,
    [bank, onBankChange],
  );

  const heroSummaryCard = useMemo(() => <LoanDocumentsChecklistCard />, []);

  return (
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
  );
}
