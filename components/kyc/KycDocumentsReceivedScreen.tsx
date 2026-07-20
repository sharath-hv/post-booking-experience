"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";

import { DOWN_PAYMENT_SUCCESS_AUTO_REDIRECT_MS } from "@/components/payment/DownPaymentInstalmentSuccess";
import {
  BOOKING_PAYMENT_SUCCESS_HERO,
  BOOKING_SUCCESS_LOTTIE_TICK_DATA,
} from "@/components/payment/booking-success-shared";
import { SUCCESS_SCREEN_HEADLINE_SUBTEXT_GAP_CLASS } from "@/components/ui/success-screen-layout";
import styles from "./KycDocumentsReceivedScreen.module.scss";


type KycDocumentsReceivedScreenProps = {
  /** Auto-advance destination (KYC flow defaults to verification in progress). */
  okayHref?: string;
};

/**
 * Documents received — Figma Post-booking-experience / node 1880:6801.
 * No CTA; same Lottie + hero layout as payment received; auto-advances after 3s.
 */
export function KycDocumentsReceivedScreen({
  okayHref = "/kyc/verification-in-progress",
}: KycDocumentsReceivedScreenProps) {
  const router = useRouter();
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (hasNavigatedRef.current) return;
      hasNavigatedRef.current = true;
      router.replace(okayHref);
    }, DOWN_PAYMENT_SUCCESS_AUTO_REDIRECT_MS);
    return () => window.clearTimeout(id);
  }, [okayHref, router]);

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
                aria-label="Documents received animation"
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
              Documents received
            </h1>
            <p className={styles.max_w_sm_9}>
              We are on it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
