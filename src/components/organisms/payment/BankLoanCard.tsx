"use client";

import { BankOptionsCard } from "@/components/molecules/card/BankOptionsCard";
import {
  bankLockInSummary,
  formatBankRate,
  SHOW_PRE_APPROVED_LOAN_UI,
  type BankLoanTerms,
} from "@/components/organisms/payment/bank-loan-terms";

type BankLoanCardProps = {
  bank: BankLoanTerms;
  onOpen: () => void;
};

/**
 * Bank selection full page — collapsed card (Figma follow-up to 1941:12822).
 * Know: which banks are available, enough to shortlist 2-3.
 * Do: tap in for full terms.
 */
export function BankLoanCard({ bank, onOpen }: BankLoanCardProps) {
  const lockInSummary = bankLockInSummary(bank);
  const showPreApproved = SHOW_PRE_APPROVED_LOAN_UI && Boolean(bank.preApproved);

  return (
    <BankOptionsCard
      name={bank.name}
      logo={bank.logoSrc}
      rateLabel={formatBankRate(bank)}
      rateType={bank.rateType ?? undefined}
      lockInSummary={lockInSummary ?? undefined}
      preApproved={showPreApproved}
      onSelect={onOpen}
    />
  );
}
