"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import chevronRightIcon from "@/assets/Chevron_right.svg";
import editIcon from "@/assets/Edit.svg";
import tickIcon from "@/assets/tick.svg";

import { GetHelpPillButton } from "@/components/kyc/GetHelpPillButton";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import {
  ACKO_DRIVE_DISCOUNT_INR,
  MIN_DOWN_PAYMENT_INR,
  ON_ROAD_LIST_PRICE_INR,
  ON_ROAD_PRICE_INR,
  SLIDER_STEP,
} from "@/components/payment/loan-amount-demo-constants";
import { DisbursementAmountCollectionBottomSheet } from "@/components/payment/DisbursementAmountCollectionBottomSheet";
import { BOOKING_LOCK_AMOUNT_INR, buildDownPaymentCheckoutHref } from "@/lib/paymentUrls";
import styles from "./EnterSanctionedLoanAmountScreen.module.scss";


/** Carried on `/payment/pay-down-payment` → `/payment` so the chain matches ACKO finance `?bank=` wiring. */
const SELF_FINANCE_BANK_QUERY = "self_finance";

const STAGGER_TITLE_MS = 90;
const STAGGER_CARD_MS = 180;
const STAGGER_INFO_MS = 300;

/** Insurance portion of down payment — Figma 2331:10371. */
const DOWN_PAYMENT_INSURANCE_INR = 37_000;
/** Due date copy for car down payment line — same frame. */
const CAR_DOWN_PAYMENT_DUE_LABEL = "24 Apr 2026";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatInrSignedNegative(amount: number) {
  const abs = Math.abs(amount);
  const formatted = formatInr(abs);
  return amount < 0 ? `-${formatted}` : formatted;
}

const MAX_LOAN_INR = ON_ROAD_PRICE_INR - MIN_DOWN_PAYMENT_INR;

function clampLoanAmount(value: number) {
  const stepped = Math.round(value / SLIDER_STEP) * SLIDER_STEP;
  return Math.min(MAX_LOAN_INR, Math.max(0, stepped));
}

/**
 * Down payment details — Figma [2331:10371](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2331-10371).
 * Loan disbursement edit uses {@link DisbursementAmountCollectionBottomSheet}; icons from `assets/`.
 */
export function EnterSanctionedLoanAmountScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loanAmount, setLoanAmount] = useState(() =>
    clampLoanAmount(ON_ROAD_PRICE_INR - 300_000),
  );
  const [disbursementEditOpen, setDisbursementEditOpen] = useState(false);
  const [carPriceExpanded, setCarPriceExpanded] = useState(true);

  /** Payable after booking + loan (Figma “Down payment amount”). */
  const totalDownPaymentInr = ON_ROAD_PRICE_INR - loanAmount - BOOKING_LOCK_AMOUNT_INR;
  const carDownPaymentPortionInr = Math.max(0, totalDownPaymentInr - DOWN_PAYMENT_INSURANCE_INR);

  /** Straight to checkout — this screen already shows the full split. */
  const navigateToPayment = useCallback(() => {
    // Net cash due now — the price identity already excludes booking amount + insurance.
    router.push(
      buildDownPaymentCheckoutHref(
        SELF_FINANCE_BANK_QUERY,
        String(loanAmount),
        carDownPaymentPortionInr,
      ),
    );
  }, [router, loanAmount, carDownPaymentPortionInr]);

  useEffect(() => {
    router.prefetch("/payment");
  }, [router]);

  const disbursementPrefill = searchParams.get("disbursement_inr");

  useEffect(() => {
    if (!disbursementPrefill) return;
    const n = Number(disbursementPrefill);
    if (!Number.isFinite(n) || n <= 0) return;
    setLoanAmount(clampLoanAmount(n));
  }, [disbursementPrefill]);

  return (
    <div className={styles.flex_0}>
      <KycTopNavHeader endSlot={<GetHelpPillButton />} />

      <main className={styles.mx_auto_1}>
        <h1
          id="enter-sanctioned-loan-title"
          className={[styles.payment_success_stagger_2, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_TITLE_MS}ms` }}
        >
          Your down payment details
        </h1>

        <div
          className={[styles.payment_success_stagger_3, "payment-success-stagger", "card-elevated"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_CARD_MS}ms` }}
        >
          <div className={styles.bg_white_4}>
            <button
              type="button"
              onClick={() => setCarPriceExpanded((v) => !v)}
              className={styles.flex_5}
              aria-expanded={carPriceExpanded}
            >
              <span className={styles.inline_flex_6}>
                <span className={styles.w_fit_7}>
                  ACKO Drive car price
                </span>
                <span className={styles.relative_8} aria-hidden>
                  <Image
                    src={chevronRightIcon}
                    alt=""
                    width={16}
                    height={16}
                    className={cn(styles.size_4_0, carPriceExpanded ? styles._rotate_90_0 : styles.rotate_90_0)}
                    unoptimized
                  />
                </span>
              </span>
              <span className={styles.shrink_0_9}>
                {formatInr(ON_ROAD_PRICE_INR)}
              </span>
            </button>

            {carPriceExpanded ? (
              <div className={styles.mt_2_10}>
                <div className={styles.flex_11}>
                  <span className={styles.text_4b4b4b__12}>On-road price</span>
                  <span className={styles.shrink_0_13}>
                    {formatInr(ON_ROAD_LIST_PRICE_INR)}
                  </span>
                </div>
                <div className={styles.flex_11}>
                  <span className={styles.text_4b4b4b__12}>ACKO Drive discount</span>
                  <span className={styles.shrink_0_14}>
                    {formatInrSignedNegative(-ACKO_DRIVE_DISCOUNT_INR)}
                  </span>
                </div>
              </div>
            ) : null}

            <div className={styles._mx_4_15} aria-hidden />

            <div className={styles.flex_16}>
              <span className={styles.min_w_0_17}>
                Booking amount (paid)
              </span>
              <span className={styles.w_20_18}>
                − {formatInr(BOOKING_LOCK_AMOUNT_INR)}
              </span>
            </div>

            <div className={styles._mx_4_15} aria-hidden />

            <div className={styles.flex_16}>
              <span
                id="sanctioned-loan-amount-label"
                className={styles.min_w_0_17}
              >
                Loan disbursement amount
              </span>
              <span
                className={styles.min_w_80px__19}
                aria-labelledby="sanctioned-loan-amount-label"
              >
                − {formatInr(loanAmount)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDisbursementEditOpen(true)}
              className={styles.mt_2_20}
            >
              <span className={styles.relative_21} aria-hidden>
                <Image
                  src={editIcon}
                  alt=""
                  width={16}
                  height={16}
                  className={styles.size_4_22}
                  unoptimized
                />
              </span>
              Edit amount
            </button>
          </div>

          <div className={styles.flex_23}>
            <span className={styles.text_sm_24}>
              Insurance, later before delivery
            </span>
            <span className={styles.min_w_80px__25}>
              − {formatInr(DOWN_PAYMENT_INSURANCE_INR)}
            </span>
          </div>

          <div className={styles.flex_26}>
            <span className={styles.text_sm_27}>Your down payment, due now</span>
            <span className={styles.min_w_80px__28}>
              {formatInr(carDownPaymentPortionInr)}
            </span>
          </div>
        </div>

        <div
          className={[styles.payment_success_stagger_29, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_INFO_MS}ms` }}
          role="region"
          aria-label="Down payment parts"
        >
          <p className={styles.text_xs_30}>
            Two things to know:
          </p>
          <ul className={styles.mt_2_31}>
            <li className={styles.flex_32}>
              <span className={styles.relative_33} aria-hidden>
                <Image
                  src={tickIcon}
                  alt=""
                  width={20}
                  height={20}
                  className={styles.size_5_34}
                  unoptimized
                />
              </span>
              <p className={styles.max_w_260px__35}>
                Pay your down payment of{" "}
                <span className={styles.font_semibold_36}>
                  {formatInr(carDownPaymentPortionInr)} by {CAR_DOWN_PAYMENT_DUE_LABEL}
                </span>{" "}
                . Your reservation holds until then.
              </p>
            </li>
            <li className={styles.flex_32}>
              <span className={styles.relative_33} aria-hidden>
                <Image
                  src={tickIcon}
                  alt=""
                  width={20}
                  height={20}
                  className={styles.size_5_34}
                  unoptimized
                />
              </span>
              <p className={styles.max_w_260px__35}>
                Insurance of{" "}
                <span className={styles.font_semibold_36}>
                  {formatInr(DOWN_PAYMENT_INSURANCE_INR)} is separate
                </span>{" "}
                . Pay it just before delivery, for RTO registration.
              </p>
            </li>
          </ul>
        </div>
      </main>

      <div className={[styles.fixed_37, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_38}>
          <button
            type="button"
            onClick={navigateToPayment}
            className={[styles.primary_cta_39, "primary-cta"].filter(Boolean).join(" ")}
          >
            Confirm down payment
          </button>
        </div>
      </div>

      <DisbursementAmountCollectionBottomSheet
        open={disbursementEditOpen}
        onClose={() => setDisbursementEditOpen(false)}
        title="Update your disbursement amount"
        primaryCtaLabel="Update"
        initialDisbursementInr={loanAmount}
        onSubmitAmount={(inr) => {
          setLoanAmount(clampLoanAmount(inr));
          setDisbursementEditOpen(false);
        }}
      />

    </div>
  );
}
