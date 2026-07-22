"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { AckoDriveBankPartnerRow } from "@/components/payment/AckoDriveBankPartnerRow";
import { LoanDocumentsChecklistCard } from "@/components/payment/LoanDocumentsChecklistCard";
import {
  ackoDriveFinanceActionPath,
  bankForQueryParam,
} from "@/components/payment/acko-drive-finance-bank";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import { loanApplicationEntryPath } from "@/lib/loan-application-urls";
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

  const uploadHref = useMemo(() => loanApplicationEntryPath(bank.id, { fresh: true }), [bank.id]);

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

  const replies = useMemo(
    () => [{ label: "Start my loan application", href: uploadHref }],
    [uploadHref],
  );

  return (
    <ConciergeTurnShell
      says={SAYS}
      afterLead={afterLead}
      headingLastLine
      artifact={<LoanDocumentsChecklistCard />}
      replies={replies}
      manageShowVehicleIdentification
    />
  );
}
