"use client";

import { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Lottie from "lottie-react";

import { BookingCarCardDetails } from "@/components/kyc/BookingCarCardDetails";
import {
  BOOKING_CAR_CARD_SHELL_CLASS,
  BOOKING_CAR_HERO_HEIGHT_CLASS,
  BOOKING_CAR_HERO_HEIGHT_VIN_CLASS,
  BOOKING_CAR_SUMMARY_PANEL_CLASS,
  BOOKING_CAR_SUMMARY_PANEL_OVER_HERO_CLASS,
  BOOKING_CAR_SUMMARY_PANEL_POSITION_CLASS,
  BookingCarCardBackdrop,
  BookingCarSummaryCardVisualStage,
} from "@/components/kyc/BookingCarSummaryCard";
import { BOOKING_CONFIRMED_ASSETS } from "@/components/kyc/kyc-booking-confirmed-assets";
import {
  CELEBRATION_LOTTIE_TO_HEADLINE_MT,
  HERO_ICON_TOP_PT,
  SUCCESS_SCREEN_HEADLINE_SUBTEXT_GAP_CLASS,
} from "@/components/ui/success-screen-layout";
import { PaymentSuccessStagger } from "@/components/ui/stagger-container";
import { cn } from "@/lib/utils";

import bookingSuccessLottie from "./lottie/booking-success.json";
import styles from "./BookingCelebrationSuccessScreen.module.scss";


/** Default: booking-success Lottie (~one play-through if `complete` never fires). */
const DEFAULT_LOTTIE_FALLBACK_MS = 1600;
/** Header → car section (kept short; images preload on mount). */
const CAR_REVEAL_DELAY_MS = 180;

const CAR_MODEL = "Creta";

function assetHref(src: string | StaticImageData) {
  return typeof src === "string" ? src : src.src;
}

function usePreloadBookingImages(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const hrefs = [
      assetHref(BOOKING_CONFIRMED_ASSETS.cardBackdrop),
      BOOKING_CONFIRMED_ASSETS.carCutout,
    ];
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
  /**
   * With no custom card yet, omit the default booked-car card (modify-selection snapshot loading).
   */
  holdCarCardUntilCustom?: boolean;
  /** Route for the primary CTA. */
  okayPath: string;
  /** Primary bottom button label (default **Continue**). */
  ctaLabel?: string;
  /** Override bundled success animation (default: booking-success). */
  lottieAnimation?: unknown;
  /**
   * Max wait before revealing headline if `onComplete` does not fire (ms).
   * Match ~one loop of the chosen animation (e.g. 90f @ 30fps ≈ 3200).
   */
  lottieFallbackMs?: number;
  /** Called once when the headline block is revealed (after Lottie). */
  onHeadlineReveal?: () => void;
  /**
   * When set, shows the “Up next” strip above the primary CTA (Figma 1708:6415).
   * e.g. `"Car allocation"`.
   */
  upNextText?: string;
  /** When both set, shows a divider under express delivery with engine and chassis numbers. */
  vehicleEngineNo?: string;
  vehicleChassisNo?: string;
};

/**
 * Shared success layout: Lottie tick → headline → car summary card → Continue CTA.
 * Used by KYC booking confirmed and ACKO Drive finance confirmation.
 */
export function BookingCelebrationSuccessScreen({
  headline,
  belowHeadline,
  replaceCarCardWith,
  holdCarCardUntilCustom = false,
  okayPath,
  ctaLabel = "Continue",
  lottieAnimation,
  lottieFallbackMs = DEFAULT_LOTTIE_FALLBACK_MS,
  onHeadlineReveal,
  upNextText,
  vehicleEngineNo,
  vehicleChassisNo,
}: BookingCelebrationSuccessScreenProps) {
  const showVehicleIdentification =
    vehicleEngineNo != null &&
    vehicleEngineNo.length > 0 &&
    vehicleChassisNo != null &&
    vehicleChassisNo.length > 0;
  const router = useRouter();
  const showDefaultCarCard = replaceCarCardWith == null && !holdCarCardUntilCustom;
  const showCustomCarCard = replaceCarCardWith != null;
  const showCarSection = showDefaultCarCard || showCustomCarCard;
  const contentScrollClass =
    showCustomCarCard ? styles.overflowYAuto : styles.overflowHidden;
  usePreloadBookingImages(showDefaultCarCard);

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
    onHeadlineReveal?.();
    const id = window.setTimeout(() => setShowCar(true), CAR_REVEAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [showHeader, onHeadlineReveal]);

  return (
    <div className={styles.relative_0}>
      <div
        className={styles.pointer_events_none_1}
        aria-hidden
      />

      <div
        className={cn(styles.relative_0_0, HERO_ICON_TOP_PT, styles.transition_all_0)}
      >
        <div
          className={cn(styles.mx_auto_1, contentScrollClass)}
        >
          <div className={styles.flex_2}>
            <div className={styles.relative_3}>
              <Lottie
                key={lottieAnimation != null ? "custom-lottie" : "booking-success"}
                animationData={animationData}
                loop={false}
                className={styles.h_full_4}
                aria-label="Success animation"
                onComplete={handleAnimationFinished}
              />
            </div>

            {showHeader && (
              <PaymentSuccessStagger
                className={cn(CELEBRATION_LOTTIE_TO_HEADLINE_MT, styles.flex_2_0, SUCCESS_SCREEN_HEADLINE_SUBTEXT_GAP_CLASS)}
                delay={0.2}
              >
                <h1 className={styles.text_center_5}>
                  {headline}
                </h1>
                {belowHeadline != null && (
                  <PaymentSuccessStagger className={styles.w_full_6} delay={0.4}>
                    {belowHeadline}
                  </PaymentSuccessStagger>
                )}
              </PaymentSuccessStagger>
            )}
          </div>

          {showCar &&
            showCarSection &&
            (showDefaultCarCard ? (
              <PaymentSuccessStagger
                className={cn(styles.relative_15, BOOKING_CAR_CARD_SHELL_CLASS)}
                delay={0.6}
              >
                <div
                  className={cn(styles.relative_3_0, showVehicleIdentification
                      ? BOOKING_CAR_HERO_HEIGHT_VIN_CLASS
                      : BOOKING_CAR_HERO_HEIGHT_CLASS)}
                >
                  {showVehicleIdentification ? <BookingCarCardBackdrop /> : null}
                  <BookingCarSummaryCardVisualStage showBackdrop={!showVehicleIdentification} />
                  <div
                    className={
                      showVehicleIdentification
                        ? cn(BOOKING_CAR_SUMMARY_PANEL_OVER_HERO_CLASS, BOOKING_CAR_SUMMARY_PANEL_CLASS)
                        : cn(BOOKING_CAR_SUMMARY_PANEL_POSITION_CLASS, BOOKING_CAR_SUMMARY_PANEL_CLASS)
                    }
                  >
                    <BookingCarCardDetails
                      engineNo={showVehicleIdentification ? vehicleEngineNo : undefined}
                      chassisNo={showVehicleIdentification ? vehicleChassisNo : undefined}
                    />
                  </div>
                </div>
              </PaymentSuccessStagger>
            ) : (
              <PaymentSuccessStagger
                className={styles.mt_8_7}
                delay={0.6}
              >
                {replaceCarCardWith}
              </PaymentSuccessStagger>
            ))}
        </div>
      </div>

      {showCar && (
        <PaymentSuccessStagger
          className={styles.z_10_8}
          delay={0.8}
        >
          <div className={styles.mx_auto_9}>
            {upNextText != null && upNextText.length > 0 && (
              <div className={styles.flex_10}>
                <p className={styles.text_center_11}>
                  <span className={styles.font_medium_12}>Up next:</span>
                  <span>{` ${upNextText}`}</span>
                </p>
              </div>
            )}
            <div className={styles.px_5_13}>
              <button
                type="button"
                className={[styles.primary_cta_14, "primary-cta"].filter(Boolean).join(" ")}
                onClick={() => router.push(okayPath)}
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </PaymentSuccessStagger>
      )}
    </div>
  );
}

/** @internal — shared demo constants for headlines that mention the car model */
export const BOOKING_CELEBRATION_CAR_MODEL = CAR_MODEL;
