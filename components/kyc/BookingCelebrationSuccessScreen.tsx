"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Lottie from "lottie-react";

import { BOOKING_CONFIRMED_ASSETS } from "@/components/kyc/kyc-booking-confirmed-assets";

import bookingSuccessLottie from "./lottie/booking-success.json";

/** Default: booking-success Lottie (~one play-through if `complete` never fires). */
const DEFAULT_LOTTIE_FALLBACK_MS = 1600;
/** Header → car section (kept short; images preload on mount). */
const CAR_REVEAL_DELAY_MS = 180;

const CAR_MODEL = "Creta";
const CAR_TITLE = "Hyundai Creta";
const CAR_VARIANT = "1.5 X-Line AT Diesel";
const CAR_COLOR = "Starry Night";
const DELIVERY_LINE = "Express delivery by 10 Jun '25";

function usePreloadBookingImages(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const hrefs = [BOOKING_CONFIRMED_ASSETS.cardBackdrop, BOOKING_CONFIRMED_ASSETS.carCutout];
    const links = hrefs.map((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });
    return () => links.forEach((el) => el.remove());
  }, [enabled]);
}

export type BookingCelebrationSuccessScreenProps = {
  /** Main headline below the Lottie (e.g. booking confirmed vs finance partner confirmed). */
  headline: string;
  /** Optional line(s) under the headline (e.g. banking partner + logo + Change). */
  belowHeadline?: ReactNode;
  /**
   * When set, replaces the default car summary card (e.g. ACKO Drive “What’s next” payment steps).
   */
  replaceCarCardWith?: ReactNode;
  /** Route for the primary “Okay” CTA. */
  okayPath: string;
  /** Override bundled success animation (default: booking-success). */
  lottieAnimation?: unknown;
  /**
   * Max wait before revealing headline if `onComplete` does not fire (ms).
   * Match ~one loop of the chosen animation (e.g. 90f @ 30fps ≈ 3200).
   */
  lottieFallbackMs?: number;
};

/**
 * Shared success layout: Lottie tick → headline → car summary card → Okay CTA.
 * Used by KYC booking confirmed and ACKO Drive finance confirmation.
 */
