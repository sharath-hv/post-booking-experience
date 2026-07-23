"use client";

import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { ackoDriveFinanceActionPath } from "@/components/payment/acko-drive-finance-bank";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { FullPaymentConfirmBottomSheet } from "@/components/payment/FullPaymentConfirmBottomSheet";
import { SelfFinanceConfirmBottomSheet } from "@/components/payment/SelfFinanceConfirmBottomSheet";
import {
  BANK_DISBURSEMENT_INR,
  DEFAULT_TENURE_MONTHS,
  FULL_PAYMENT_CAR_AMOUNT_INR,
} from "@/components/payment/loan-amount-demo-constants";
import {
  BANK_SHEET_OPTIONS,
  PARTNER_BANK_LOGOS,
  PAYMENT_CHOOSE_ASSETS,
} from "@/components/payment/payment-choose-assets";
import { estimateMonthlyEmiInr, parseAnnualRateFromLabel } from "@/lib/loan-emi";
import { bankIdToken, bankNameToken, bankSelectionPath } from "@/lib/payment/bank-selection-urls";
import styles from "./ChoosePaymentOptionsScreen.module.scss";


function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/** Best partner-bank rate — the honest “EMI from” number on the fork. */
const BEST_PARTNER_RATE = Math.min(
  ...BANK_SHEET_OPTIONS.map((bank) => parseAnnualRateFromLabel(bank.rate)),
);

const ACKO_EMI_FROM_INR = estimateMonthlyEmiInr(
  BANK_DISBURSEMENT_INR,
  DEFAULT_TENURE_MONTHS,
  BEST_PARTNER_RATE,
);

/** Stagger between option cards once the artifact reveals (`payment-success-stagger` in globals). */
const STAGGER_OPTION_STEP_MS = 115;

type PaymentOptionId = "acko_drive" | "self_finance" | "full_payment";

function RadioIndicator({ selected }: { selected: boolean }) {
  const src = selected ? PAYMENT_CHOOSE_ASSETS.radioOn : PAYMENT_CHOOSE_ASSETS.radioOff;

  return (
    <span className={styles.relative_0} aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        className={styles.object_contain_1}
        unoptimized
        sizes="16px"
      />
    </span>
  );
}

type OptionStat = {
  value: string;
  caption: string;
};

/** Auto-advance cadence for the how-it-works slideshow. */
const FLOW_SLIDE_MS = 2200;

/**
 * “How it works” as a one-line slideshow — steps cycle one at a time with
 * position dots, inside a fixed-height strip so nothing jumps.
 */
function FlowStrip({
  steps,
  bankLogosOnStep,
}: {
  steps: readonly string[];
  /** Show partner-bank marks beside this step (e.g. “You pick the bank”). */
  bankLogosOnStep?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % steps.length),
      reduceMotion ? FLOW_SLIDE_MS + 1300 : FLOW_SLIDE_MS,
    );
    return () => window.clearInterval(id);
  }, [steps.length, reduceMotion]);

  return (
    <div className={styles.flex_3} aria-label="How it works">
      <div className={styles.min_w_0_4}>
        <div
          key={idx}
          className={cn(styles.flex_0, reduceMotion ? "" : "kyc-stagger")}
        >
          <span className={styles.flex_5}>
            {idx + 1}
          </span>
          <span className={styles.min_w_0_6}>{steps[idx]}</span>
          {bankLogosOnStep === idx ? (
            <span className={styles.flex_7}>
              {PARTNER_BANK_LOGOS.map((bank) => (
                <span key={bank.alt} className={styles.relative_8} title={bank.alt}>
                  <Image
                    src={bank.src}
                    alt={bank.alt}
                    fill
                    className={styles.object_contain_1}
                    unoptimized
                    sizes="16px"
                  />
                </span>
              ))}
            </span>
          ) : null}
        </div>
      </div>
      <div className={styles.flex_7} aria-hidden>
        {steps.map((step, i) => (
          <span
            key={step}
            className={cn(styles.h_1_1, i === idx ? styles.w_3_1 : styles.w_1_1)}
          />
        ))}
      </div>
    </div>
  );
}

