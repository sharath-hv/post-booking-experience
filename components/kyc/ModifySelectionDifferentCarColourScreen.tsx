"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import { ModifySelectionColourCard } from "@/components/kyc/ModifySelectionColourCard";
import { ModifySelectionDeliveryOptionBottomSheet } from "@/components/kyc/ModifySelectionDeliveryOptionBottomSheet";
import {
  getModifySelectionCarModelById,
  modifySelectionCarModelPath,
} from "@/lib/modify-selection-car-models-content";
import {
  modifySelectionDifferentCarConfirmPath,
} from "@/lib/modify-selection-different-car-paths";
import {
  clearModifySelectionDifferentCarVariantChoice,
  readModifySelectionDifferentCarVariantChoice,
} from "@/lib/modify-selection-different-car-variant-choice";
import {
  readModifySelectionDifferentCarPending,
  writeModifySelectionDifferentCarPending,
} from "@/lib/modify-selection-different-car-pending";
import {
  getModifySelectionAvailableColourOptions,
  type ModifySelectionDeliveryChoice,
} from "@/lib/modify-selection-colours-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/lib/modify-selection-content";
import styles from "./ModifySelectionDifferentCarColourScreen.module.scss";

import {
  findModifySelectionVariantOption,
  modifySelectionVariantColourScreenTitle,
} from "@/lib/modify-selection-variants-content";
import {
  modifySelectionListStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/lib/modify-selection-stagger";

const {
  title: STAGGER_TITLE_MS,
  section: STAGGER_FIRST_COLOUR_MS,
} = MODIFY_SELECTION_STAGGER_MS;

const COLOUR_LIST_ARIA_LABEL = "Available colours";

type ModifySelectionDifferentCarColourScreenProps = {
  brandId: string;
  modelId: string;
};

/**
 * Choose a different car — colour step after variant (aligned with change-variant flow).
 */
export function ModifySelectionDifferentCarColourScreen({
  brandId,
  modelId,
}: ModifySelectionDifferentCarColourScreenProps) {
  const router = useRouter();
  const [variantId, setVariantId] = useState<string | null>(() =>
    readModifySelectionDifferentCarVariantChoice(),
  );
  const model = useMemo(
    () => getModifySelectionCarModelById(brandId, modelId),
    [brandId, modelId],
  );
  const availableColours = useMemo(() => getModifySelectionAvailableColourOptions(), []);
  const [selectedColourId, setSelectedColourId] = useState<string | null>(() => {
    const pending = readModifySelectionDifferentCarPending();
    return pending?.colourId ?? null;
  });
  const [deliverySheetOpen, setDeliverySheetOpen] = useState(false);
  const pendingDeliveryChoice = useMemo(
    () => readModifySelectionDifferentCarPending()?.deliveryChoice,
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
    setVariantId(readModifySelectionDifferentCarVariantChoice());
  }, []);

  useEffect(() => {
    if (model == null) {
      router.replace(modifySelectionCarModelPath(brandId));
      return;
    }
    if (variantId == null || selectedVariant == null) {
      router.replace(modifySelectionCarModelPath(brandId, modelId));
    }
  }, [brandId, model, modelId, router, selectedVariant, variantId]);

  const goToConfirmation = useCallback(
    (deliveryChoice: ModifySelectionDeliveryChoice) => {
      if (selectedVariant == null || selectedColour == null || variantId == null) return;
      writeModifySelectionDifferentCarPending({
        brandId,
        modelId,
        variantId,
        colourId: selectedColour.id,
        deliveryChoice,
      });
      clearModifySelectionDifferentCarVariantChoice();
      setDeliverySheetOpen(false);
      router.push(modifySelectionDifferentCarConfirmPath(brandId, modelId));
    },
    [brandId, modelId, router, selectedColour, selectedVariant, variantId],
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

  if (model == null || variantId == null || selectedVariant == null) {
    return null;
  }

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <ModifySelectionScreenHeader />

      <main className={styles.mx_auto_0}>
        <ModifySelectionPageHeading
          title={modifySelectionVariantColourScreenTitle(selectedVariant.name)}
          titleDelayMs={STAGGER_TITLE_MS}
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
