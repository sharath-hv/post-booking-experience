"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { AckoDriveBankPartnerRow } from "@/components/payment/AckoDriveBankPartnerRow";
import { LoanApplicationCoApplicantBottomSheet } from "@/components/payment/loan-application/LoanApplicationCoApplicantBottomSheet";
import { LoanDocumentsChecklistCard } from "@/components/payment/LoanDocumentsChecklistCard";
import {
  ackoDriveFinanceActionPath,
  bankForQueryParam,
} from "@/components/payment/acko-drive-finance-bank";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import {
  createDefaultCoApplicantProfile,
  createDefaultLoanApplicationState,
  writeLoanApplicationState,
} from "@/lib/loan-application-state";
import { loanApplicationPath } from "@/lib/loan-application-urls";
import { bankIdToken, bankSelectionPath } from "@/lib/payment/bank-selection-urls";
import { cn } from "@/lib/utils";
import styles from "./AckoDriveFinanceActionScreen.module.scss";

const SAYS = [
  "Good choice. Let's get your loan application started.",
  "Keep these ready so we don't lose momentum. Photos or PDFs work fine, nothing to print.",
  "What they'll need from you",
] as const;

/**
 * ACKO Drive finance — action step after bank pick.
 * Same concierge grammar as booking-success arrival: echo → lead → afterLead
 * card → body → glass artifact → reply CTA.
 */
export function AckoDriveFinanceActionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);
  const [coApplicantSheetOpen, setCoApplicantSheetOpen] = useState(false);

  const changeBankHref = useMemo(
    () => bankSelectionPath({ next: ackoDriveFinanceActionPath(bankIdToken()) }),
    [],
  );

  const onBankChange = useCallback(() => router.push(changeBankHref), [router, changeBankHref]);

  const afterLead = useMemo(
    () => (
      <div className={cn(OVERLAY_GLASS_CARD_CLASS, styles.bankCard)}>
        <AckoDriveBankPartnerRow bank={bank} onChange={onBankChange} />
      </div>
    ),
    [bank, onBankChange],
  );

  const onStartApplication = useCallback(() => {
    setCoApplicantSheetOpen(true);
  }, []);

  const onCoApplicantConfirm = useCallback(
    (includeCoApplicant: boolean) => {
      const next = createDefaultLoanApplicationState();
      next.includeCoApplicant = includeCoApplicant;
      next.coApplicant = includeCoApplicant ? createDefaultCoApplicantProfile() : null;
      writeLoanApplicationState(next);
      setCoApplicantSheetOpen(false);
      router.push(loanApplicationPath(bank.id, "loan-details"));
    },
    [bank.id, router],
  );

  const replies = useMemo(
    () => [{ label: "Start my loan application", onClick: onStartApplication, echo: null }],
    [onStartApplication],
  );

  return (
    <>
      <ConciergeTurnShell
        says={SAYS}
        afterLead={afterLead}
        headingLastLine
        artifact={<LoanDocumentsChecklistCard />}
        replies={replies}
        manageShowVehicleIdentification
      />

      <LoanApplicationCoApplicantBottomSheet
        open={coApplicantSheetOpen}
        onClose={() => setCoApplicantSheetOpen(false)}
        onConfirm={onCoApplicantConfirm}
      />
    </>
  );
}
