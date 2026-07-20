"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { MIN_DOWN_PAYMENT_INR, ON_ROAD_PRICE_INR } from "@/components/payment/loan-amount-demo-constants";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/components/ui/bottom-sheet-title-layout";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import styles from "./DisbursementAmountCollectionBottomSheet.module.scss";


/** Parity with `SelfFinanceConfirmBottomSheet` / `BankLoanDetailBottomSheet`. */
const SHEET_TRANSITION_MS = 280;

const MAX_DISBURSEMENT_INR = ON_ROAD_PRICE_INR - MIN_DOWN_PAYMENT_INR;

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Whole rupees only; cap at demo max — no step rounding. */
function capDisbursementInr(value: number) {
  return Math.min(MAX_DISBURSEMENT_INR, Math.max(0, value));
}

/** Caret position after the `n`th digit in a formatted currency string (`n` = count of digits to the left of caret). */
function indexAfterNthDigit(formatted: string, n: number): number {
  if (n <= 0) return 0;
  let digitCount = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i]!)) {
      digitCount += 1;
      if (digitCount === n) return i + 1;
    }
  }
  return formatted.length;
}

const DEFAULT_SHEET_TITLE = "Enter your disbursement amount";
const DEFAULT_PRIMARY_CTA_LABEL = "Calculate my down payment";

type DisbursementAmountCollectionBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Called with the entered disbursement amount in whole rupees when the user continues. */
  onSubmitAmount: (disbursementAmountInr: number) => void;
  /** Overrides default sheet headline. */
  title?: string;
  /** Overrides primary button label. */
  primaryCtaLabel?: string;
  /** Prefill the amount field when the sheet opens (whole rupees). */
  initialDisbursementInr?: number | null;
};

/**
 * Bottom sheet to collect the bank-approved disbursement amount before down-payment calculation.
 */
export function DisbursementAmountCollectionBottomSheet({
  open,
  onClose,
  onSubmitAmount,
  title = DEFAULT_SHEET_TITLE,
  primaryCtaLabel = DEFAULT_PRIMARY_CTA_LABEL,
  initialDisbursementInr = null,
}: DisbursementAmountCollectionBottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  /** Digit-only buffer (no grouping); display is always formatted when non-empty. */
  const [amountDigits, setAmountDigits] = useState("");
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  /** Count of digits to the left of caret after last edit (for caret restore after format). */
  const pendingCaretDigitCountRef = useRef<number | null>(null);

  /** Mount + slide-up (`translate-y`) — keep deps to `open` only so prefill updates never reset animation. */
  useEffect(() => {
    if (!open) return;
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setMounted(true);
    setAnimateIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  /** Prefill / sync digits when opening or when `initialDisbursementInr` changes while open. */
  useEffect(() => {
    if (!open) return;
    const prefill =
      initialDisbursementInr != null &&
      Number.isFinite(initialDisbursementInr) &&
      initialDisbursementInr > 0
        ? String(capDisbursementInr(Math.trunc(initialDisbursementInr)))
        : "";
    setAmountDigits(prefill);
    pendingCaretDigitCountRef.current = null;
  }, [open, initialDisbursementInr]);

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

  const onAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const raw = el.value.replace(/\D/g, "");
    let nextDigits = raw;
    if (nextDigits !== "") {
      const n = Number(nextDigits);
      if (Number.isFinite(n) && n > MAX_DISBURSEMENT_INR) {
        nextDigits = String(MAX_DISBURSEMENT_INR);
      }
    }
    const digitCountLeftOfCaret = el.value.slice(0, el.selectionStart ?? 0).replace(/\D/g, "").length;
    pendingCaretDigitCountRef.current = digitCountLeftOfCaret;
    setAmountDigits(nextDigits);
  }, []);

  const disbursementAmountInr =
    amountDigits === "" ? 0 : capDisbursementInr(Number(amountDigits));

  const amountInputDisplayValue = amountDigits === "" ? "" : formatInr(disbursementAmountInr);

  useLayoutEffect(() => {
    const el = amountInputRef.current;
    const n = pendingCaretDigitCountRef.current;
    if (el == null || n === null || document.activeElement !== el) return;
    pendingCaretDigitCountRef.current = null;
    const display = amountInputDisplayValue;
    const digitTarget = Math.min(n, (display.match(/\d/g) ?? []).length);
    const pos = indexAfterNthDigit(display, digitTarget);
    el.setSelectionRange(pos, pos);
  }, [amountInputDisplayValue, amountDigits]);

  const handlePrimaryCta = useCallback(() => {
    if (disbursementAmountInr <= 0) return;
    onSubmitAmount(disbursementAmountInr);
  }, [disbursementAmountInr, onSubmitAmount]);

  const primaryCtaDisabled = disbursementAmountInr <= 0;

  if (!mounted) return null;

  return (
    <div className={cn(styles.fixed_0, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
      <button
        type="button"
        className={cn(styles.absolute_1, animateIn ? styles.opacity_100_1 : styles.opacity_0_1)}
        onClick={onClose}
        aria-label="Dismiss"
      />
      <div
        className={cn(styles.absolute_2, BOTTOM_SHEET_MAX_HEIGHT_CLASS, styles.w_full_2, "sheet-elevated", animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="disbursement-collection-title"
        aria-describedby="disbursement-collection-body disbursement-amount-field-hint"
      >
        <div className={styles.relative_0}>
          <button
            type="button"
            onClick={onClose}
            className={[styles.cta_ghost_1, "cta-ghost"].filter(Boolean).join(" ")}
            aria-label="Close"
          >
            <BottomSheetCloseIcon />
          </button>

          <div className={cn(styles.min_h_0_3, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
            <div className={styles.relative_2} aria-hidden>
              <Image
                src={PAYMENT_CHOOSE_ASSETS.sanctionedAmount}
                alt=""
                width={72}
                height={72}
                className={styles.h_72px__3}
                unoptimized
                sizes="72px"
              />
            </div>
            <h2
              id="disbursement-collection-title"
              className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
            >
              {title}
            </h2>
            <p
              id="disbursement-collection-body"
              className={styles.mt_3_4}
            >
              This is the loan amount your bank will transfer to the dealer. It&apos;s usually your
              sanctioned amount minus any processing fees.
            </p>

            <p id="disbursement-amount-field-hint" className={styles.sr_only_5}>
              Type digits only; amount is shown in Indian Rupees.
            </p>
            <div className={styles.mt_6_6}>
              <label htmlFor="disbursement-amount-input" className={styles.sr_only_5}>
                Disbursement amount in rupees
              </label>
              <div className={styles.flex_7}>
                <input
                  ref={amountInputRef}
                  id="disbursement-amount-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={amountInputDisplayValue}
                  onChange={onAmountChange}
                  placeholder="Enter the amount"
                  aria-describedby="disbursement-amount-field-hint"
                  className={styles.min_w_0_8}
                />
              </div>
            </div>
          </div>

          <div
            className={cn(styles.shrink_0_5, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}
          >
            <button
              type="button"
              onClick={handlePrimaryCta}
              disabled={primaryCtaDisabled}
              className={[styles.primary_cta_9, "primary-cta"].filter(Boolean).join(" ")}
            >
              {primaryCtaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
