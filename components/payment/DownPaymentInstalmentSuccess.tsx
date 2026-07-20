"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";

import {
  BOOKING_PAYMENT_SUCCESS_HERO,
  BOOKING_SUCCESS_LOTTIE_TICK_DATA,
} from "@/components/payment/booking-success-shared";
import { SUCCESS_SCREEN_HEADLINE_SUBTEXT_GAP_CLASS } from "@/components/ui/success-screen-layout";
import styles from "./DownPaymentInstalmentSuccess.module.scss";


/** Auto-advance: pay-down-payment (partial) or insurance setup (complete). */
export const DOWN_PAYMENT_SUCCESS_AUTO_REDIRECT_MS = 3000;

export type DownPaymentInstalmentSuccessProps = {
  /** Detail under the main title. */
  subline: string;
  nextHref: string;
  /** Page background. Defaults to white. */
  backgroundClassName?: string;
};

/**
 * Down payment instalment acknowledgment — no CTA; auto-navigates after 3 seconds.
 */
export function DownPaymentInstalmentSuccess({
  subline,
  nextHref,
  backgroundClassName = styles.bgPage,
}: DownPaymentInstalmentSuccessProps) {
  const router = useRouter();

  useEffect(() => {
    const redirect = window.setTimeout(() => {
      router.push(nextHref);
    }, DOWN_PAYMENT_SUCCESS_AUTO_REDIRECT_MS);
    return () => window.clearTimeout(redirect);
  }, [nextHref, router]);

  return (
    <div className={cn(styles.relative_0, backgroundClassName)}>
      <div
        className={styles.pointer_events_none_0}
        aria-hidden
      >
        <Image
          src={BOOKING_PAYMENT_SUCCESS_HERO}
          alt=""
          fill
          className={styles.object_cover_1}
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          unoptimized
        />
      </div>
      <div className={styles.relative_2}>
        <div className={styles._translate_y_8_3}>
          <div className={styles.relative_4}>
            {BOOKING_SUCCESS_LOTTIE_TICK_DATA ? (
              <Lottie
                animationData={BOOKING_SUCCESS_LOTTIE_TICK_DATA}
                loop={false}
                className={styles.h_full_5}
                aria-label="Payment received animation"
              />
            ) : (
              <div
                className={styles.flex_6}
                aria-hidden
              >
                ✓
              </div>
            )}
          </div>
          <div
            className={cn(styles.mt_2_1, SUCCESS_SCREEN_HEADLINE_SUBTEXT_GAP_CLASS)}
          >
            <h1 className={styles.text_24px__7}>
              Payment received
            </h1>
            <p className={styles.max_w_sm_8}>{subline}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
