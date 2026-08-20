"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import bookingCancelledIllustration from "@/assets/Booking cancelled.svg";
import coApplicantIllustration from "@/assets/co-applicant.svg";
import moneyIcon from "@/assets/money.svg";

import { LoanDecisionDeadlineFootnote } from "@/components/organisms/concierge/DeadlineCountdownFootnote";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { bankForQueryParam } from "@/helpers/acko-drive-finance-bank";
import { LoanRejectedOutcomeSwitcher } from "@/components/organisms/payment/LoanRejectedOutcomeSwitcher";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/organisms/payment/payment-choose-assets";
import { BANK_SHEET_OPTIONS } from "@/constants/payment-bank-sheet";
import { cancelBookingRefundCancellationFeeDisplay } from "@/constants/cancel-booking-content";
import {
  BANK_DISBURSEMENT_INR,
  DEFAULT_TENURE_MONTHS,
} from "@/constants/loan-amount-demo-constants";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { JOURNEY_PATHS } from "@/helpers/journey-routes";
import { estimateMonthlyEmiInr, parseAnnualRateFromLabel } from "@/helpers/loan-emi";
import {
  createDefaultCoApplicantProfile,
  readLoanApplicationState,
  writeLoanApplicationState,
} from "@/helpers/loan-application-state";
import { loanApplicationPath, loanProcessingPath } from "@/helpers/loan-application-urls";
import {
  LOAN_REJECTED_OUTCOME_QUERY_KEY,
  loanGuarantorPath,
  loanRejectedTurnCopy,
  resolveLoanRejectedOutcome,
  type LoanRejectedOutcome,
} from "@/constants/loan-rejected-content";
import { Radio } from "@/components/atoms/selection/Radio";
import { OVERLAY_GLASS_CARD_CLASS } from "@/helpers/overlay-glass-card";
import { BOOKING_LOCK_AMOUNT_INR } from "@/helpers/paymentUrls";
import { cn } from "@/utils/utils";
import styles from "./LoanRejectedScreen.module.scss";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/** Best-rate partner bank that isn't the one that declined. */
function pickAlternativeBank(rejectedId: string) {
  const candidates = BANK_SHEET_OPTIONS.filter((bank) => bank.id !== rejectedId);
  return [...candidates].sort(
    (a, b) => parseAnnualRateFromLabel(a.rate) - parseAnnualRateFromLabel(b.rate),
  )[0];
}

function enableCoApplicantPass() {
  const next = readLoanApplicationState();
  next.includeCoApplicant = true;
  if (next.coApplicant == null) {
    next.coApplicant = createDefaultCoApplicantProfile();
  }
  writeLoanApplicationState(next);
}

/** Colour illustration slot — self finance, full cash, co-applicant, cancel. */
function OptionIllustration({ src }: { src: StaticImageData }) {
  return (
    <span className={styles.illustration} aria-hidden>
      <Image src={src} alt="" fill className={styles.illustrationImg} unoptimized sizes="44px" />
    </span>
  );
}

/** Bank logo, unadorned — just the mark, matching the other cards' illustration size. */
function BankIllustration({ src }: { src: string }) {
  return (
    <span className={styles.bankMark} aria-hidden>
      <Image src={src} alt="" fill className={styles.illustrationImg} unoptimized sizes="44px" />
    </span>
  );
}

/** One decision-driving fact, in the dashed-separator footer every card shares. */
function OptionDetail({ icon, children }: { icon: StaticImageData; children: ReactNode }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailIcon} aria-hidden>
        <Image src={icon} alt="" fill className={styles.detailIconImg} unoptimized sizes="16px" />
      </span>
      <span className={styles.detailText}>{children}</span>
    </div>
  );
}

/** Rate + EMI footer for the alt-bank options — same numbers the old rate card showed. */
function BankRateDetail({ rate, emi }: { rate: string; emi: number }) {
  return (
    <div className={styles.bankStats}>
      <div className={styles.bankStatRow}>
        <span className={styles.bankStatLabel}>Interest rate</span>
        <span className={styles.bankStatValue}>{rate}</span>
      </div>
      <div className={styles.bankStatRow}>
        <span className={styles.bankStatLabel}>EMI from</span>
        <span className={styles.bankStatValueStrong}>{formatInr(emi)}/mo</span>
      </div>
    </div>
  );
}

type LoanRejectedOptionId = "primary" | "secondary" | "cancel";

type LoanRejectedOption = {
  id: LoanRejectedOptionId;
  illustration: ReactNode;
  title: string;
  subtitle: string;
  /** Decision-driving fact row — omit when the title + subtitle already say enough. */
  footer?: ReactNode;
  ctaLabel: string;
  perform: () => void;
};

