"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import Lottie from "lottie-react";

import {
  ackoDriveFinanceActionPath,
  bankForQueryParam,
} from "@/components/payment/acko-drive-finance-bank";
import {
  BOOKING_PAYMENT_SUCCESS_HERO,
  BOOKING_SUCCESS_LOTTIE_TICK_DATA,
} from "@/components/payment/booking-success-shared";
import { SUCCESS_SCREEN_HEADLINE_SUBTEXT_GAP_CLASS } from "@/components/ui/success-screen-layout";
import styles from "./AckoDriveFinanceConfirmedScreen.module.scss";


/** Auto-advance to the loan-application action screen. */
export const ACKO_DRIVE_FINANCE_CONFIRMED_AUTO_REDIRECT_MS = 3000;

/**
 * ACKO Drive finance confirmed — brief success ack (same illustration as payment received);
 * auto-navigates to the action screen.
 */
export function AckoDriveFinanceConfirmedScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);

  const nextHref = useMemo(() => ackoDriveFinanceActionPath(bank.id), [bank.id]);

  useEffect(() => {
    const redirect = window.setTimeout(() => {
      router.push(nextHref);
    }, ACKO_DRIVE_FINANCE_CONFIRMED_AUTO_REDIRECT_MS);
    return () => window.clearTimeout(redirect);
  }, [nextHref, router]);

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
              You are financing with ACKO Drive via {bank.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