type OptionCardProps = {
  id: PaymentOptionId;
  selected: boolean;
  onSelect: () => void;
  illustrationSrc: string | StaticImageData;
  title: string;
  /** One-word positioning — “Easiest” / “Most control” / “Fastest”. */
  chip?: string;
  /** One sentence, Shivi's voice — what this path actually means for you. */
  blurb: string;
  /** The deciding numbers — visible before any tap. */
  stats: readonly OptionStat[];
  /** Micro process steps — slideshow in a thin strip at the bottom of every card. */
  flow: readonly string[];
  /** Show partner-bank marks beside this flow step. */
  flowBankLogosOnStep?: number;
};

function OptionCard({
  id,
  selected,
  onSelect,
  illustrationSrc,
  title,
  chip,
  blurb,
  stats,
  flow,
  flowBankLogosOnStep,
}: OptionCardProps) {
  return (
    <button
      type="button"
      id={`payment-option-${id}`}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(styles.w_full_2, "card-elevated", selected ? styles.border_selected_2 : styles.border_transparent_2)}
    >
      <div className={styles.flex_9}>
        <div className={styles.relative_10}>
          <Image
            src={illustrationSrc}
            alt=""
            fill
            className={styles.object_contain_1}
            unoptimized
            sizes="40px"
          />
        </div>
        {/* Uniform two-line lockup (chip, title) so every card's header is the same height. */}
        <div className={styles.min_w_0_11}>
          {chip ? (
            <span className={styles.inline_flex_12}>
              {chip}
            </span>
          ) : null}
          <p className={cn(styles.text_base_3, chip ? styles.mt_1_3 : "")}>
            {title}
          </p>
        </div>
        <span className={styles.mt_1_13}>
          <RadioIndicator selected={selected} />
        </span>
      </div>

      <p className={styles.mt_3_14}>{blurb}</p>

      <div className={styles.mt_4_15}>
        {stats.map((stat, idx) => (
          <div
            key={stat.caption}
            className={
              idx === 0
                ? styles.min_w_0_1
                : styles.min_w_0_2
            }
          >
            <p className={styles.text_sm_16}>
              {stat.value}
            </p>
            <p className={styles.mt_0_5_17}>{stat.caption}</p>
          </div>
        ))}
      </div>

      {/* How-it-works strip — always visible and cycling on every card. */}
      <div className={styles.mt_4_18}>
        <FlowStrip steps={flow} bankLogosOnStep={flowBankLogosOnStep} />
      </div>
    </button>
  );
}

/**
 * Choose payment option — the money fork, as a Shivi turn: the remaining
 * amount anchors the question, the three paths are the artifact, the reply
 * adapts to the selection.
 */
