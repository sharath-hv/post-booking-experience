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
    <div className="min-h-dvh bg-white font-sans">
      <KycTopNavHeader endSlot={<GetHelpPillButton onClick={() => setShiviSheetOpen(true)} />} />

      <main className="mx-auto w-full max-w-[640px] px-5 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2">
        <h1
          id="enter-disbursement-amount-title"
          className="payment-success-stagger text-2xl font-semibold leading-8 tracking-[-0.1px] text-[#121212]"
          style={{ animationDelay: `${STAGGER_TITLE_MS}ms` }}
        >
          What&apos;s the loan amount your bank approved?
        </h1>

        <p
          className="payment-success-stagger mt-4 text-sm font-normal leading-5 text-[#4b4b4b]"
          style={{ animationDelay: `${STAGGER_SUBTEXT_MS}ms` }}
        >
          Just enter it here. I&apos;ll pass it on to the dealer so they know how much the bank is sending.
        </p>

        <div
          className="payment-success-stagger mt-8"
          style={{ animationDelay: `${STAGGER_AMOUNT_MS}ms` }}
        >
          <div className="flex h-12 min-h-12 w-[174px] max-w-full shrink-0 items-center rounded-lg border border-[#e8e8e8] bg-white px-4">
            <label htmlFor="self-finance-loan-amount-input" className="sr-only">
              Loan amount in rupees
            </label>
            <span
              className="shrink-0 text-base font-medium leading-6 text-[#040222]"
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
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-medium leading-6 text-[#040222] outline-none focus:ring-0 tabular-nums"
            />
          </div>
        </div>

        <div
          className="payment-success-stagger mt-8"
          style={{ animationDelay: `${STAGGER_SLIDER_MS}ms` }}
        >
          <label className="block" htmlFor="self-finance-loan-range">
            <input
              id="self-finance-loan-range"
              type="range"
              className="choose-loan-down-range h-2 w-full cursor-pointer rounded-full"
              min={MIN_LOAN_INR}
              max={ON_ROAD_PRICE_INR}
              step={SLIDER_STEP}
              value={loanAmount}
              onChange={onLoanRangeChange}
              style={{
                background: `linear-gradient(to right, #121212 0%, #121212 ${fillPct}%, #e7e7e7 ${fillPct}%, #e7e7e7 100%)`,
              }}
            />
            <div className="mt-2 flex justify-between text-xs leading-[18px] text-[#4b4b4b]">
              <span>{formatInrLakhLabel(MIN_LOAN_INR)}</span>
              <span className="text-right">{formatInrLakhLabel(ON_ROAD_PRICE_INR)}</span>
            </div>
          </label>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-[640px] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
        <button type="button" onClick={navigateNext} className="primary-cta w-full">
          Confirm loan amount
        </button>
      </div>

      <ShiviCallSheet open={shiviSheetOpen} onClose={() => setShiviSheetOpen(false)} />
    </div>
  );
}
