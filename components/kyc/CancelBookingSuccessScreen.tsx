"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import infoIcon from "@/assets/Info.svg";
import bookingCancelledHero from "@/assets/Booking cancelled.svg";
import { CANCEL_BOOKING_SUCCESS_COPY } from "@/lib/cancel-booking-success-content";
import { WordByWordLine } from "@/components/payment/WordByWordLine";
import styles from "./CancelBookingSuccessScreen.module.scss";

import {
  SUCCESS_SCREEN_HEADLINE_SUBTEXT_GAP_CLASS,
} from "@/components/ui/success-screen-layout";

const HEADLINE_WORD_DELAY_MS = 135;
const HERO_FADE_DURATION_CLASS = styles.heroFadeDuration;
const SUBLINE_TO_CTA_DELAY_MS = 240;

/**
 * User-initiated cancel success — celebration layout with fixed bottom CTA.
 */
export function CancelBookingSuccessScreen() {
  const router = useRouter();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [heroArtReady, setHeroArtReady] = useState(false);
  const [showSubline, setShowSubline] = useState(false);
  const [showCta, setShowCta] = useState(false);

  const onHeadlineComplete = useCallback(() => {
    setShowSubline(true);
    window.setTimeout(() => setShowCta(true), SUBLINE_TO_CTA_DELAY_MS);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) {
      setHeroArtReady(true);
      setShowSubline(true);
      setShowCta(true);
    }
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setTimeout(() => {
      setHeroArtReady((ready) => (ready ? ready : true));
    }, 2800);
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  useEffect(() => {
    router.prefetch(CANCEL_BOOKING_SUCCESS_COPY.doneHref);
  }, [router]);

  return (
    <div className={styles.relative_0}>
      <div
        className={styles.pointer_events_none_1}
        aria-hidden
      />

      <div className={styles.relative_2}>
        <div className={styles._translate_y_8_3}>
          <div className={styles.relative_4}>
            <Image
              src={bookingCancelledHero}
              alt=""
              width={80}
              height={80}
              className={styles.h_20_5}
              priority
              unoptimized
              onLoad={() => setHeroArtReady(true)}
            />
          </div>

          <div className={cn(styles.mt_8_0, SUCCESS_SCREEN_HEADLINE_SUBTEXT_GAP_CLASS)}>
            {reduceMotion ? (
              <h1 className={styles.text_2xl_6}>
                {CANCEL_BOOKING_SUCCESS_COPY.headline}
              </h1>
            ) : (
              <WordByWordLine
                as="h1"
                ariaLabel={CANCEL_BOOKING_SUCCESS_COPY.headline}
                text={CANCEL_BOOKING_SUCCESS_COPY.headline}
                wordDelayMs={HEADLINE_WORD_DELAY_MS}
                wordOpacityDurationClassName={HERO_FADE_DURATION_CLASS}
                className={styles.text_2xl_6}
                onComplete={onHeadlineComplete}
                startWhen={heroArtReady}
              />
            )}
            <p
              className={cn(styles.max_w_sm_1, HERO_FADE_DURATION_CLASS, styles.ease_out_1, showSubline ? styles.opacity_100_1 : styles.opacity_0_1)}
              aria-hidden={!showSubline}
            >
              {CANCEL_BOOKING_SUCCESS_COPY.subline}
            </p>
          </div>

          <div
            className={cn(styles.mt_6_2, "card-elevated", HERO_FADE_DURATION_CLASS, styles.ease_out_2, showSubline ? styles.opacity_100_2 : styles.opacity_0_2)}
            aria-hidden={!showSubline}
          >
            <span className={styles.relative_7}>
              <Image
                src={infoIcon}
                alt=""
                fill
                className={styles.object_contain_8}
                unoptimized
                sizes="20px"
              />
            </span>
            <p className={styles.text_xs_9}>
              {CANCEL_BOOKING_SUCCESS_COPY.infoBox}
            </p>
          </div>
        </div>
      </div>

      <div
        className={cn(styles.fixed_3, "footer-elevated", HERO_FADE_DURATION_CLASS, styles.ease_out_3, showCta ? styles.opacity_100_3 : styles.pointer_events_none_3)}
        aria-hidden={!showCta}
      >
        <div className={styles.mx_auto_10}>
          <button
            type="button"
            className={[styles.primary_cta_11, "primary-cta"].filter(Boolean).join(" ")}
            tabIndex={showCta ? 0 : -1}
            onClick={() => router.push(CANCEL_BOOKING_SUCCESS_COPY.doneHref)}
          >
            {CANCEL_BOOKING_SUCCESS_COPY.ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
