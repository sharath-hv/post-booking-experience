"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import { WordByWordLine } from "@/components/payment/WordByWordLine";
import { AuroraLightLayer } from "@/components/ui/aurora-light-layer";

const KYC_HEADLINE =
  "Sharath, the car is almost yours! Identify yourself to process your booking.";

const KYC_SUBLINE =
  "Complete KYC now to get your Creta by 10 Jun. Subject to inventory availability.";

const DEADLINE_LINE = "Confirm by 24 Apr, 3:00 PM to avoid cancellation";

/** Word cadence for the hero headline. */
const HEADLINE_WORD_DELAY_MS = 135;
/** Shared opacity transition duration (headline words + subline + CTA + warning). */
const HERO_FADE_DURATION_CLASS = "duration-[450ms]";
/** Delay after subline appears before the CTA fades in. */
const SUBLINE_TO_CTA_DELAY_MS = 240;
/** Delay after CTA is shown before the warning line appears. */
const CTA_TO_WARNING_DELAY_MS = 480;

/** Hero block (header + aurora + content) fills at least 90% of the viewport; uses `dvh` for mobile browser chrome. */
const HERO_MIN_HEIGHT = "min-h-[90dvh]";

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

/**
 * KYC verification (pending) — [Figma 2052:7630](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2052-7630).
 */
export function KycPendingScreen() {
  const router = useRouter();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showSubline, setShowSubline] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const onHeadlineComplete = useCallback(() => {
    setShowSubline(true);
    window.setTimeout(() => setShowCta(true), SUBLINE_TO_CTA_DELAY_MS);
    window.setTimeout(
      () => setShowWarning(true),
      SUBLINE_TO_CTA_DELAY_MS + CTA_TO_WARNING_DELAY_MS,
    );
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) {
      setShowSubline(true);
      setShowCta(true);
      setShowWarning(true);
    }
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f5f5f5] font-sans">
      <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col">
        <div
          className={`kyc-pending-hero-card relative isolate mx-auto flex min-h-0 w-full flex-1 flex-col ${HERO_MIN_HEIGHT}`}
        >
          <AuroraLightLayer />
          <KycTopNavHeader transparent endSlot={<GetHelpButton />} />
          <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center px-5 pb-10 pt-[120px]">
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
                  {KYC_HEADLINE}
                </h1>
              ) : (
                <WordByWordLine
                  as="h1"
                  ariaLabel={KYC_HEADLINE}
                  text={KYC_HEADLINE}
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
                {KYC_SUBLINE}
              </p>
            </div>

            <div className="mt-auto w-full pt-8">
              <p
                className={`text-center text-xs font-medium leading-[18px] text-[#d16900] transition-opacity ${HERO_FADE_DURATION_CLASS} ease-out ${
                  showWarning ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!showWarning}
              >
                {DEADLINE_LINE}
              </p>
              <button
                type="button"
                className={`primary-cta mt-4 transition-opacity ${HERO_FADE_DURATION_CLASS} ease-out focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/30 focus-visible:ring-offset-2 ${
                  showCta ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                tabIndex={showCta ? 0 : -1}
                onClick={() => router.push("/kyc/upload")}
              >
                Complete KYC Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-[360px] shrink-0 scroll-mt-4 bg-[#ffffff] px-5 pb-10 pt-8">
        <p className="mb-4 text-center text-sm font-medium leading-5 text-[#4b4b4b]">
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
