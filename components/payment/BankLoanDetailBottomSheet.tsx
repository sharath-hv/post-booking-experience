"use client";

import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

import calendarIcon from "@/assets/Calender.svg";
import moneyIcon from "@/assets/money.svg";
import moneyRoundIcon from "@/assets/Money round.svg";
import {
  formatBankRate,
  type BankLoanTerms,
} from "@/components/payment/bank-loan-terms";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import styles from "./BankLoanDetailBottomSheet.module.scss";

/** Enter/exit slide duration — parity with the rest of the payment sheet family. */
const SHEET_TRANSITION_MS = 280;

type DetailSectionProps = {
  title: string;
  body: string;
  icon: StaticImageData;
  showDivider?: boolean;
};

/** Row layout mirrors the menu “Receipts and documents” list. */
function DetailSection({ title, body, icon, showDivider = false }: DetailSectionProps) {
  return (
    <div className={cn(styles.sectionRow, showDivider && styles.sectionRowDivider)}>
      <span className={styles.sectionIcon} aria-hidden>
        <Image
          src={icon}
          alt=""
          width={20}
          height={20}
          className={styles.sectionIconAsset}
          unoptimized
        />
      </span>
      <div className={styles.sectionCopy}>
        <p className={styles.sectionTitle}>{title}</p>
        <p className={styles.sectionBody}>{body}</p>
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
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [renderedBank, setRenderedBank] = useState<BankLoanTerms | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = bank != null;

  useEffect(() => {
    if (!open) return;
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setRenderedBank(bank);
    setMounted(true);
    setAnimateIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open, bank]);

  useEffect(() => {
    if (open || !mounted) return;
    setAnimateIn(false);
    exitTimeoutRef.current = setTimeout(() => {
      exitTimeoutRef.current = null;
      setMounted(false);
    }, SHEET_TRANSITION_MS);
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  const handleConfirm = useCallback(() => {
    if (renderedBank) onConfirm(renderedBank.id);
  }, [onConfirm, renderedBank]);

  if (!mounted || !renderedBank) return null;

  const rateLabel =
    renderedBank.interestRate.type === "from"
      ? `From ${formatBankRate(renderedBank)}`
      : formatBankRate(renderedBank);

  return (
    <div className={cn(styles.overlay, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
      <button
        type="button"
        className={cn(styles.scrim, animateIn ? styles.scrimVisible : styles.scrimHidden)}
        onClick={onClose}
        aria-label="Dismiss"
      />
      <div
        className={cn(
          styles.panel,
          BOTTOM_SHEET_MAX_HEIGHT_CLASS,
          "sheet-elevated",
          animateIn ? styles.panelShown : styles.panelHidden
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-detail-sheet-title"
      >
        <div className={styles.panelInner}>
          <div className={cn(styles.body, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
            <div className={styles.header}>
              <div className={styles.brand}>
                <div className={styles.logoFrame}>
                  <Image
                    src={renderedBank.logoSrc}
                    alt=""
                    fill
                    className={styles.logo}
                    unoptimized
                    sizes="48px"
                  />
                </div>
                <div className={styles.brandCopy}>
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
                        icon: moneyRoundIcon,
                      }
                    : null,
                  renderedBank.foreclosure?.copy
                    ? {
                        title: "Closing the loan early",
                        body: renderedBank.foreclosure.copy,
                        icon: calendarIcon,
                      }
                    : null,
                  renderedBank.partPayment?.copy
                    ? {
                        title: "Paying extra during the loan",
                        body: renderedBank.partPayment.copy,
                        icon: moneyIcon,
                      }
                    : null,
                ] as const
              )
                .filter(
                  (
                    section
                  ): section is {
                    title: string;
                    body: string;
                    icon: StaticImageData;
                  } => section != null
                )
                .map((section, index) => (
                  <DetailSection
                    key={section.title}
                    title={section.title}
                    body={section.body}
                    icon={section.icon}
                    showDivider={index > 0}
                  />
                ))}
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
        </div>
      </div>
    </div>
  );
}
