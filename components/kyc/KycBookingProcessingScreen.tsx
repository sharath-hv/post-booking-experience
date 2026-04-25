"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import {
  WhatsNextTimeline,
  type WhatsNextTimelineVariant,
} from "@/components/kyc/WhatsNextTimeline";
import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import { WordByWordLine } from "@/components/payment/WordByWordLine";
import { AuroraLightLayer } from "@/components/ui/aurora-light-layer";

const DEFAULT_PROCESSING_HEADLINE = "We're processing your booking, Sharath!";

const DEFAULT_PROCESSING_SUBLINE = "We will send you an OTP to confirm.";

const DEFAULT_NEXT_HREF = "/kyc/booking-confirmed";

/** Word cadence for the hero headline (aligned with KYC pending). */
const HEADLINE_WORD_DELAY_MS = 135;
const HERO_FADE_DURATION_CLASS = "duration-[450ms]";
const SUBLINE_TO_CTA_DELAY_MS = 240;
/** Delay after CTA is shown before the orange deadline line (aligned with `PaymentDefaultScreen`). */
const CTA_TO_WARNING_DELAY_MS = 480;

const HERO_MIN_HEIGHT = "min-h-[90dvh]";

/** “What’s next” — car allocation step (shared with payment default timeline). */
const WHATS_NEXT_ALLOCATION_SUBLINE =
  "Your selected variant and colour are being matched to available stock.";

/** “What’s next” — payment step description (shared with payment default timeline). */
const WHATS_NEXT_PAYMENT_SUBLINE =
  "You can choose from ACKO Drive Finance, Self Finance or Full Cash Payment.";

type OptionRowProps = {
  iconSrc: string;
  label: string;
  onClick?: () => void;
};

function GetHelpButton() {
  return (
    <button
      type="button"
      className="flex h-[28px] shrink-0 items-center gap-1 rounded-lg border border-[#121212] bg-white px-3 text-xs font-medium leading-[18px] text-[#121212] transition-colors hover:bg-[#f5f5f5] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/20 focus-visible:ring-offset-2"
    >
      <span className="relative h-5 w-5 shrink-0" aria-hidden>
        <Image
          src={KYC_ASSETS.getHelp}
          alt=""
          fill
          className="object-contain"
          unoptimized
          sizes="20px"
        />
      </span>
      Ask Shivi
    </button>
  );
}

function OptionRow({ iconSrc, label, onClick }: OptionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-mx-2 flex w-[calc(100%+16px)] cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[#f5f5f5] active:bg-[#ebebeb]"
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <span className="relative h-6 w-6 shrink-0">
          <Image src={iconSrc} alt="" fill className="object-contain" unoptimized sizes="24px" />
        </span>
        <span className="text-sm font-medium leading-5 text-[#121212]">{label}</span>
      </span>
      <span className="relative h-6 w-6 shrink-0">
        <Image
          src={KYC_ASSETS.chevronRight}
          alt=""
          fill
          className="object-contain"
          unoptimized
          sizes="24px"
        />
      </span>
    </button>
  );
}

export type KycBookingProcessingScreenProps = {
  headline?: string;
  subline?: string;
  /** Primary “Next” CTA destination. */
  nextHref?: string;
  /** Route to warm in the background (defaults to `nextHref`). */
  prefetchHref?: string;
  /** Passed to `WhatsNextTimeline` — use `compact` on loan processing only. */
  whatsNextTimelineVariant?: WhatsNextTimelineVariant;
  /** When set, replaces the default “What’s next?” timeline (e.g. loan processing stepper). */
  whatsNextCard?: ReactNode;
  /** Orange deadline copy above the primary CTA (same pattern as `/payment/default`). */
  ctaWarningLine?: string;
  /** Primary CTA label (default “Next”). */
  nextCtaLabel?: string;
  /** Optional summary card rendered inside the hero, directly below the subline. */
  heroSummaryCard?: ReactNode;
};

/**
 * Booking processing — layout aligned with `KycPendingScreen` (aurora hero + staggered copy + primary CTA).
 */
