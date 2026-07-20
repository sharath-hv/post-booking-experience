"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Lottie from "lottie-react";

import {
  BOOKING_PAYMENT_SUCCESS_HERO,
  BOOKING_SUCCESS_LOTTIE_TICK_DATA,
} from "@/components/payment/booking-success-shared";
import { SUCCESS_SCREEN_HEADLINE_SUBTEXT_GAP_CLASS } from "@/components/ui/success-screen-layout";
import styles from "./FullPaymentOptionConfirmedScreen.module.scss";


/** Auto-advance to the full-payment action screen. */
export const FULL_PAYMENT_OPTION_CONFIRMED_AUTO_REDIRECT_MS = 3000;

const FULL_PAYMENT_ACTION_PATH = "/payment/full-payment-confirmed";

/**
 * Full payment — brief success ack after confirm bottom sheet ([Figma ACKO finance confirmed pattern](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience));
 * auto-navigates to {@link FullPaymentConfirmedScreen}.
 */
export function FullPaymentOptionConfirmedScreen() {
  const router = useRouter();

  useEffect(() => {
    const redirect = window.setTimeout(() => {
      router.push(FULL_PAYMENT_ACTION_PATH);
    }, FULL_PAYMENT_OPTION_CONFIRMED_AUTO_REDIRECT_MS);
    return () => window.clearTimeout(redirect);
  }, [router]);

  return (
    <div className={styles.relative_0}>
      <div
        className={styles.pointer_events_none_1}
        aria-hidden
      >
        <Image
          src={BOOKING_PAYMENT_SUCCESS_HERO}
          alt=""
          fill
          className={styles.object_cover_2}
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          unoptimized
        />
      </div>

      <div className={styles.relative_3}>
        <div className={styles._translate_y_8_4}>
          <div className={styles.relative_5}>
            {BOOKING_SUCCESS_LOTTIE_TICK_DATA ? (
              <Lottie
                animationData={BOOKING_SUCCESS_LOTTIE_TICK_DATA}
                loop={false}
                className={styles.h_full_6}
                aria-label="Success animation"
              />
            ) : (
              <div
                className={styles.flex_7}
                aria-hidden
              >
                ✓
              </div>
            )}
          </div>
          <div
            className={cn(styles.mt_2_0, SUCCESS_SCREEN_HEADLINE_SUBTEXT_GAP_CLASS)}
          >
            <h1 className={styles.text_24px__8}>
              Payment option confirmed
            </h1>
            <p className={styles.max_w_sm_9}>
              You are paying the full ACKO Drive price
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
