"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";

import { FULL_PAYMENT_INSURANCE_INR } from "@/components/payment/loan-amount-demo-constants";
import styles from "./page.module.scss";

import {
  BOOKING_AMOUNT_QUERY,
  BOOKING_LOCK_AMOUNT_INR,
  buildBookingLockSuccessHref,
  buildDownPaymentSuccessHref,
  buildInsurancePremiumSuccessHref,
  FULL_PAYMENT_BANK_ID,
  INSURANCE_PAYMENT_KIND,
} from "@/lib/paymentUrls";

/** No artificial delay before navigation to the dedicated success page. */
const PROCESSING_MS = 0;

type Phase = "checkout" | "processing";

const PAYMENT_LEDGER_STORAGE_KEY = "pbe_down_payment_ledger_v1";

/** Minimum amount (₹) user can pay in one instalment on the mock checkout. */
const MIN_PAYMENT_INR = 1;

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function parseDownPaymentTotalFromSearchParams(searchParams: URLSearchParams): number {
  const raw = searchParams.get("down_payment");
  const n = raw != null && raw !== "" ? Number(raw) : NaN;
  if (Number.isFinite(n) && n > 0) return Math.round(n);
  return BOOKING_LOCK_AMOUNT_INR;
}

function parseBookingLockAmountFromSearchParams(searchParams: URLSearchParams): number {
  const raw = searchParams.get(BOOKING_AMOUNT_QUERY);
  const n = raw != null && raw !== "" ? Number(raw) : NaN;
  if (Number.isFinite(n) && n > 0) return Math.round(n);
  return BOOKING_LOCK_AMOUNT_INR;
}

function readStoredRemaining(totalDue: number, bank: string | null): number {
  if (typeof window === "undefined") return totalDue;
  try {
    const raw = sessionStorage.getItem(PAYMENT_LEDGER_STORAGE_KEY);
    if (!raw) return totalDue;
    const parsed = JSON.parse(raw) as {
      bank?: string | null;
      totalDue?: number;
      remaining?: number;
    };
    const storedBank = parsed.bank ?? null;
    if (storedBank !== bank || parsed.totalDue !== totalDue) return totalDue;
    const r = Number(parsed.remaining);
    if (!Number.isFinite(r)) return totalDue;
    const clamped = Math.min(totalDue, Math.max(0, Math.round(r)));
    /**
     * After a full pay-down, we clear storage on success — but older sessions (or manual
     * navigation back) may still have `remaining: 0`. Treat that as stale so the mock
     * checkout can be used again; otherwise the amount field stays disabled.
     */
    if (clamped === 0 && totalDue > 0) {
      sessionStorage.removeItem(PAYMENT_LEDGER_STORAGE_KEY);
      return totalDue;
    }
    return clamped;
  } catch {
    return totalDue;
  }
}

