"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CancelBookingCarCard } from "@/components/kyc/CancelBookingCarCard";
import { CancelBookingReasonBottomSheet } from "@/components/kyc/CancelBookingReasonBottomSheet";
import { CancelBookingRefundSummaryCard } from "@/components/kyc/CancelBookingRefundSummaryCard";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import {
  CANCEL_BOOKING_CONFIRM_CTA,
  CANCEL_BOOKING_CONFIRM_OVERLINE,
  CANCEL_BOOKING_MODIFY_CTA,
  CANCEL_BOOKING_MODIFY_PROMPT,
  CANCEL_BOOKING_STILL_CANCEL_PROMPT,
  CANCEL_BOOKING_SUCCESS_HREF,
  resolveCancelBookingCarDetails,
  resolveCancelBookingHeadline,
  type CancelBookingCarDetails,
  type CancelBookingReasonId,
} from "@/lib/cancel-booking-content";
import { CANCEL_BOOKING_STAGGER_MS } from "@/lib/cancel-booking-stagger";
import styles from "./CancelBookingConfirmScreen.module.scss";


const {
  overline: STAGGER_OVERLINE_MS,
  headline: STAGGER_HEADLINE_MS,
  carCard: STAGGER_CAR_CARD_MS,
  modifyPrompt: STAGGER_MODIFY_PROMPT_MS,
  modifyCta: STAGGER_MODIFY_CTA_MS,
  stillCancelPrompt: STAGGER_STILL_CANCEL_MS,
  refundCard: STAGGER_REFUND_CARD_MS,
  confirmCta: STAGGER_CONFIRM_CTA_MS,
} = CANCEL_BOOKING_STAGGER_MS;

/**
 * Full-page cancel confirmation — Figma Post-booking-experience / node 2709:17395.
 */
export function CancelBookingConfirmScreen() {
  const router = useRouter();
  const [headline, setHeadline] = useState("You have come a long way to get your Creta");
  const [carDetails, setCarDetails] = useState<CancelBookingCarDetails>(
    resolveCancelBookingCarDetails,
  );
  const [reasonSheetOpen, setReasonSheetOpen] = useState(false);

  useEffect(() => {
    setHeadline(resolveCancelBookingHeadline());
    setCarDetails(resolveCancelBookingCarDetails());
  }, []);

  const onGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const onOpenReasonSheet = useCallback(() => {
    setReasonSheetOpen(true);
  }, []);

  const onReasonSheetConfirm = useCallback(
    (_: CancelBookingReasonId) => {
      setReasonSheetOpen(false);
      router.push(CANCEL_BOOKING_SUCCESS_HREF);
    },
    [router],
  );

  return (
    <div className={styles.relative_0}>
      <div className={styles.relative_1}>
        <KycTopNavHeader onBack={onGoBack} transparent />

        <main className={styles.flex_2}>
          <section className={styles.px_5_3}>
            <p
              className={[styles.payment_success_stagger_4, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${STAGGER_OVERLINE_MS}ms` }}
            >
              {CANCEL_BOOKING_CONFIRM_OVERLINE}
            </p>

            <h1
              className={[styles.payment_success_stagger_5, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${STAGGER_HEADLINE_MS}ms` }}
            >
              {headline}
            </h1>

            <div
              className={[styles.payment_success_stagger_6, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${STAGGER_CAR_CARD_MS}ms` }}
            >
              <CancelBookingCarCard details={carDetails} />
            </div>
          </section>

          <section className={styles.px_5_7}>
            <p
              className={[styles.payment_success_stagger_8, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${STAGGER_MODIFY_PROMPT_MS}ms` }}
            >
              {CANCEL_BOOKING_MODIFY_PROMPT}
            </p>

            <button
              type="button"
              className={[styles.payment_success_stagger_9, "payment-success-stagger", "demo-nav-cta"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${STAGGER_MODIFY_CTA_MS}ms` }}
            >
              {CANCEL_BOOKING_MODIFY_CTA}
            </button>

            <p
              className={[styles.payment_success_stagger_10, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${STAGGER_STILL_CANCEL_MS}ms` }}
            >
              {CANCEL_BOOKING_STILL_CANCEL_PROMPT}
            </p>

            <div
              className={[styles.payment_success_stagger_11, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${STAGGER_REFUND_CARD_MS}ms` }}
            >
              <CancelBookingRefundSummaryCard />
            </div>

            <button
              type="button"
              onClick={onOpenReasonSheet}
              className={[styles.payment_success_stagger_9, "payment-success-stagger", "demo-nav-cta"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${STAGGER_CONFIRM_CTA_MS}ms` }}
            >
              {CANCEL_BOOKING_CONFIRM_CTA}
            </button>
          </section>
        </main>
      </div>

      <CancelBookingReasonBottomSheet
        open={reasonSheetOpen}
        onClose={() => setReasonSheetOpen(false)}
        onConfirm={onReasonSheetConfirm}
      />
    </div>
  );
}
