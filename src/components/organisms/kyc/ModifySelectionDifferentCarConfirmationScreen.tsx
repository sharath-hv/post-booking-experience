"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { CarContentCard } from "@/components/molecules/card/CarContentCard";
import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import { BOOKING_CONFIRMED_ASSETS } from "@/utils/kyc-booking-confirmed-assets";
import {
  BOOKING_EXPRESS_DELIVERY_TEXT_CLASS,
  BOOKING_STANDARD_DELIVERY_TEXT_CLASS,
  getBookingDeliveryIconSrc,
} from "@/constants/experience-flow-content";
import { getModifySelectionCarBrandById } from "@/constants/modify-selection-car-brands-content";
import { getModifySelectionCarModelById } from "@/constants/modify-selection-car-models-content";
import {
  MODIFY_SELECTION_DIFFERENT_CAR_CONFIRM_CTA,
  MODIFY_SELECTION_DIFFERENT_CAR_CONFIRM_SUBLINE,
  MODIFY_SELECTION_DIFFERENT_CAR_CONFIRM_TITLE,
} from "@/constants/modify-selection-different-car-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/constants/modify-selection-content";
import { modifySelectionDifferentCarColourPath } from "@/helpers/modify-selection-different-car-paths";
import {
  clearModifySelectionDifferentCarPending,
  readModifySelectionDifferentCarPending,
} from "@/helpers/modify-selection-different-car-pending";
import { JOURNEY_PATHS } from "@/helpers/journey-routes";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { getModifySelectionCarCutoutForColour } from "@/helpers/modify-selection-car-cutouts";
import {
  findModifySelectionColourOption,
  resolveModifySelectionColourQuote,
} from "@/constants/modify-selection-colours-content";
import { findModifySelectionVariantOption } from "@/constants/modify-selection-variants-content";
import { MODIFY_SELECTION_STAGGER_MS } from "@/helpers/modify-selection-stagger";
import styles from "./ModifySelectionDifferentCarConfirmationScreen.module.scss";


/** Stagger: nav + footer CTA immediate; then title → subline → hero card. */
const { title: STAGGER_TITLE_MS, subtext: STAGGER_SUBTEXT_MS, heading: STAGGER_HERO_MS } =
  MODIFY_SELECTION_STAGGER_MS;

type ModifySelectionDifferentCarConfirmationScreenProps = {
  brandId: string;
  modelId: string;
};

/**
 * Different car — confirm brand model + variant + colour before applying the change.
 */
export function ModifySelectionDifferentCarConfirmationScreen({
  brandId,
  modelId,
}: ModifySelectionDifferentCarConfirmationScreenProps) {
  const router = useRouter();
  const { loading, start } = useCtaNavigation();
  const [pending, setPending] = useState(() => readModifySelectionDifferentCarPending());

  useEffect(() => {
    setPending(readModifySelectionDifferentCarPending());
  }, []);

  const selection = useMemo(() => {
    if (pending == null) return null;
    if (pending.brandId !== brandId || pending.modelId !== modelId) return null;
    const brand = getModifySelectionCarBrandById(pending.brandId);
    const model = getModifySelectionCarModelById(pending.brandId, pending.modelId);
    const variant = findModifySelectionVariantOption(pending.variantId);
    const colour = findModifySelectionColourOption(pending.colourId);
    if (brand == null || model == null || variant == null || colour == null) return null;
    const quote = resolveModifySelectionColourQuote(colour, pending.deliveryChoice);
    return {
      carTitle: `${brand.name} ${model.name}`,
      variantName: variant.name,
      colourName: colour.name,
      deliveryLine: quote.deliveryLine,
      isExpressDelivery: quote.isExpressDelivery,
      colourId: pending.colourId,
    };
  }, [brandId, modelId, pending]);

  useEffect(() => {
    if (pending == null || selection == null) {
      router.replace(modifySelectionDifferentCarColourPath(brandId, modelId));
    }
  }, [brandId, modelId, pending, router, selection]);

  const onConfirmChange = useCallback(() => {
    clearModifySelectionDifferentCarPending();
    start(() => router.push(JOURNEY_PATHS.identity.hub));
  }, [router, start]);

  if (pending == null || selection == null) {
    return null;
  }

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <StandaloneScreenHeader />

      <main className={styles.mx_auto_0}>
        <PageLeadHeading
          title={MODIFY_SELECTION_DIFFERENT_CAR_CONFIRM_TITLE}
          subline={MODIFY_SELECTION_DIFFERENT_CAR_CONFIRM_SUBLINE}
          titleDelayMs={STAGGER_TITLE_MS}
          sublineDelayMs={STAGGER_SUBTEXT_MS}
        />

        <div
          className={[styles.payment_success_stagger_1, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_HERO_MS}ms` }}
        >
          <CarContentCard
            variant="hero"
            carCutoutSrc={getModifySelectionCarCutoutForColour(selection.colourId)}
            cardDetails={{
              carVariant: `${selection.carTitle} ${selection.variantName}`,
              carColor: selection.colourName,
              deliveryLine: selection.deliveryLine,
              deliveryTextClass: selection.isExpressDelivery
                ? BOOKING_EXPRESS_DELIVERY_TEXT_CLASS
                : BOOKING_STANDARD_DELIVERY_TEXT_CLASS,
              deliveryIconSrc: selection.isExpressDelivery
                ? BOOKING_CONFIRMED_ASSETS.expressDelivery
                : getBookingDeliveryIconSrc("standard"),
            }}
          />
        </div>
      </main>

      <div className={[styles.fixed_2, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_3}>
          <PrimaryCta onClick={onConfirmChange} loading={loading} className={styles.primary_cta_4}>
            {MODIFY_SELECTION_DIFFERENT_CAR_CONFIRM_CTA}
          </PrimaryCta>
        </div>
      </div>
    </div>
  );
}