type LoanRejectedOptionCardProps = {
  selected: boolean;
  onSelect: () => void;
  illustration: ReactNode;
  title: string;
  subtitle: string;
  footer?: ReactNode;
};

function LoanRejectedOptionCard({
  selected,
  onSelect,
  illustration,
  title,
  subtitle,
  footer,
}: LoanRejectedOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        styles.optionCard,
        OVERLAY_GLASS_CARD_CLASS,
        selected && styles.optionCardSelected,
      )}
    >
      <div className={styles.optionHead}>
        {illustration}
        <span className={styles.optionRadio}>
          <Radio selected={selected} />
        </span>
      </div>
      <p className={styles.optionTitle}>{title}</p>
      <p className={styles.optionSubtitle}>{subtitle}</p>
      {footer != null ? <div className={styles.optionFooter}>{footer}</div> : null}
    </button>
  );
}

/**
 * Bank declined. Backend analysis decides what can still work.
 * Every outcome is a set of radio-selectable option cards (self finance,
 * co-applicant, guarantor, alt bank, cancel) with one contextual CTA that
 * adapts to the selection — same grammar as {@link ConciergeAllocationFailedScreen}.
 * 48h decision SLA — pick a path or the booking auto-cancels (demo
 * **SLA timed out** → {@link LoanDecisionCancelledScreen}).
 * Demo switch previews all five outcomes via `?outcome=`.
 */
