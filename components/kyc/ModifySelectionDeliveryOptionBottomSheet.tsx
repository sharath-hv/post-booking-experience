"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { ModifySelectionDeliveryOptionCard } from "@/components/kyc/ModifySelectionDeliveryOptionCard";
import { BOOKING_CONFIRMED_ASSETS } from "@/components/kyc/kyc-booking-confirmed-assets";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import {
  BOOKING_EXPRESS_DELIVERY_TEXT_CLASS,
  BOOKING_STANDARD_DELIVERY_TEXT_CLASS,
  getBookingDeliveryIconSrc,
} from "@/lib/experience-flow-content";
import {
  MODIFY_SELECTION_DELIVERY_SHEET_TITLE,
  MODIFY_SELECTION_SHEET_STANDARD_DELIVERY_LINE,
  modifySelectionStandardDeliveryPriceInr,
  type ModifySelectionDeliveryChoice,
} from "@/lib/modify-selection-colours-content";
import { cn } from "@/lib/utils";
import styles from "./ModifySelectionDeliveryOptionBottomSheet.module.scss";


const SHEET_TRANSITION_MS = 280;

export type ModifySelectionDeliveryOptionBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (choice: ModifySelectionDeliveryChoice) => void;
  /** Express delivery price — same as shown on the colour card. */
  expressDeliveryPriceInr: number;
  expressDeliveryLine: string;
  initialDeliveryChoice?: ModifySelectionDeliveryChoice;
};

/**
 * Colour change — pick express vs standard delivery (Figma 2674:8617).
 */
export function ModifySelectionDeliveryOptionBottomSheet({
  open,
  onClose,
  onConfirm,
  expressDeliveryPriceInr,
  expressDeliveryLine,
  initialDeliveryChoice = "express",
}: ModifySelectionDeliveryOptionBottomSheetProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [deliveryChoice, setDeliveryChoice] = useState<ModifySelectionDeliveryChoice>("express");
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    setDeliveryChoice(initialDeliveryChoice);
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setMounted(true);
    setAnimateIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open, initialDeliveryChoice]);

  useEffect(() => {
    if (open || !mounted) return;
    setAnimateIn(false);
    exitTimeoutRef.current = setTimeout(() => {
      exitTimeoutRef.current = null;
      setMounted(false);
    }, SHEET_TRANSITION_MS);
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  const handleConfirm = useCallback(() => {
    onConfirm(deliveryChoice);
  }, [deliveryChoice, onConfirm]);

  if (!mounted) return null;

  const standardDeliveryPriceInr =
    modifySelectionStandardDeliveryPriceInr(expressDeliveryPriceInr);

  return (
    <BottomSheetPortal>
      <div className={cn(styles.fixed_0, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
        <button
          type="button"
          className={cn(
            styles.absolute_6,
            animateIn ? styles.opacity_100_7 : styles.opacity_0_8,
          )}
          onClick={onClose}
          aria-label="Dismiss"
        />
        <div
          className={cn(styles.sheetPanel, BOTTOM_SHEET_MAX_HEIGHT_CLASS, "sheet-elevated", animateIn ? styles.translate_y_0_9 : styles.translate_y_full_10)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className={styles.relative_0}>
            <header className={styles.flex_1}>
              <h2
                id={titleId}
                className={styles.min_w_0_2}
              >
                {MODIFY_SELECTION_DELIVERY_SHEET_TITLE}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className={[styles.cta_ghost_3, "cta-ghost"].filter(Boolean).join(" ")}
                aria-label="Close"
              >
                <BottomSheetCloseIcon />
              </button>
            </header>

            <div
              className={cn(
                styles.min_h_0_11,
                BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
              )}
            >
              <div className={styles.flex_4} role="group" aria-label={MODIFY_SELECTION_DELIVERY_SHEET_TITLE}>
                <ModifySelectionDeliveryOptionCard
                  selected={deliveryChoice === "express"}
                  onSelect={() => setDeliveryChoice("express")}
                  deliveryLine={expressDeliveryLine}
                  deliveryLineClass={BOOKING_EXPRESS_DELIVERY_TEXT_CLASS}
                  iconSrc={BOOKING_CONFIRMED_ASSETS.expressDelivery}
                  priceInr={expressDeliveryPriceInr}
                />
                <ModifySelectionDeliveryOptionCard
                  selected={deliveryChoice === "standard"}
                  onSelect={() => setDeliveryChoice("standard")}
                  deliveryLine={MODIFY_SELECTION_SHEET_STANDARD_DELIVERY_LINE}
                  deliveryLineClass={BOOKING_STANDARD_DELIVERY_TEXT_CLASS}
                  iconSrc={getBookingDeliveryIconSrc("standard")}
                  priceInr={standardDeliveryPriceInr}
                />
              </div>
            </div>

            <div
              className={cn(styles.shrink_0_0,
                BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
              )}
            >
              <button type="button" onClick={handleConfirm} className={[styles.primary_cta_5, "primary-cta"].filter(Boolean).join(" ")}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
