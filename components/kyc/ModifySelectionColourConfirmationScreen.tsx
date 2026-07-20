"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import infoIcon from "@/assets/Info.svg";
import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import {
  MODIFY_SELECTION_BOOKING_AMOUNT_SECTION_ID,
  ModifySelectionReviewBookingAmountCard,
} from "@/components/kyc/ModifySelectionReviewBookingAmountCard";
import { ModifySelectionDeliveryOptionBottomSheet } from "@/components/kyc/ModifySelectionDeliveryOptionBottomSheet";
import { ModifySelectionReviewPaymentSummary } from "@/components/kyc/ModifySelectionReviewPaymentSummary";
import { ModifySelectionReviewSelectionCard } from "@/components/kyc/ModifySelectionReviewSelectionCard";
import { writeModifySelectionPendingFromSummary } from "@/lib/active-booking-snapshot";
import {
  buildBookingLockCheckoutHref,
  MODIFY_SELECTION_RETURN_SOURCE,
} from "@/lib/paymentUrls";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/lib/modify-selection-content";
import {
  clearModifySelectionColourPending,
  readModifySelectionColourPending,
  writeModifySelectionColourPending,
} from "@/lib/modify-selection-colour-pending";
import {
  findModifySelectionColourOption,
  MODIFY_SELECTION_COLOUR_CONFIRM_PAY_CTA,
  MODIFY_SELECTION_COLOUR_CONFIRM_TITLE,
  resolveModifySelectionColourQuote,
  type ModifySelectionDeliveryChoice,
} from "@/lib/modify-selection-colours-content";
import {
  buildModifySelectionColourReviewPaySummary,
  formatModifySelectionInr,
} from "@/lib/modify-selection-review-pay-content";
import { MODIFY_SELECTION_STAGGER_MS } from "@/lib/modify-selection-stagger";
import styles from "./ModifySelectionColourConfirmationScreen.module.scss";


/** Stagger: nav + footer CTA immediate; then title → selection → booking → price summary. */
const { title: STAGGER_TITLE_MS, section: STAGGER_SELECTION_MS, bookingAmount: STAGGER_BOOKING_MS, priceSummary: STAGGER_PRICE_MS } =
  MODIFY_SELECTION_STAGGER_MS;

/**
 * Review selection and pay — Figma 2699:9339.
 */
export function ModifySelectionColourConfirmationScreen() {
  const router = useRouter();
  const bookingAmountSectionRef = useRef<HTMLElement>(null);
  const [pending, setPending] = useState(() => readModifySelectionColourPending());
  const [deliverySheetOpen, setDeliverySheetOpen] = useState(false);

  useEffect(() => {
    setPending(readModifySelectionColourPending());
  }, []);

  const option = useMemo(() => {
    if (pending == null) return null;
    return findModifySelectionColourOption(pending.colourId) ?? null;
  }, [pending]);

  const deliveryChoice = pending?.deliveryChoice ?? "express";

  const summary = useMemo(() => {
    if (option == null || pending == null) return null;
    return buildModifySelectionColourReviewPaySummary(option, deliveryChoice);
  }, [option, pending, deliveryChoice]);

  useEffect(() => {
    if (pending == null || option == null) {
      router.replace("/kyc/modify-selection/colour");
    }
  }, [pending, router, option]);

  const persistDeliveryChoice = useCallback(
    (choice: ModifySelectionDeliveryChoice) => {
      if (pending == null) return;
      const next = { ...pending, deliveryChoice: choice };
      writeModifySelectionColourPending(next);
      setPending(next);
      setDeliverySheetOpen(false);
    },
    [pending],
  );

  const scrollToBookingAmount = useCallback(() => {
    const target =
      bookingAmountSectionRef.current ??
      document.getElementById(MODIFY_SELECTION_BOOKING_AMOUNT_SECTION_ID);
    if (target == null) return;

    /** Sticky header — h-14 */
    const headerOffsetPx = 56;
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerOffsetPx;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  const onEditColour = useCallback(() => {
    router.push("/kyc/modify-selection/colour");
  }, [router]);

  const onEditDelivery = useCallback(() => {
    if (option?.isExpressDelivery) {
      setDeliverySheetOpen(true);
    }
  }, [option?.isExpressDelivery]);

  const onPay = useCallback(() => {
    if (summary == null || pending == null || option == null) return;
    writeModifySelectionPendingFromSummary(summary, {
      colourId: pending.colourId,
      colourName: option.name,
      deliveryChoice: pending.deliveryChoice,
    });
    clearModifySelectionColourPending();
    router.push(
      buildBookingLockCheckoutHref(summary.bookingAmountToPayInr, {
        returnSource: MODIFY_SELECTION_RETURN_SOURCE,
      }),
    );
  }, [router, summary, pending, option]);

  if (pending == null || option == null || summary == null) {
    return null;
  }

  const expressQuote = resolveModifySelectionColourQuote(option, "express");

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <ModifySelectionScreenHeader />

      <main className={styles.mx_auto_0}>
        <ModifySelectionPageHeading
          title={MODIFY_SELECTION_COLOUR_CONFIRM_TITLE}
          titleDelayMs={STAGGER_TITLE_MS}
        />

        <div
          className={[styles.payment_success_stagger_1, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_SELECTION_MS}ms` }}
        >
          <ModifySelectionReviewSelectionCard
            colourId={pending.colourId}
            colourName={option.name}
            deliveryLine={summary.deliveryLine}
            isExpressDelivery={summary.isExpressDelivery}
            onEditColour={onEditColour}
            onEditDelivery={onEditDelivery}
            showDeliveryEdit={option.isExpressDelivery}
          />
        </div>

        <div
          className={[styles.payment_success_stagger_2, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_BOOKING_MS}ms` }}
        >
          <ModifySelectionReviewBookingAmountCard
            summary={summary}
            sectionRef={bookingAmountSectionRef}
          />
        </div>

        <div
          className={[styles.payment_success_stagger_2, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_PRICE_MS}ms` }}
        >
          <ModifySelectionReviewPaymentSummary summary={summary} />
        </div>
      </main>

      <div className={[styles.fixed_3, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_4}>
          <div className={styles.min_w_0_5}>
            <p className={styles.text_xs_6}>Booking amount</p>
            <div className={styles.mt_0_5_7}>
              <span className={styles.text_lg_8}>
                {formatModifySelectionInr(summary.bookingAmountToPayInr)}
              </span>
              <button
                type="button"
                onClick={scrollToBookingAmount}
                className={styles.flex_9}
                aria-label="View booking amount breakdown"
              >
                <Image src={infoIcon} alt="" width={16} height={16} className={styles.size_4_10} unoptimized />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onPay}
            className={[styles.primary_cta_11, "primary-cta"].filter(Boolean).join(" ")}
          >
            {MODIFY_SELECTION_COLOUR_CONFIRM_PAY_CTA}
          </button>
        </div>
      </div>

      {option.isExpressDelivery ? (
        <ModifySelectionDeliveryOptionBottomSheet
          open={deliverySheetOpen}
          onClose={() => setDeliverySheetOpen(false)}
          onConfirm={persistDeliveryChoice}
          initialDeliveryChoice={deliveryChoice}
          expressDeliveryPriceInr={expressQuote.ackoDrivePriceInr}
          expressDeliveryLine={option.deliveryLine}
        />
      ) : null}
    </div>
  );
}
