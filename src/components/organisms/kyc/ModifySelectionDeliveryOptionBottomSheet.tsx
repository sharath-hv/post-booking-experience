"use client";

import { useCallback, useEffect, useId, useState } from "react";

import { BottomSheetCloseIcon } from "@/components/atoms/BottomSheetCloseIcon";
import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
import { ModifySelectionDeliveryOptionCard } from "@/components/organisms/kyc/ModifySelectionDeliveryOptionCard";
import { BOOKING_CONFIRMED_ASSETS } from "@/utils/kyc-booking-confirmed-assets";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import {
  BOOKING_EXPRESS_DELIVERY_TEXT_CLASS,
  BOOKING_STANDARD_DELIVERY_TEXT_CLASS,
  getBookingDeliveryIconSrc,
} from "@/constants/experience-flow-content";
import {
  MODIFY_SELECTION_DELIVERY_SHEET_TITLE,
  MODIFY_SELECTION_SHEET_STANDARD_DELIVERY_LINE,
  modifySelectionStandardDeliveryPriceInr,
  type ModifySelectionDeliveryChoice,
} from "@/constants/modify-selection-colours-content";
import { cn } from "@/utils/utils";

import styles from "./ModifySelectionDeliveryOptionBottomSheet.module.scss";

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
  const [deliveryChoice, setDeliveryChoice] = useState<ModifySelectionDeliveryChoice>("express");

  useEffect(() => {
    if (!open) return;
    setDeliveryChoice(initialDeliveryChoice);
  }, [open, initialDeliveryChoice]);

  const handleConfirm = useCallback(() => {
    onConfirm(deliveryChoice);
  }, [deliveryChoice, onConfirm]);

  const standardDeliveryPriceInr =
    modifySelectionStandardDeliveryPriceInr(expressDeliveryPriceInr);

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      showCloseButton={false}
      aria-labelledby={titleId}
    >
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
    </BottomSheetShell>
  );
}
