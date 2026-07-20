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
import { useLoanApplicationBank } from "@/components/payment/loan-application/use-loan-application-bank";
import { loanProcessingPath } from "@/lib/loan-application-urls";
import styles from "./LoanApplicationSubmittedSuccessScreen.module.scss";


/** Auto-advance from loan submit success to loan processing. */
export const LOAN_APPLICATION_SUBMITTED_AUTO_REDIRECT_MS = 3000;

/**
 * Your application is on its way acknowledgment — no CTA; auto-navigates after 3 seconds.
 */
export function LoanApplicationSubmittedSuccessScreen() {
  const router = useRouter();
  const { bankId, bank } = useLoanApplicationBank();

  useEffect(() => {
    const redirect = window.setTimeout(() => {
      router.push(loanProcessingPath(bankId));
    }, LOAN_APPLICATION_SUBMITTED_AUTO_REDIRECT_MS);
    return () => window.clearTimeout(redirect);
  }, [bankId, router]);

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
                aria-label="Loan application submitted animation"
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
              Loan application submitted
            </h1>
            <p className={styles.max_w_sm_9}>
              I&apos;ve sent it to {bank.name}. I&apos;ll chase the review and keep you posted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
