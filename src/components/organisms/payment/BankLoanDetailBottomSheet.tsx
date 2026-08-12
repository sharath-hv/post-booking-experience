"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import {
  formatBankRate,
  SHOW_PRE_APPROVED_LOAN_UI,
  type BankLoanTerms,
} from "@/components/organisms/payment/bank-loan-terms";
import { BottomSheetCloseIcon } from "@/components/atoms/BottomSheetCloseIcon";
import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
import { IconWell } from "@/components/molecules/IconWell";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { cn } from "@/utils/utils";

import styles from "./BankLoanDetailBottomSheet.module.scss";

type DetailSectionProps = {
  title: string;
  body: readonly string[];
  showDivider?: boolean;
};

/** Row layout mirrors the menu “Receipts and documents” list — body is one fact per bullet, not a paragraph to parse. */
function DetailSection({ title, body, showDivider = false }: DetailSectionProps) {
  return (
    <div className={cn(styles.sectionRow, showDivider && styles.sectionRowDivider)}>
      <div className={styles.sectionCopy}>
        <p className={styles.sectionTitle}>{title}</p>
        <ul className={styles.sectionList}>
          {body.map((point) => (
            <li key={point} className={styles.sectionBullet}>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type BankLoanDetailBottomSheetProps = {
  bank: BankLoanTerms | null;
  onClose: () => void;
  onConfirm: (bankId: string) => void;
};

/**
 * Bank detail — full loan terms, one bank at a time. Replaces the CX call
 * that used to walk customers through foreclosure and part-payment before
 * they'd commit. Only renders sections the bank actually has data for.
 */
export function BankLoanDetailBottomSheet({
  bank,
  onClose,
  onConfirm,
}: BankLoanDetailBottomSheetProps) {
  const open = bank != null;
  /** Keep last bank while sheet exits so slide-out still has content. */
  const [renderedBank, setRenderedBank] = useState<BankLoanTerms | null>(bank);

  if (bank != null && bank !== renderedBank) {
    setRenderedBank(bank);
  }

  const handleConfirm = useCallback(() => {
    if (renderedBank) onConfirm(renderedBank.id);
  }, [onConfirm, renderedBank]);

  if (!renderedBank) return null;

  const rateLabel =
    renderedBank.interestRate.type === "from"
      ? `From ${formatBankRate(renderedBank)}`
      : formatBankRate(renderedBank);

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      showCloseButton={false}
      aria-labelledby="bank-detail-sheet-title"
    >
      <div className={cn(styles.body, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
        <div className={styles.header}>
          <div className={styles.brand}>
            <IconWell as="div" size={52}>
              <Image
                src={renderedBank.logoSrc}
                alt=""
                width={32}
                height={32}
                className={styles.logo}
                unoptimized
              />
            </IconWell>
            <div className={styles.brandCopy}>
              {SHOW_PRE_APPROVED_LOAN_UI && renderedBank.preApproved ? (
                <span className={styles.preApprovedChip}>Pre-approved loan available for you</span>
              ) : null}
              <h2 id="bank-detail-sheet-title" className={styles.bankName}>
                {renderedBank.name}
              </h2>
              <p className={styles.rateLine}>{rateLabel}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(styles.closeBtn, "cta-ghost")}
            aria-label="Close"
          >
            <BottomSheetCloseIcon />
          </button>
        </div>

        <div className={styles.sections}>
          {(
            [
              renderedBank.rateTypeCopy
                ? {
                    title: "Interest rate",
                    body: renderedBank.rateTypeCopy,
                  }
                : null,
              renderedBank.foreclosure?.copy
                ? {
                    title: "Closing the loan early",
                    body: renderedBank.foreclosure.copy,
                  }
                : null,
              renderedBank.partPayment?.copy
                ? {
                    title: "Paying extra during the loan",
                    body: renderedBank.partPayment.copy,
                  }
                : null,
            ] as const
          )
            .filter(
              (
                section
              ): section is {
                title: string;
                body: readonly string[];
              } => section != null
            )
            .map((section, index) => (
              <DetailSection
                key={section.title}
                title={section.title}
                body={section.body}
                showDivider={index > 0}
              />
            ))}
          <p className={styles.bankDecisionNote}>
            <span className={styles.bankDecisionNoteLead}>Note:</span> The
            bank holds the final decision on your loan.
          </p>
        </div>
      </div>

      <div className={cn(styles.footer, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
        <button
          type="button"
          onClick={handleConfirm}
          className={cn(styles.confirmCta, "primary-cta")}
        >
          Continue with {renderedBank.name}
        </button>
      </div>
    </BottomSheetShell>
  );
}
