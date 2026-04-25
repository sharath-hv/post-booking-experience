"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { motion } from "framer-motion";

import hyundaiCretaThumb from "@/assets/Hyundai Creta.png";
import shiviAvatar from "@/assets/Shivi image.png";

import { WordByWordLine } from "@/components/payment/WordByWordLine";

const LOTTIE_TICK_URL =
  "https://lottie.host/2487840b-b4dd-4475-a409-663cd2b9403b/C1cWv7yapl.json";

/** [Figma 1880:6382](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=1880-6341) */
const RM_INTRO_COPY =
  "Shivi is your personal relationship manager, ready to assist you with any questions or support you need.";

const HOW_IT_WORKS_POSTER = "/assets/payment-success/how-it-works-poster.png";
const HOW_IT_WORKS_PLAY = "/assets/payment-success/how-it-works-play.svg";

/** Same top hero art as down payment success / booking confirmation. */
const BOOKING_PAYMENT_SUCCESS_HERO = "/assets/acko-drive-finance-hero-gradient.svg";

/** Centered first state: animation → header + subtext → car, then hold before compact. */
/** Playback speed for the tick Lottie (under 1 = slower). */
const LOTTIE_PLAYBACK_SPEED = 0.73;
/** If Lottie JSON fails to load, reveal headline after static ✓ has been visible this long. */
const FALLBACK_HEADLINE_REVEAL_MS = 1000;
/** After headline + subtext finish revealing, wait this long before showing the car card. */
const REVEAL_CAR_AFTER_HEADLINE_MS = 600;
/** After the car card is visible, hold this long before compact. */
const CENTERED_HOLD_BEFORE_COMPACT_MS = 2000;
/** Framer layout duration for hero moving to compact (seconds). */
const LAYOUT_TRANSITION_DURATION_S = 0.95;
/** Lottie/check wrapper width–height CSS transition (ms). */
const LOTTIE_DIMENSION_TRANSITION_MS = 800;
/** Second state: Shivi only after hero layout motion has finished. */
const SHIVI_ENTER_AFTER_COMPACT_MS = Math.round(LAYOUT_TRANSITION_DURATION_S * 1000) + 80;
const RM_WORD_DELAY_MS = 125;
/** Pause after RM intro typing finishes, then “How it works”. */
const HOW_IT_WORKS_AFTER_TYPING_MS = 550;
const FOOTER_REVEAL_AFTER_HOW_IT_WORKS_MS = 480;
const WORD_OPACITY_DURATION_CLASS = "duration-[320ms]";

export type PaymentSuccessCelebrationProps = {
  /** Secondary line under “Payment successful”. */
  subline: string;
  /** Shown after “Up next:” in the amber strip. */
  upNextDetail: string;
  /** Primary bottom button label. */
  ctaLabel: string;
  /** Where the primary CTA navigates. */
  ctaHref: string;
};

function BookingSuccessCarCard({ compact }: { compact: boolean }) {
  const imgWrap = compact ? "h-9 w-14" : "h-[45px] w-20";
  const imgSize = compact ? "h-9 max-h-9 w-14" : "h-[45px] w-full max-w-[80px]";
  const titleClass = compact
    ? "text-xs font-medium leading-4 text-[#121212]"
    : "text-sm font-medium leading-5 text-[#121212]";
  const line2 = compact
    ? "mt-0 text-[10px] font-normal leading-[14px] text-[#4b4b4b]"
    : "mt-0.5 text-xs font-normal leading-[18px] text-[#4b4b4b]";
  const line3 = compact
    ? "mt-0 text-[10px] font-normal leading-[14px] text-[#4b4b4b]"
    : "mt-0.5 text-xs font-normal leading-[18px] text-[#4b4b4b]";

  return (
    <div
      className={
        compact
          ? "mt-2 flex w-full max-w-[320px] items-center gap-2 rounded-xl border border-[#e8e8e8] bg-white px-2.5 py-2 shadow-[var(--shadow-card)]"
          : "payment-success-stagger flex min-h-[84px] w-full items-center gap-3 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-3 shadow-[var(--shadow-card)]"
      }
    >
      <div className={`relative flex shrink-0 items-center justify-center overflow-hidden ${imgWrap}`}>
        <Image
          src={hyundaiCretaThumb}
          alt=""
          width={80}
          height={45}
          className={`${imgSize} object-contain object-center`}
          sizes="80px"
          priority
        />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className={titleClass}>Hyundai Creta</p>
        <p className={line2}>1.5 X-Line AT Diesel</p>
        <p className={line3}>Starry Night</p>
      </div>
    </div>
  );
}

/**
 * Booking payment success — centered celebration (aligned with down payment success sizing),
 * then compact top band (~30vh), separator, Shivi (no card), how it works, footer CTA.
 * Used by `/payment/booking-success` only (`down-payment-success` uses `DownPaymentInstalmentSuccess`).
 */