export function KycBookingProcessingScreen({
  headline = DEFAULT_PROCESSING_HEADLINE,
  subline = DEFAULT_PROCESSING_SUBLINE,
  nextHref = DEFAULT_NEXT_HREF,
  prefetchHref = nextHref,
  whatsNextTimelineVariant = "default",
  whatsNextCard,
  ctaWarningLine,
  nextCtaLabel = "Next",
  heroSummaryCard,
}: KycBookingProcessingScreenProps = {}) {
  const router = useRouter();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showSubline, setShowSubline] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const onHeadlineComplete = useCallback(() => {
    setShowSubline(true);
    window.setTimeout(() => setShowCta(true), SUBLINE_TO_CTA_DELAY_MS);
    if (ctaWarningLine) {
      window.setTimeout(
        () => setShowWarning(true),
        SUBLINE_TO_CTA_DELAY_MS + CTA_TO_WARNING_DELAY_MS,
      );
    }
  }, [ctaWarningLine]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) {
      setShowSubline(true);
      setShowCta(true);
      if (ctaWarningLine) {
        setShowWarning(true);
      }
    }
  }, [ctaWarningLine]);

  useEffect(() => {
    router.prefetch(prefetchHref);
  }, [router, prefetchHref]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f5f5f5] font-sans">
      <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col">
        <div
          className={`kyc-pending-hero-card relative isolate mx-auto flex min-h-0 w-full flex-1 flex-col ${HERO_MIN_HEIGHT}`}
        >
          <AuroraLightLayer />
          <KycTopNavHeader transparent endSlot={<GetHelpButton />} />
          <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center px-5 pb-10 pt-[140px]">
            <div className="relative h-[72px] w-[72px] shrink-0">
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-[18px] bg-[#f5f5f5]">
                <Image
                  src={KYC_ASSETS.avatar}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="72px"
                  unoptimized
                  priority
                />
              </div>
              <span className="absolute right-0 top-0 h-3.5 w-3.5">
                <Image
                  src={KYC_ASSETS.onlineDot}
                  alt=""
                  width={14}
                  height={14}
                  className="block h-3.5 w-3.5"
                  unoptimized
                />
              </span>
            </div>

            <div className="mt-8 flex w-full flex-col gap-3 text-center">
              {reduceMotion ? (
                <h1 className="text-2xl font-semibold leading-8 tracking-tight text-[#121212]">
                  {headline}
                </h1>
              ) : (
                <WordByWordLine
                  as="h1"
                  ariaLabel={headline}
                  text={headline}
                  wordDelayMs={HEADLINE_WORD_DELAY_MS}
                  wordOpacityDurationClassName={HERO_FADE_DURATION_CLASS}
                  className="text-2xl font-semibold leading-8 tracking-tight text-[#121212]"
                  onComplete={onHeadlineComplete}
                />
              )}
              <p
                className={`text-sm font-normal leading-[22px] text-[#4b4b4b] transition-opacity ${HERO_FADE_DURATION_CLASS} ease-out ${
                  showSubline ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!showSubline}
              >
                {subline}
              </p>
            </div>

            {heroSummaryCard ? (
              <div
                className={`mt-[20px] w-full transition-opacity ${HERO_FADE_DURATION_CLASS} ease-out ${
                  showSubline ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!showSubline}
              >
                {heroSummaryCard}
              </div>
            ) : null}

            <div
              className={
                heroSummaryCard
                  ? "mt-14 w-full"
                  : "mt-auto w-full pt-8"
              }
            >
              {ctaWarningLine ? (
                <p
                  className={`text-center text-xs font-medium leading-[18px] text-[#d16900] transition-opacity ${HERO_FADE_DURATION_CLASS} ease-out ${
                    showWarning ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden={!showWarning}
                >
                  {ctaWarningLine}
                </p>
              ) : null}
              <button
                type="button"
                className={`primary-cta transition-opacity ${HERO_FADE_DURATION_CLASS} ease-out focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/30 focus-visible:ring-offset-2 ${
                  ctaWarningLine ? "mt-4 " : ""
                }${showCta ? "opacity-100" : "pointer-events-none opacity-0"}`}
                tabIndex={showCta ? 0 : -1}
                onClick={() => router.push(nextHref)}
              >
                {nextCtaLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-[360px] shrink-0 scroll-mt-4 bg-[#ffffff] px-5 pb-10 pt-8">
        <p className="mb-4 text-center text-sm font-medium leading-5 text-[#4b4b4b]">
          What&apos;s next?
        </p>

        {whatsNextCard ?? (
          <WhatsNextTimeline
            variant={whatsNextTimelineVariant}
            firstStepTitle="Car allocation"
            firstStepDescription={WHATS_NEXT_ALLOCATION_SUBLINE}
            secondStepTitle="Payment"
            secondStepDescription={WHATS_NEXT_PAYMENT_SUBLINE}
            thirdStepTitle="Car delivery"
            thirdStepDescription="Estimated delivery by 2 Mar 2026"
          />
        )}

        <p className="mb-4 mt-10 text-center text-sm font-medium leading-5 text-[#4b4b4b]">
          Manage your booking
        </p>

        <div className="flex flex-col gap-4 rounded-2xl border border-[#e8e8e8] bg-white px-5 py-[20px]">
          <OptionRow iconSrc={KYC_ASSETS.iconBooking} label="Your booking details" />
          <hr className="border-0 border-t border-dashed border-[#e8e8e8]" />
          <OptionRow iconSrc={KYC_ASSETS.iconPayment} label="Payment summary" />
          <hr className="border-0 border-t border-dashed border-[#e8e8e8]" />
          <OptionRow iconSrc={KYC_ASSETS.iconModify} label="Modify booking" />
        </div>
      </section>
    </div>
  );
}