function writeStoredRemaining(
  totalDue: number,
  remaining: number,
  bank: string | null,
): void {
  if (typeof window === "undefined") return;
  try {
    if (remaining <= 0) {
      sessionStorage.removeItem(PAYMENT_LEDGER_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(
      PAYMENT_LEDGER_STORAGE_KEY,
      JSON.stringify({ bank, totalDue, remaining }),
    );
  } catch {
    /* ignore quota / private mode */
  }
}

/** Digits only; empty → NaN. */
function parseInrInputDigits(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (digits === "") return NaN;
  const n = Number(digits);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Mock Razorpay-style checkout for demos only — not connected to Razorpay APIs.
 * Pay → loader → dedicated success route (`/kyc/booking-confirmed?source=payment` or `/payment/down-payment-success`).
 * Booking flow: `/payment` (no `down_payment`) — booking lock, read-only; optional `?booking_amount=` (modify-selection).
 * Down payment flow: `?down_payment=` (e.g. from pay-down-payment) — editable amount / instalments (demo).
 * Insurance premium: `?payment_kind=insurance` — fixed insurance amount (read-only).
 */
function MockRazorpayPaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingSuccessHref = useRef<string | null>(null);

  const checkoutMeta = useMemo(() => {
    const raw = searchParams.get("down_payment");
    const n = raw != null && raw !== "" ? Number(raw) : NaN;
    const hasDownPaymentParam = Number.isFinite(n) && n > 0;
    const due = hasDownPaymentParam
      ? parseDownPaymentTotalFromSearchParams(searchParams)
      : BOOKING_LOCK_AMOUNT_INR;
    const origRaw = searchParams.get("original_down_payment");
    const origN = origRaw != null && origRaw !== "" ? Number(origRaw) : NaN;
    const originalDownPayment =
      hasDownPaymentParam && Number.isFinite(origN) && origN > 0 ? Math.round(origN) : due;
    const isFullPayment = searchParams.get("bank") === FULL_PAYMENT_BANK_ID;
    const isInsurancePayment =
      searchParams.get("payment_kind") === INSURANCE_PAYMENT_KIND;
    const insuranceDue = isInsurancePayment && hasDownPaymentParam ? due : FULL_PAYMENT_INSURANCE_INR;
    const isBookingLockCheckout = !hasDownPaymentParam && !isInsurancePayment;
    const bookingLockDue = isBookingLockCheckout
      ? parseBookingLockAmountFromSearchParams(searchParams)
      : BOOKING_LOCK_AMOUNT_INR;
    const returnSource = searchParams.get("return_source");
    return {
      totalDue: isInsurancePayment ? insuranceDue : due,
      originalDownPayment: isInsurancePayment ? insuranceDue : originalDownPayment,
      checkoutSubtitle: isInsurancePayment
        ? "Insurance premium · incl. applicable taxes"
        : hasDownPaymentParam
          ? isFullPayment
            ? "Full payment · incl. applicable taxes"
            : "Down payment · incl. applicable taxes"
          : "Booking amount · incl. applicable taxes",
      isDownPaymentFromUrl: hasDownPaymentParam,
      isBookingLockCheckout,
      bookingLockDue,
      returnSource,
      isFullPayment,
      isInsurancePayment,
    };
  }, [searchParams]);

  const {
    totalDue,
    originalDownPayment,
    checkoutSubtitle,
    isDownPaymentFromUrl,
    isBookingLockCheckout,
    bookingLockDue,
    returnSource,
    isFullPayment,
    isInsurancePayment,
  } = checkoutMeta;

  const paymentBank = searchParams.get("bank");

  const [remainingDue, setRemainingDue] = useState(totalDue);
  const [amountInput, setAmountInput] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("checkout");

  useEffect(() => {
    if (!isDownPaymentFromUrl || isInsurancePayment) return;
    setRemainingDue(readStoredRemaining(totalDue, paymentBank));
  }, [totalDue, isDownPaymentFromUrl, isInsurancePayment, paymentBank]);

  useEffect(() => {
    if (!isDownPaymentFromUrl || phase !== "checkout") return;
    setAmountInput(isInsurancePayment ? String(totalDue) : String(remainingDue));
    setCheckoutError(null);
  }, [remainingDue, phase, isDownPaymentFromUrl, isInsurancePayment, totalDue]);

  const parsedPayAmount = useMemo(
    () => parseInrInputDigits(amountInput),
    [amountInput],
  );

  const isPayAmountValid = useMemo(() => {
    if (isInsurancePayment) return true;
    if (!isDownPaymentFromUrl) return true;
    if (remainingDue <= 0) return false;
    if (!Number.isFinite(parsedPayAmount)) return false;
    if (parsedPayAmount < MIN_PAYMENT_INR) return false;
    if (parsedPayAmount > remainingDue) return false;
    return true;
  }, [isDownPaymentFromUrl, isInsurancePayment, parsedPayAmount, remainingDue]);

  useEffect(() => {
    if (!isInsurancePayment) return;
    setRemainingDue(totalDue);
  }, [isInsurancePayment, totalDue]);

  useEffect(() => {
    if (phase !== "processing") return;
    const href = pendingSuccessHref.current;
    if (href == null) return;
    const id = window.setTimeout(() => {
      router.push(href);
      pendingSuccessHref.current = null;
    }, PROCESSING_MS);
    return () => window.clearTimeout(id);
  }, [phase, router]);

  const handleAmountInputChange = useCallback((raw: string) => {
    setCheckoutError(null);
    const digits = raw.replace(/\D/g, "");
    setAmountInput(digits);
  }, []);

  const handlePayFullChip = useCallback(() => {
    setCheckoutError(null);
    setAmountInput(String(remainingDue));
  }, [remainingDue]);

  const handlePayHalfChip = useCallback(() => {
    setCheckoutError(null);
    const half = Math.max(MIN_PAYMENT_INR, Math.floor(remainingDue / 2));
    setAmountInput(String(Math.min(half, remainingDue)));
  }, [remainingDue]);

  const handlePay = useCallback(() => {
    if (!isDownPaymentFromUrl) {
      setCheckoutError(null);
      pendingSuccessHref.current = buildBookingLockSuccessHref(bookingLockDue, {
        returnSource: returnSource ?? undefined,
      });
      if (PROCESSING_MS <= 0) {
        router.push(pendingSuccessHref.current);
        return;
      }
      setPhase("processing");
      return;
    }

    setCheckoutError(null);

    if (isInsurancePayment) {
      pendingSuccessHref.current = buildInsurancePremiumSuccessHref(totalDue, {
        bank: searchParams.get("bank"),
        loanAmount: searchParams.get("loan_amount"),
        tenure: searchParams.get("tenure"),
      });
      if (PROCESSING_MS <= 0) {
        router.push(pendingSuccessHref.current);
        return;
      }
      setPhase("processing");
      return;
    }

    const n = parseInrInputDigits(amountInput);
    if (!Number.isFinite(n)) {
      setCheckoutError("Enter a valid amount.");
      return;
    }
    if (n < MIN_PAYMENT_INR) {
      setCheckoutError(`Minimum payment is ${formatInr(MIN_PAYMENT_INR)}.`);
      return;
    }
    if (n > remainingDue) {
      setCheckoutError(`You can pay up to ${formatInr(remainingDue)} this time.`);
      return;
    }
    const remainingAfter = Math.max(0, remainingDue - n);
    writeStoredRemaining(totalDue, remainingAfter, paymentBank);
    setRemainingDue(remainingAfter);
    pendingSuccessHref.current = buildDownPaymentSuccessHref({
      bank: searchParams.get("bank"),
      loanAmount: searchParams.get("loan_amount"),
      originalDownPaymentInr: originalDownPayment,
      paidThisInstalment: n,
      remainingAfter,
    });
    if (PROCESSING_MS <= 0) {
      router.push(pendingSuccessHref.current);
      return;
    }
    setPhase("processing");
  }, [
    amountInput,
    bookingLockDue,
    isDownPaymentFromUrl,
    isInsurancePayment,
    originalDownPayment,
    paymentBank,
    remainingDue,
    returnSource,
    router,
    searchParams,
    totalDue,
  ]);

  if (phase === "processing") {
    return (
      <div className={styles.fixed_0}>
          <div
            className={styles.h_12_1}
            aria-hidden
          />
          <p className={styles.mt_6_2}>Processing payment…</p>
          <p className={styles.mt_1_3}>Please do not close this screen</p>
        </div>
    );
  }

  return (
    <div className={styles.min_h_dvh_4}>
        <KycTopNavHeader title="Checkout" />

        <main className={styles.mx_auto_5}>
        <div className={[styles.overflow_hidden_6, "card-elevated"].filter(Boolean).join(" ")}>
          <div className={styles.border_b_7}>
            <div className={styles.flex_8}>
              <div>
                <p className={styles.text_xs_9}>
                  Pay using Razorpay
                </p>
                <p className={styles.mt_1_10}>ACKO Drive</p>
              </div>
              <div
                className={styles.flex_11}
                style={{ background: "linear-gradient(135deg, #3395ff 0%, #0b6bcb 100%)" }}
                aria-hidden
              >
                R
              </div>
            </div>
          </div>

          <div className={styles.px_4_12}>
            {isInsurancePayment ? (
              <>
                <p className={styles.text_center_13}>Insurance premium</p>
                <p className={styles.mt_1_14}>
                  {formatInr(FULL_PAYMENT_INSURANCE_INR)}
                </p>
                <p className={styles.mt_2_15}>{checkoutSubtitle}</p>
              </>
            ) : isDownPaymentFromUrl ? (
              <>
                <p className={styles.text_center_13}>Amount to pay now</p>
                <div className={styles.mt_2_16}>
                  <label htmlFor="checkout-pay-amount" className={styles.sr_only_17}>
                    Amount to pay now in rupees
                  </label>
                  <div className={styles.flex_18}>
                    <span className={styles.text_2xl_19} aria-hidden>
                      ₹
                    </span>
                    <input
                      id="checkout-pay-amount"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={amountInput}
                      onChange={(e) => handleAmountInputChange(e.target.value)}
                      disabled={remainingDue <= 0}
                      className={styles.w_min_100_12rem__20}
                      placeholder="0"
                      aria-invalid={checkoutError != null}
                      aria-describedby={checkoutError ? "checkout-pay-error" : "checkout-pay-hint"}
                    />
                  </div>
                </div>
                {checkoutError ? (
                  <p
                    id="checkout-pay-error"
                    role="alert"
                    className={styles.mt_2_21}
                  >
                    {checkoutError}
                  </p>
                ) : (
                  <p id="checkout-pay-hint" className={styles.mt_2_15}>
                    {remainingDue <= 0
                      ? "Nothing left to pay for this total."
                      : `Between ${formatInr(MIN_PAYMENT_INR)} and ${formatInr(remainingDue)}.`}
                  </p>
                )}
                <p className={styles.mt_3_22}>{checkoutSubtitle}</p>
                <div className={styles.mt_3_23}>
                  <span>
                    {isFullPayment ? "Full amount due" : "Down payment (plan)"}{" "}
                    {formatInr(originalDownPayment)}
                  </span>
                  {remainingDue < originalDownPayment ? (
                    <>
                      <span aria-hidden className={styles.text_d1d5db__24}>
                        ·
                      </span>
                      <span>Remaining {formatInr(remainingDue)}</span>
                    </>
                  ) : null}
                </div>
                {remainingDue > MIN_PAYMENT_INR ? (
                  <div className={styles.mt_4_25}>
                    <button
                      type="button"
                      onClick={handlePayFullChip}
                      className={styles.rounded_full_26}
                    >
                      Pay full ({formatInr(remainingDue)})
                    </button>
                    <button
                      type="button"
                      onClick={handlePayHalfChip}
                      className={styles.rounded_full_26}
                    >
                      Pay half
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <p className={styles.text_center_13}>Amount payable</p>
                <p className={styles.mt_1_14}>
                  {formatInr(isBookingLockCheckout ? bookingLockDue : BOOKING_LOCK_AMOUNT_INR)}
                </p>
                <p className={styles.mt_2_15}>{checkoutSubtitle}</p>
              </>
            )}
          </div>

          <div className={styles.border_t_27}>
            <p className={styles.text_xs_28}>Payment method</p>
            <div className={styles.mt_3_29}>
              {(["Card", "UPI", "Netbanking"] as const).map((label, i) => (
                <span
                  key={label}
                  className={cn(styles.rounded_lg_0, i === 0 ? styles.border_3395ff__0 : styles.border_e6e8eb__0)}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className={styles.mt_4_30}>
              Card form (static mock)
            </div>
          </div>
        </div>

        <p className={styles.mt_6_31}>
          This is a non-functional demo screen. No payment is processed.
        </p>
      </main>

      <div className={[styles.fixed_32, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_33}>
          <button
            type="button"
            onClick={handlePay}
            disabled={!isPayAmountValid}
            className={[styles.primary_cta_34, "primary-cta"].filter(Boolean).join(" ")}
          >
            {isInsurancePayment
              ? `Pay ${formatInr(FULL_PAYMENT_INSURANCE_INR)}`
              : isDownPaymentFromUrl &&
                  isPayAmountValid &&
                  Number.isFinite(parsedPayAmount)
                ? `Pay ${formatInr(parsedPayAmount)}`
                : isBookingLockCheckout
                  ? `Pay ${formatInr(bookingLockDue)}`
                  : "Pay"}
          </button>
        </div>
      </div>
      </div>
  );
}

export default function MockRazorpayPaymentPage() {
  return (
    <Suspense fallback={null}>
      <MockRazorpayPaymentPageContent />
    </Suspense>
  );
}