export function LoanRejectedScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rejected = useMemo(
    () => bankForQueryParam(searchParams.get("bank")),
    [searchParams],
  );
  const outcome = useMemo(
    () => resolveLoanRejectedOutcome(searchParams.get(LOAN_REJECTED_OUTCOME_QUERY_KEY)),
    [searchParams],
  );
  const alt = useMemo(() => pickAlternativeBank(rejected.id), [rejected.id]);
  const altEmi = useMemo(
    () =>
      estimateMonthlyEmiInr(
        BANK_DISBURSEMENT_INR,
        DEFAULT_TENURE_MONTHS,
        parseAnnualRateFromLabel(alt.rate),
      ),
    [alt.rate],
  );

  const copy = useMemo(
    () =>
      loanRejectedTurnCopy(outcome, {
        rejectedBankName: rejected.name,
        altBankName: alt.name,
        altBankRate: alt.rate,
      }),
    [alt.name, alt.rate, outcome, rejected.name],
  );

  const onOutcomeChange = useCallback(
    (next: LoanRejectedOutcome) => {
      const q = new URLSearchParams(searchParams.toString());
      q.set(LOAN_REJECTED_OUTCOME_QUERY_KEY, next);
      router.replace(`/payment/loan-rejected?${q.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const cancelHref = useMemo(
    () =>
      `${JOURNEY_PATHS.booking.cancel}?paid=${BOOKING_LOCK_AMOUNT_INR}&stage=post&from=finance`,
    [],
  );

  const goToCancel = useCallback(() => {
    writeConciergeEcho("Cancel my booking");
    router.push(cancelHref);
  }, [cancelHref, router]);

  const startCoApplicant = useCallback(
    (bankId: string, echo: string) => {
      enableCoApplicantPass();
      writeConciergeEcho(echo);
      router.push(loanApplicationPath(bankId, "personal", { applicant: "co" }));
    },
    [router],
  );

  const switchToAltBank = useCallback(() => {
    writeConciergeEcho(`Continue with ${alt.name}`);
    router.push(loanProcessingPath(alt.id));
  }, [alt.id, alt.name, router]);

  const goToGuarantor = useCallback(() => {
    writeConciergeEcho("Let's add a guarantor");
    router.push(loanGuarantorPath(rejected.id));
  }, [rejected.id, router]);

  const goToSelfFinance = useCallback(() => {
    writeConciergeEcho("I'll arrange my own finance");
    router.push("/payment/self-finance-action");
  }, [router]);

  const goToFullPayment = useCallback(() => {
    writeConciergeEcho("I'll pay the full amount");
    router.push("/payment/full-payment-confirmed");
  }, [router]);

  const cancelOption = useMemo(
    (): LoanRejectedOption => ({
      id: "cancel",
      illustration: <OptionIllustration src={bookingCancelledIllustration} />,
      title: "Cancel my booking",
      subtitle: "Prefer to step away for now? No hard feelings, the door stays open.",
      footer: (
        <OptionDetail icon={moneyIcon}>
          A cancellation fee of {cancelBookingRefundCancellationFeeDisplay()} will apply.
        </OptionDetail>
      ),
      ctaLabel: "Cancel my booking",
      perform: goToCancel,
    }),
    [goToCancel],
  );

  const options = useMemo((): readonly LoanRejectedOption[] => {
    switch (outcome) {
      case "non_doable":
        return [
          {
            id: "primary",
            illustration: <OptionIllustration src={PAYMENT_CHOOSE_ASSETS.selfFinance} />,
            title: "Arrange your own finance",
            subtitle:
              "Apply with any bank or NBFC you choose. Bring me the sanction letter and I take it from there.",
            ctaLabel: "I'll arrange my own finance",
            perform: goToSelfFinance,
          },
          {
            id: "secondary",
            illustration: <OptionIllustration src={PAYMENT_CHOOSE_ASSETS.fullCash} />,
            title: "Pay the full amount",
            subtitle: "No loan, no EMI, no paperwork. Pay and your car gets ready for delivery.",
            ctaLabel: "I'll pay the full amount",
            perform: goToFullPayment,
          },
          cancelOption,
        ];

      case "same_bank_co_applicant":
        return [
          {
            id: "primary",
            illustration: <OptionIllustration src={coApplicantIllustration} />,
            title: "Add a co‑applicant",
            subtitle: "Same bank, same loan amount. You stay the primary applicant.",
            ctaLabel: "Add a co‑applicant",
            perform: () => startCoApplicant(rejected.id, "Let's add a co‑applicant"),
          },
          cancelOption,
        ];

      case "same_bank_guarantor":
        return [
          {
            id: "primary",
            illustration: <OptionIllustration src={coApplicantIllustration} />,
            title: "Add a guarantor",
            subtitle: "Someone who can stand guarantee for this loan, alongside you.",
            ctaLabel: "Add a guarantor",
            perform: goToGuarantor,
          },
          cancelOption,
        ];

      case "alt_bank":
        return [
          {
            id: "primary",
            illustration: <BankIllustration src={alt.logoSrc} />,
            title: `Continue with ${alt.name}`,
            subtitle: "Your application carries over. Only the bank changes.",
            footer: <BankRateDetail rate={alt.rate} emi={altEmi} />,
            ctaLabel: `Continue with ${alt.name}`,
            perform: switchToAltBank,
          },
          cancelOption,
        ];

      case "alt_bank_co_applicant":
        return [
          {
            id: "primary",
            illustration: <BankIllustration src={alt.logoSrc} />,
            title: `${alt.name} with a co‑applicant`,
            subtitle: "Your application carries over. We'll just add a co‑applicant to complete it.",
            footer: <BankRateDetail rate={alt.rate} emi={altEmi} />,
            ctaLabel: "Continue with a co‑applicant",
            perform: () =>
              startCoApplicant(alt.id, `Continue with ${alt.name} and a co‑applicant`),
          },
          cancelOption,
        ];
    }
  }, [
    alt.id,
    alt.logoSrc,
    alt.name,
    alt.rate,
    altEmi,
    cancelOption,
    goToFullPayment,
    goToGuarantor,
    goToSelfFinance,
    outcome,
    rejected.id,
    startCoApplicant,
    switchToAltBank,
  ]);

  const [choiceId, setChoiceId] = useState<LoanRejectedOptionId>(options[0]!.id);

  // Reset to the outcome's default pick whenever the demo switch changes outcomes.
  useEffect(() => {
    setChoiceId(options[0]!.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the outcome switch should reset the pick
  }, [outcome]);

  const selectedOption = options.find((option) => option.id === choiceId) ?? options[0]!;

  const replies = useMemo(
    () => [{ label: selectedOption.ctaLabel, onClick: selectedOption.perform, navigates: true, echo: null }],
    [selectedOption],
  );

  return (
    <ConciergeTurnShell
      says={copy.says}
      dateHolder="you"
      beforeDialogue={
        <LoanRejectedOutcomeSwitcher value={outcome} onChange={onOutcomeChange} />
      }
      artifact={
        <div className={styles.optionStack}>
          {options.map((option) => (
            <LoanRejectedOptionCard
              key={option.id}
              selected={option.id === selectedOption.id}
              onSelect={() => setChoiceId(option.id)}
              illustration={option.illustration}
              title={option.title}
              subtitle={option.subtitle}
              footer={option.footer}
            />
          ))}
        </div>
      }
      footnote={<LoanDecisionDeadlineFootnote />}
      replies={replies}
      altTimeSkip={{
        label: "SLA timed out",
        href: JOURNEY_PATHS.payment.loanDecisionCancelled,
      }}
      callLabel="Rather talk it through? I can call you"
    />
  );
}