export function PaymentSuccessCelebration({
  subline,
  upNextDetail,
  ctaLabel,
  ctaHref,
}: PaymentSuccessCelebrationProps) {
  const router = useRouter();
  const [lottieData, setLottieData] = useState<unknown>(null);
  const [lottieFetchComplete, setLottieFetchComplete] = useState(false);
  const [layoutPhase, setLayoutPhase] = useState<"centered" | "compact">("centered");
  const [showHeadlineBlock, setShowHeadlineBlock] = useState(false);
  const [showCarCard, setShowCarCard] = useState(false);
  const [showShiviSection, setShowShiviSection] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [rmIntroTypingComplete, setRmIntroTypingComplete] = useState(false);
  const headlineRevealHandledRef = useRef(false);
  const lottiePlayerRef = useRef<LottieRefCurrentProps | null>(null);

  const isCentered = layoutPhase === "centered";

  const revealHeadlineAfterAnimation = useCallback(() => {
    if (headlineRevealHandledRef.current) return;
    headlineRevealHandledRef.current = true;
    setShowHeadlineBlock(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(LOTTIE_TICK_URL, { priority: "high" } as RequestInit)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setLottieData(data);
      })
      .catch(() => {
        if (!cancelled) setLottieData(null);
      })
      .finally(() => {
        if (!cancelled) setLottieFetchComplete(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Static ✓ fallback: no onComplete — reveal headline on a timer after we know JSON failed. */
  useEffect(() => {
    if (!lottieFetchComplete || lottieData) return;
    const id = window.setTimeout(revealHeadlineAfterAnimation, FALLBACK_HEADLINE_REVEAL_MS);
    return () => clearTimeout(id);
  }, [lottieFetchComplete, lottieData, revealHeadlineAfterAnimation]);

  useEffect(() => {
    if (!showHeadlineBlock) return;
    const id = window.setTimeout(() => setShowCarCard(true), REVEAL_CAR_AFTER_HEADLINE_MS);
    return () => clearTimeout(id);
  }, [showHeadlineBlock]);

  useEffect(() => {
    if (!showCarCard) return;
    const id = window.setTimeout(
      () => setLayoutPhase("compact"),
      CENTERED_HOLD_BEFORE_COMPACT_MS,
    );
    return () => clearTimeout(id);
  }, [showCarCard]);

  useEffect(() => {
    if (layoutPhase !== "compact") return;
    const id = window.setTimeout(() => setShowShiviSection(true), SHIVI_ENTER_AFTER_COMPACT_MS);
    return () => clearTimeout(id);
  }, [layoutPhase]);

  const handleRmTypingComplete = useCallback(() => {
    setRmIntroTypingComplete(true);
  }, []);

  useEffect(() => {
    if (!rmIntroTypingComplete) return;
    const id = window.setTimeout(() => setShowHowItWorks(true), HOW_IT_WORKS_AFTER_TYPING_MS);
    return () => clearTimeout(id);
  }, [rmIntroTypingComplete]);

  useEffect(() => {
    if (!showHowItWorks) return;
    const id = window.setTimeout(() => setShowFooter(true), FOOTER_REVEAL_AFTER_HOW_IT_WORKS_MS);
    return () => clearTimeout(id);
  }, [showHowItWorks]);

  const lottieBlock = (
    <div
      className={`relative flex shrink-0 items-center justify-center ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isCentered ? "h-[144px] w-[144px]" : "h-[64px] w-[64px]"
      }`}
      style={{
        transitionProperty: "width, height",
        transitionDuration: `${LOTTIE_DIMENSION_TRANSITION_MS}ms`,
      }}
    >
      {lottieData ? (
        <Lottie
          lottieRef={lottiePlayerRef}
          animationData={lottieData}
          loop={false}
          onComplete={revealHeadlineAfterAnimation}
          onDOMLoaded={() => {
            lottiePlayerRef.current?.setSpeed(LOTTIE_PLAYBACK_SPEED);
          }}
          className={`h-full w-full origin-center ${
            isCentered ? "" : "scale-[calc(64/56)]"
          }`}
          aria-label="Payment successful animation"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-full bg-[#22c55e] text-4xl text-white shadow-[0_0_48px_rgba(34,197,94,0.45)]"
          aria-hidden
        >
          ✓
        </div>
      )}
    </div>
  );

  const headlineRevealed = !isCentered || showHeadlineBlock;
  const carRevealed = !isCentered || showCarCard;

  const titleBlock = (
    <motion.div
      initial={false}
      animate={{
        opacity: headlineRevealed ? 1 : 0,
        y: headlineRevealed ? 0 : 8,
      }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      className={`flex w-full flex-col items-center text-center ${
        isCentered && !showHeadlineBlock ? "pointer-events-none" : ""
      }`}
      aria-hidden={isCentered && !showHeadlineBlock ? true : undefined}
    >
      <h1
        className={`font-semibold tracking-tight text-[#1a1a1a] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isCentered ? "mt-2 text-[24px] leading-7" : "mt-1 text-base leading-6"
        }`}
      >
        Payment successful
      </h1>
      <p
        className={`max-w-sm font-normal text-[#6b7280] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isCentered ? "mt-3 text-sm leading-5" : "mt-0.5 text-xs leading-[18px]"
        }`}
      >
        {subline}
      </p>
    </motion.div>
  );

  return (
    <div className="relative min-h-dvh overflow-hidden bg-white font-sans">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[240px] w-full max-w-[360px] -translate-x-1/2"
        aria-hidden
      >
        <Image
          src={BOOKING_PAYMENT_SUCCESS_HERO}
          alt=""
          fill
          className="object-cover object-top"
          priority
          sizes="360px"
          unoptimized
        />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <motion.div
          layout
          transition={{ layout: { duration: LAYOUT_TRANSITION_DURATION_S, ease: [0.4, 0, 0.2, 1] } }}
          className={
            isCentered
              ? "flex min-h-dvh w-full flex-col justify-center px-4"
              : "flex w-full shrink-0 flex-col items-center border-b border-[#e8e8e8] px-4 py-6"
          }
        >
          <div className="mx-auto flex w-full max-w-md flex-col items-center">
            {lottieBlock}
            {titleBlock}
            <motion.div
              initial={false}
              animate={{
                opacity: carRevealed ? 1 : 0,
                y: carRevealed ? 0 : 10,
              }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              className={`${
                isCentered ? "w-full max-w-md px-0 pt-8" : "w-full max-w-[320px] pt-2"
              } ${isCentered && !showCarCard ? "pointer-events-none" : ""}`}
              aria-hidden={isCentered && !showCarCard ? true : undefined}
            >
              <BookingSuccessCarCard compact={!isCentered} />
            </motion.div>
          </div>
        </motion.div>

        {!isCentered ? (
          <div
            className={`mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-4 ${
              showFooter ? "pb-[calc(112px+env(safe-area-inset-bottom))]" : "pb-10"
            }`}
          >
            {showShiviSection ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center pt-6 text-center"
              >
                <div className="h-[78px] w-[78px] shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5]">
                  <Image
                    src={shiviAvatar}
                    alt=""
                    width={78}
                    height={78}
                    className="h-full w-full object-cover"
                    sizes="78px"
                  />
                </div>
                <p className="mt-4 text-sm font-medium leading-5 text-[#121212]">Hi Sharath,</p>
                <WordByWordLine
                  text={RM_INTRO_COPY}
                  wordDelayMs={RM_WORD_DELAY_MS}
                  className="mt-2 max-w-sm text-center text-sm font-normal leading-5 text-[#121212]"
                  wordOpacityDurationClassName={WORD_OPACITY_DURATION_CLASS}
                  onComplete={handleRmTypingComplete}
                />
              </motion.div>
            ) : null}

            {showHowItWorks ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="mt-8 -mx-4 w-[calc(100%+2rem)] max-w-none bg-[#f5f5f5] px-4 pb-8 pt-5"
              >
                <h2 className="text-center text-base font-semibold leading-[22px] text-[#121212]">
                  Here is how it works
                </h2>
                <div className="relative mx-auto mt-4 h-[180px] w-full max-w-[320px] overflow-hidden rounded-2xl border border-[#e8e8e8]">
                  <Image
                    src={HOW_IT_WORKS_POSTER}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/60" aria-hidden />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={HOW_IT_WORKS_PLAY}
                      alt="Play video"
                      width={40}
                      height={40}
                      className="h-10 w-10"
                      unoptimized
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        ) : null}
      </div>

      {showFooter ? (
        <div
          className="payment-success-stagger fixed bottom-0 left-0 right-0 z-10 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_0_rgba(54,53,76,0.08)]"
          style={{ animationDelay: "80ms" }}
        >
          <div className="mx-auto w-full max-w-[360px]">
            <div className="flex h-8 items-center justify-center bg-[#fff7e5] px-5">
              <p className="text-center text-xs leading-[18px] text-[#121212]">
                <span className="font-medium">Up next:</span>
                <span className="font-normal">{upNextDetail}</span>
              </p>
            </div>
            <div className="flex h-20 flex-col bg-white px-5 pb-5 pt-3">
              <button
                type="button"
                onClick={() => router.push(ctaHref)}
                className="primary-cta focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3395ff] focus-visible:ring-offset-2"
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
