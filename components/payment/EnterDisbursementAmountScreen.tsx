"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";

import { ShiviCallSheet } from "@/components/concierge/ShiviCallSheet";
import { GetHelpPillButton } from "@/components/kyc/GetHelpPillButton";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import {
  MIN_LOAN_INR,
  ON_ROAD_PRICE_INR,
  SELF_FINANCE_LOAN_DEFAULT_INR,
  SLIDER_STEP,
} from "@/components/payment/loan-amount-demo-constants";
import { formatInrAmountDigits, parseInrAmountInput } from "@/lib/loan-emi";
import styles from "./EnterDisbursementAmountScreen.module.scss";



const STAGGER_TITLE_MS = 90;
const STAGGER_SUBTEXT_MS = 120;
const STAGGER_AMOUNT_MS = 220;
const STAGGER_SLIDER_MS = 320;

function formatInrLakhLabel(amount: number) {
  const lakhs = amount / 100_000;
  const n = lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1);
  return `₹${n} lakh`;
}

function clampDisbursementLoan(value: number) {
  const stepped = Math.round(value / SLIDER_STEP) * SLIDER_STEP;
  return Math.min(ON_ROAD_PRICE_INR, Math.max(MIN_LOAN_INR, stepped));
}

/**
 * Self finance — declare bank disbursement / loan amount (Figma 2616:72152).
 * Replaces {@link DisbursementAmountCollectionBottomSheet} on the action-step CTA.
 */
export function EnterDisbursementAmountScreen() {
  const router = useRouter();
  const [shiviSheetOpen, setShiviSheetOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(() =>
    clampDisbursementLoan(SELF_FINANCE_LOAN_DEFAULT_INR),
  );
  const [loanAmountInput, setLoanAmountInput] = useState(() =>
    formatInrAmountDigits(clampDisbursementLoan(SELF_FINANCE_LOAN_DEFAULT_INR)),
  );

  const applyLoanAmount = useCallback((amount: number) => {
    const clamped = clampDisbursementLoan(amount);
    setLoanAmount(clamped);
    setLoanAmountInput(formatInrAmountDigits(clamped));
  }, []);

  const onLoanAmountInputChange = useCallback((raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 0) {
      setLoanAmountInput("");
      return;
    }
    const parsed = parseInrAmountInput(raw);
    const capped = Math.min(ON_ROAD_PRICE_INR, parsed);
    setLoanAmountInput(formatInrAmountDigits(capped));
    if (capped >= MIN_LOAN_INR) {
      setLoanAmount(clampDisbursementLoan(capped));
    }
  }, []);

  const sliderSpan = ON_ROAD_PRICE_INR - MIN_LOAN_INR;
  const fillPct = sliderSpan > 0 ? ((loanAmount - MIN_LOAN_INR) / sliderSpan) * 100 : 0;

  const onLoanRangeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      applyLoanAmount(Number(e.target.value));
    },
    [applyLoanAmount],
  );

  const onLoanAmountBlur = useCallback(() => {
    const parsed = parseInrAmountInput(loanAmountInput);
    if (loanAmountInput === "" || parsed < MIN_LOAN_INR) {
      applyLoanAmount(parsed > 0 ? parsed : SELF_FINANCE_LOAN_DEFAULT_INR);
      return;
    }
    applyLoanAmount(parsed);
  }, [applyLoanAmount, loanAmountInput]);

  const navigateNext = useCallback(() => {
    router.push(`/payment/self-finance-loan-confirmed?loan_amount=${loanAmount}`);
  }, [loanAmount, router]);

  useEffect(() => {
    router.prefetch("/payment/self-finance-loan-confirmed");
  }, [router]);

  return (
    <div className={styles.min_h_dvh_0}>
      <KycTopNavHeader endSlot={<GetHelpPillButton onClick={() => setShiviSheetOpen(true)} />} />

      <main className={styles.mx_auto_1}>
        <h1
          id="enter-disbursement-amount-title"
          className={[styles.payment_success_stagger_2, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_TITLE_MS}ms` }}
        >
          What&apos;s the loan amount your bank approved?
        </h1>

        <p
          className={[styles.payment_success_stagger_3, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_SUBTEXT_MS}ms` }}
        >
          Just enter it here. I&apos;ll pass it on to the dealer so they know how much the bank is sending.
        </p>

        <div
          className={[styles.payment_success_stagger_4, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_AMOUNT_MS}ms` }}
        >
          <div className={styles.flex_5}>
            <label htmlFor="self-finance-loan-amount-input" className={styles.sr_only_6}>
              Loan amount in rupees
            </label>
            <span
              className={styles.shrink_0_7}
              aria-hidden
            >
              ₹{loanAmountInput.length > 0 ? "\u00a0" : ""}
            </span>
            <input
              id="self-finance-loan-amount-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={loanAmountInput}
              onChange={(e) => onLoanAmountInputChange(e.target.value)}
              onBlur={onLoanAmountBlur}
              className={styles.min_w_0_8}
            />
          </div>
        </div>

        <div
          className={[styles.payment_success_stagger_4, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_SLIDER_MS}ms` }}
        >
          <label className={styles.block_9} htmlFor="self-finance-loan-range">
            <input
              id="self-finance-loan-range"
              type="range"
              className={[styles.choose_loan_down_range_10, "choose-loan-down-range"].filter(Boolean).join(" ")}
              min={MIN_LOAN_INR}
              max={ON_ROAD_PRICE_INR}
              step={SLIDER_STEP}
              value={loanAmount}
              onChange={onLoanRangeChange}
              style={{
                background: `linear-gradient(to right, #121212 0%, #121212 ${fillPct}%, #e7e7e7 ${fillPct}%, #e7e7e7 100%)`,
              }}
            />
            <div className={styles.mt_2_11}>
              <span>{formatInrLakhLabel(MIN_LOAN_INR)}</span>
              <span className={styles.text_right_12}>{formatInrLakhLabel(ON_ROAD_PRICE_INR)}</span>
            </div>
          </label>
        </div>
      </main>

      <div className={[styles.fixed_13, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.footerInner}>
          <button
            type="button"
            onClick={navigateNext}
            className={[styles.primary_cta_14, "primary-cta"].filter(Boolean).join(" ")}
          >
            Confirm loan amount
          </button>
        </div>
      </div>

      <ShiviCallSheet open={shiviSheetOpen} onClose={() => setShiviSheetOpen(false)} />
    </div>
  );
}
