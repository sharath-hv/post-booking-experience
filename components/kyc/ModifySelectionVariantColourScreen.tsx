"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import { ModifySelectionColourCard } from "@/components/kyc/ModifySelectionColourCard";
import { ModifySelectionDeliveryOptionBottomSheet } from "@/components/kyc/ModifySelectionDeliveryOptionBottomSheet";
import {
  getModifySelectionAvailableColourOptions,
  type ModifySelectionDeliveryChoice,
} from "@/lib/modify-selection-colours-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/lib/modify-selection-content";
import {
  clearModifySelectionVariantChoice,
  readModifySelectionVariantChoice,
} from "@/lib/modify-selection-variant-choice";
import {
  readModifySelectionVariantPending,
  writeModifySelectionVariantPending,
} from "@/lib/modify-selection-variant-pending";
import styles from "./ModifySelectionVariantColourScreen.module.scss";

import {
  findModifySelectionVariantOption,
  modifySelectionVariantColourScreenTitle,
  MODIFY_SELECTION_VARIANT_COLOUR_SCREEN_SUBLINE,
  MODIFY_SELECTION_VARIANT_CONFIRM_PATH,
} from "@/lib/modify-selection-variants-content";
import {
  modifySelectionListStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/lib/modify-selection-stagger";

const {
  title: STAGGER_TITLE_MS,
  subtext: STAGGER_SUBTEXT_MS,
  section: STAGGER_FIRST_COLOUR_MS,
} = MODIFY_SELECTION_STAGGER_MS;

const COLOUR_LIST_ARIA_LABEL = "Available colours";

/**
 * Change variant — pick colour after variant.
 */
export function ModifySelectionVariantColourScreen() {
  const router = useRouter();
  const [variantId, setVariantId] = useState<string | null>(() =>
    readModifySelectionVariantChoice(),
  );
  const availableColours = useMemo(() => getModifySelectionAvailableColourOptions(), []);
  const [selectedColourId, setSelectedColourId] = useState<string | null>(() => {
    const pending = readModifySelectionVariantPending();
    return pending?.colourId ?? null;
  });
  const [deliverySheetOpen, setDeliverySheetOpen] = useState(false);
  const pendingDeliveryChoice = useMemo(
    () => readModifySelectionVariantPending()?.deliveryChoice,
    [],
  );

  const selectedVariant = useMemo(
    () => (variantId != null ? findModifySelectionVariantOption(variantId) : undefined),
    [variantId],
  );

  const selectedColour = useMemo(
    () => availableColours.find((option) => option.id === selectedColourId) ?? null,
    [availableColours, selectedColourId],
  );

  useEffect(() => {
    setVariantId(readModifySelectionVariantChoice());
  }, []);

  useEffect(() => {
    if (variantId == null || selectedVariant == null) {
      router.replace("/kyc/modify-selection/variant");
    }
  }, [router, selectedVariant, variantId]);

  const goToConfirmation = useCallback(
    (deliveryChoice: ModifySelectionDeliveryChoice) => {
      if (selectedVariant == null || selectedColour == null || variantId == null) return;
      writeModifySelectionVariantPending({
        variantId,
        colourId: selectedColour.id,
        deliveryChoice,
      });
      clearModifySelectionVariantChoice();
      setDeliverySheetOpen(false);
      router.push(MODIFY_SELECTION_VARIANT_CONFIRM_PATH);
    },
    [router, selectedColour, selectedVariant, variantId],
  );

  const onContinue = useCallback(() => {
    if (selectedColour == null) return;
    if (selectedColour.isExpressDelivery) {
      setDeliverySheetOpen(true);
      return;
    }
    goToConfirmation("standard");
  }, [goToConfirmation, selectedColour]);

  const onDeliveryConfirm = useCallback(
    (deliveryChoice: ModifySelectionDeliveryChoice) => {
      goToConfirmation(deliveryChoice);
    },
    [goToConfirmation],
  );

  if (variantId == null || selectedVariant == null) {
    return null;
  }

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <ModifySelectionScreenHeader />

      <main className={styles.mx_auto_0}>
        <ModifySelectionPageHeading
          title={modifySelectionVariantColourScreenTitle(selectedVariant.name)}
          subline={MODIFY_SELECTION_VARIANT_COLOUR_SCREEN_SUBLINE}
          titleDelayMs={STAGGER_TITLE_MS}
          sublineDelayMs={STAGGER_SUBTEXT_MS}
        />

        <div
          className={styles.mt_8_1}
          role="group"
          aria-label={COLOUR_LIST_ARIA_LABEL}
        >
          {availableColours.map((option, index) => (
            <div
              key={option.id}
              className={[styles.payment_success_stagger_2, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{
                animationDelay: `${modifySelectionListStaggerDelay(index, STAGGER_FIRST_COLOUR_MS)}ms`,
              }}
            >
              <ModifySelectionColourCard
                option={option}
                selected={selectedColourId === option.id}
                onSelect={() => setSelectedColourId(option.id)}
              />
            </div>
          ))}
        </div>
      </main>

      <div className={[styles.fixed_3, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_4}>
          <button
            type="button"
            disabled={selectedColourId == null}
            onClick={onContinue}
            className={[styles.primary_cta_5, "primary-cta"].filter(Boolean).join(" ")}
          >
            Continue
          </button>
        </div>
      </div>

      {selectedColour?.isExpressDelivery ? (
        <ModifySelectionDeliveryOptionBottomSheet
          open={deliverySheetOpen}
          onClose={() => setDeliverySheetOpen(false)}
          onConfirm={onDeliveryConfirm}
          initialDeliveryChoice={pendingDeliveryChoice}
          expressDeliveryPriceInr={selectedColour.ackoDrivePriceInr}
          expressDeliveryLine={selectedColour.deliveryLine}
        />
      ) : null}
    </div>
  );
}