export function BookingCelebrationSuccessScreen({
  headline,
  belowHeadline,
  replaceCarCardWith,
  okayPath,
  lottieAnimation,
  lottieFallbackMs = DEFAULT_LOTTIE_FALLBACK_MS,
}: BookingCelebrationSuccessScreenProps) {
  const router = useRouter();
  const showCarCard = replaceCarCardWith == null;
  usePreloadBookingImages(showCarCard);

  const [showHeader, setShowHeader] = useState(false);
  const [showCar, setShowCar] = useState(false);
  const headerRevealFallbackRef = useRef<number | null>(null);
  const animationData = lottieAnimation ?? bookingSuccessLottie;

  const handleAnimationFinished = useCallback(() => {
    if (headerRevealFallbackRef.current != null) {
      window.clearTimeout(headerRevealFallbackRef.current);
      headerRevealFallbackRef.current = null;
    }
    setShowHeader(true);
  }, []);

  useEffect(() => {
    headerRevealFallbackRef.current = window.setTimeout(() => {
      headerRevealFallbackRef.current = null;
      setShowHeader(true);
    }, lottieFallbackMs);
    return () => {
      if (headerRevealFallbackRef.current != null) {
        window.clearTimeout(headerRevealFallbackRef.current);
        headerRevealFallbackRef.current = null;
      }
    };
  }, [lottieFallbackMs]);

  useEffect(() => {
    if (!showHeader) return;
    const id = window.setTimeout(() => setShowCar(true), CAR_REVEAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [showHeader]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#fafbfb] font-sans shadow-[0_-4px_8px_-2px_rgba(54,53,76,0.06)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-[#e8f8ef]/90 via-[#f4fbf7]/40 to-transparent transition-opacity duration-700"
        aria-hidden
      />

      <div className="relative flex min-h-dvh flex-col justify-start pt-10 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]">
        <div className="mx-auto flex min-h-0 w-full max-w-[360px] flex-1 flex-col overflow-y-auto px-5 pb-44">
          <div className="flex w-full flex-col items-center text-center">
            <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center">
              <Lottie
                key={lottieAnimation != null ? "custom-lottie" : "booking-success"}
                animationData={animationData}
                loop={false}
                className="h-full w-full"
                aria-label="Success animation"
                onComplete={handleAnimationFinished}
              />
            </div>

            {showHeader && (
              <div className="payment-success-stagger mt-[24px] flex w-full max-w-[320px] flex-col items-center">
                <h1 className="text-center text-[24px] font-semibold leading-8 tracking-[-0.1px] text-[#121212]">
                  {headline}
                </h1>
                {belowHeadline != null && (
                  <div className="payment-success-stagger mt-3 w-full text-center">{belowHeadline}</div>
                )}
              </div>
            )}
          </div>

          {showCar &&
            (showCarCard ? (
              <div
                className="payment-success-stagger relative mt-8 w-full max-w-[320px] self-center overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                style={{ animationDelay: "0ms" }}
              >
                <div className="relative h-[244px] w-full overflow-hidden bg-white">
                  <div aria-hidden className="absolute inset-0">
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={BOOKING_CONFIRMED_ASSETS.cardBackdrop}
                        alt=""
                        fill
                        className="object-cover"
                        style={{ objectPosition: "center 28%" }}
                        sizes="320px"
                        priority
                      />
                    </div>
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, rgba(255,255,255,0) 65%, rgba(255,255,255,0.7) 100%), linear-gradient(180deg, rgb(255,255,255) 10%, rgba(255,255,255,0) 48%)",
                      }}
                    />
                  </div>

                  <div className="absolute left-1/2 top-[30px] h-[102px] w-[180px] -translate-x-1/2 overflow-hidden">
                    <div className="relative mx-auto h-full w-full max-w-[180px]">
                      <Image
                        src={BOOKING_CONFIRMED_ASSETS.carCutout}
                        alt=""
                        fill
                        className="object-contain object-bottom"
                        sizes="180px"
                        priority
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-1/2 w-[calc(100%-16px)] max-w-[304px] -translate-x-1/2 overflow-hidden rounded-xl border border-white/60 bg-white/90 shadow-sm backdrop-blur-[12px]">
                    <div className="px-3 py-3 text-left">
                      <p className="text-base font-medium leading-6 text-[#121212]">{CAR_TITLE}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs leading-[18px] text-[#121212]">
                        <span>{CAR_VARIANT}</span>
                        <span className="relative h-1 w-1 shrink-0" aria-hidden>
                          <Image
                            src={BOOKING_CONFIRMED_ASSETS.dotSeparator}
                            alt=""
                            width={4}
                            height={4}
                            className="h-1 w-1"
                          />
                        </span>
                        <span>{CAR_COLOR}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <p className="text-xs font-normal leading-[18px] text-[#5920c5]">{DELIVERY_LINE}</p>
                        <span className="relative h-4 w-4 shrink-0" aria-hidden>
                          <Image
                            src={BOOKING_CONFIRMED_ASSETS.expressDelivery}
                            alt=""
                            width={16}
                            height={16}
                            className="h-4 w-4 object-contain"
                            unoptimized
                            sizes="16px"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="payment-success-stagger mt-8 w-full max-w-[360px] self-center"
                style={{ animationDelay: "0ms" }}
              >
                {replaceCarCardWith}
              </div>
            ))}
        </div>
      </div>

      {showCar && (
        <div
          className="payment-success-stagger fixed bottom-0 left-0 right-0 z-10 border-t border-transparent bg-[#FFFFFF] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_8px_-2px_rgba(54,53,76,0.06)]"
          style={{ animationDelay: "120ms" }}
        >
          <div className="mx-auto w-full max-w-[360px]">
            <button
              type="button"
              className="primary-cta focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/30 focus-visible:ring-offset-2"
              onClick={() => router.push(okayPath)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** @internal — shared demo constants for headlines that mention the car model */
export const BOOKING_CELEBRATION_CAR_MODEL = CAR_MODEL;