export function ChoosePaymentOptionsScreen() {
  const router = useRouter();
  const [choice, setChoice] = useState<PaymentOptionId>("acko_drive");
  const [selfFinanceConfirmOpen, setSelfFinanceConfirmOpen] = useState(false);
  const [fullPaymentConfirmOpen, setFullPaymentConfirmOpen] = useState(false);

  const onContinue = useCallback(() => {
    if (choice === "acko_drive") {
      router.push(
        bankSelectionPath({
          next: ackoDriveFinanceActionPath(bankIdToken()),
          echo: `Let's finance via ${bankNameToken()}`,
        }),
      );
      return;
    }
    if (choice === "self_finance") {
      setSelfFinanceConfirmOpen(true);
      return;
    }
    setFullPaymentConfirmOpen(true);
  }, [choice, router]);

  // Straight into Shivi's action turns — no “Payment option confirmed” interstitials.
  const onFullPaymentConfirm = useCallback(() => {
    setFullPaymentConfirmOpen(false);
    writeConciergeEcho("I'll pay in full");
    router.push("/payment/full-payment-confirmed");
  }, [router]);

  const onSelfFinanceConfirm = useCallback(() => {
    setSelfFinanceConfirmOpen(false);
    writeConciergeEcho("I'll arrange the loan myself");
    router.push("/payment/self-finance-action");
  }, [router]);

  const ctaLabel =
    choice === "acko_drive"
      ? "Show me the bank options"
      : choice === "self_finance"
        ? "I'll use my own bank loan"
        : "I'll pay in full";

  return (
    <>
      <ConciergeTurnShell
        says={[
          "How do you want to pay the remaining ₹13,63,780?",
          "Pick what suits you. I'll make any of these painless.",
        ]}
        artifact={
          <div className={styles.flex_19}>
            <div className={[styles.payment_success_stagger_20, "payment-success-stagger"].filter(Boolean).join(" ")}>
              <OptionCard
                id="acko_drive"
                selected={choice === "acko_drive"}
                onSelect={() => setChoice("acko_drive")}
                illustrationSrc={PAYMENT_CHOOSE_ASSETS.ackoDriveFinance}
                title="Finance with ACKO Drive"
                chip="Easiest"
                blurb="You pick the bank, I handle the paperwork and every follow-up after."
                stats={[
                  { value: "2 days", caption: "approx. approval time" },
                  { value: formatInr(ACKO_EMI_FROM_INR), caption: "estimated monthly EMI" },
                ]}
                flow={[
                  "You pick the bank",
                  "Apply in minutes",
                  "Bank verifies & approves",
                  "Pay your down payment",
                  "Bank pays the dealer",
                ]}
                flowBankLogosOnStep={0}
              />
            </div>

            <div
              className={[styles.payment_success_stagger_20, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${STAGGER_OPTION_STEP_MS}ms` }}
            >
              <OptionCard
                id="self_finance"
                selected={choice === "self_finance"}
                onSelect={() => setChoice("self_finance")}
                illustrationSrc={PAYMENT_CHOOSE_ASSETS.selfFinance}
                title="Arrange the loan yourself"
                chip="Self-arranged"
                blurb="Pick any bank you like and apply on your own. Bring me the sanction letter and I take it from there."
                stats={[
                  { value: "5–7 days", caption: "typical bank approval" },
                  { value: "Any bank", caption: "your relationship, your rate" },
                ]}
                flow={[
                  "I hand you the invoice",
                  "Your bank approves the loan",
                  "Pay your down payment",
                  "Your bank pays the dealer",
                ]}
              />
            </div>

            <div
              className={[styles.payment_success_stagger_20, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${2 * STAGGER_OPTION_STEP_MS}ms` }}
            >
              <OptionCard
                id="full_payment"
                selected={choice === "full_payment"}
                onSelect={() => setChoice("full_payment")}
                illustrationSrc={PAYMENT_CHOOSE_ASSETS.fullCash}
                title="Pay in full, no loan"
                chip="Fastest"
                blurb="No loan, no EMI, no paperwork. Pay and your car gets ready for delivery."
                stats={[
                  { value: formatInr(FULL_PAYMENT_CAR_AMOUNT_INR), caption: "due now" },
                  { value: "No bank wait", caption: "fastest to delivery" },
                ]}
                flow={[
                  "Pay in parts or at once",
                  "That’s the money done",
                  "We get your car ready",
                ]}
              />
            </div>
          </div>
        }
        replies={[{ label: ctaLabel, onClick: onContinue, echo: null }]}
        footnote="Your delivery date locks in once the money plan is set. Best done now."
        callLabel="Not sure? I can call you"
        manageShowVehicleIdentification
      />

      <SelfFinanceConfirmBottomSheet
        open={selfFinanceConfirmOpen}
        onClose={() => setSelfFinanceConfirmOpen(false)}
        onConfirm={onSelfFinanceConfirm}
      />

      <FullPaymentConfirmBottomSheet
        open={fullPaymentConfirmOpen}
        onClose={() => setFullPaymentConfirmOpen(false)}
        onConfirm={onFullPaymentConfirm}
      />
    </>
  );
}
