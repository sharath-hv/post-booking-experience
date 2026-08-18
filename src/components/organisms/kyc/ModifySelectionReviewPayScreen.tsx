"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import { ModifySelectionReviewBookingAmountCard } from "@/components/organisms/kyc/ModifySelectionReviewBookingAmountCard";
import { ModifySelectionDeliveryOptionBottomSheet } from "@/components/organisms/kyc/ModifySelectionDeliveryOptionBottomSheet";
import { ModifySelectionReviewPayDemoSwitcher } from "@/components/organisms/kyc/ModifySelectionReviewPayDemoSwitcher";
import { ModifySelectionReviewPaymentSummary } from "@/components/organisms/kyc/ModifySelectionReviewPaymentSummary";
import { ModifySelectionReviewSelectionCard } from "@/components/organisms/kyc/ModifySelectionReviewSelectionCard";
import { writeModifySelectionPendingFromSummary } from "@/services/active-booking-snapshot";
import {
  getModifySelectionCarBrandById,
  MODIFY_SELECTION_CAR_BRAND_PATH,
} from "@/constants/modify-selection-car-brands-content";
import { getModifySelectionCarModelById } from "@/constants/modify-selection-car-models-content";
import {
  clearModifySelectionColourPending,
  readModifySelectionColourPending,
  writeModifySelectionColourPending,
} from "@/helpers/modify-selection-colour-pending";
import {
  findModifySelectionColourOption,
  resolveModifySelectionColourQuote,
  type ModifySelectionDeliveryChoice,
} from "@/constants/modify-selection-colours-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/constants/modify-selection-content";
import {
  clearModifySelectionDifferentCarPending,
  readModifySelectionDifferentCarPending,
  writeModifySelectionDifferentCarPending,
} from "@/helpers/modify-selection-different-car-pending";
import {
  modifySelectionDifferentCarColourPath,
  modifySelectionDifferentCarModelPath,
} from "@/helpers/modify-selection-different-car-paths";
import { writeModifySelectionDifferentCarVariantChoice } from "@/helpers/modify-selection-different-car-variant-choice";
import {
  buildModifySelectionColourReviewPaySummary,
  formatModifySelectionInr,
  MODIFY_SELECTION_REVIEW_PAY_TITLE,
} from "@/constants/modify-selection-review-pay-content";
import {
  MODIFY_SELECTION_REVIEW_PAY_DEMO_QUERY_KEY,
  resolveModifySelectionReviewPayDemoScenario,
  writeModifySelectionReviewPayDemoScenario,
  type ModifySelectionReviewPayDemoScenario,
} from "@/helpers/modify-selection-review-pay-demo";
import { MODIFY_SELECTION_STAGGER_MS } from "@/helpers/modify-selection-stagger";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { writeModifySelectionVariantChoice } from "@/helpers/modify-selection-variant-choice";
import {
  clearModifySelectionVariantPending,
  readModifySelectionVariantPending,
  writeModifySelectionVariantPending,
} from "@/helpers/modify-selection-variant-pending";
import { findModifySelectionVariantOption } from "@/constants/modify-selection-variants-content";
import styles from "./ModifySelectionReviewPayScreen.module.scss";

import {
  buildBookingLockCheckoutHref,
  MODIFY_SELECTION_RETURN_SOURCE,
} from "@/helpers/paymentUrls";

const { title: STAGGER_TITLE_MS, section: STAGGER_SELECTION_MS, bookingAmount: STAGGER_BOOKING_MS, priceSummary: STAGGER_PRICE_MS } =
  MODIFY_SELECTION_STAGGER_MS;

function reviewPayCtaLabel(amountToPayInr: number): string {
  if (amountToPayInr <= 0) return "Confirm changes";
  return `Pay ${formatModifySelectionInr(amountToPayInr)}`;
}

type ModifySelectionReviewPayFlow = "colour" | "variant" | "different-car";

type ModifySelectionReviewPayScreenProps = {
  flow: ModifySelectionReviewPayFlow;
  brandId?: string;
  modelId?: string;
};

/**
 * Review selection and pay — shared by colour, variant, and different-car modify flows.
 * Demo booking-amount scenarios via `?demo_booking=` (QA only).
 */
export function ModifySelectionReviewPayScreen(props: ModifySelectionReviewPayScreenProps) {
  return (
    <Suspense>
      <ModifySelectionReviewPayScreenInner {...props} />
    </Suspense>
  );
}

function ModifySelectionReviewPayScreenInner({
  flow,
  brandId,
  modelId,
}: ModifySelectionReviewPayScreenProps) {
  const router = useRouter();
  const { loading, start } = useCtaNavigation();
  const searchParams = useSearchParams();
  const [deliverySheetOpen, setDeliverySheetOpen] = useState(false);

  const demoScenario = useMemo(
    () =>
      resolveModifySelectionReviewPayDemoScenario(
        searchParams.get(MODIFY_SELECTION_REVIEW_PAY_DEMO_QUERY_KEY),
      ),
    [searchParams],
  );

  const onDemoScenarioChange = useCallback(
    (next: ModifySelectionReviewPayDemoScenario) => {
      writeModifySelectionReviewPayDemoScenario(next);
      const q = new URLSearchParams(searchParams.toString());
      q.set(MODIFY_SELECTION_REVIEW_PAY_DEMO_QUERY_KEY, next);
      const path =
        flow === "different-car" && brandId != null && modelId != null
          ? `/booking/modify/different-car/${brandId}/${modelId}/confirm`
          : flow === "variant"
            ? "/booking/modify/variant/confirm"
            : "/booking/modify/colour/confirm";
      router.replace(`${path}?${q.toString()}`, { scroll: false });
    },
    [brandId, flow, modelId, router, searchParams],
  );

  const [colourPending, setColourPending] = useState(() =>
    flow === "colour" ? readModifySelectionColourPending() : null,
  );
  const [variantPending, setVariantPending] = useState(() =>
    flow === "variant" ? readModifySelectionVariantPending() : null,
  );
  const [differentCarPending, setDifferentCarPending] = useState(() =>
    flow === "different-car" ? readModifySelectionDifferentCarPending() : null,
  );

  useEffect(() => {
    if (flow === "colour") setColourPending(readModifySelectionColourPending());
    if (flow === "variant") setVariantPending(readModifySelectionVariantPending());
    if (flow === "different-car") setDifferentCarPending(readModifySelectionDifferentCarPending());
  }, [flow]);

  useEffect(() => {
    writeModifySelectionReviewPayDemoScenario(demoScenario);
  }, [demoScenario]);

  const summaryOptions = useMemo(() => ({ demoScenario }), [demoScenario]);

  const resolved = useMemo(() => {
    if (flow === "colour" && colourPending != null) {
      const option = findModifySelectionColourOption(colourPending.colourId);
      if (option == null) return null;
      return {
        colourId: colourPending.colourId,
        colourName: option.name,
        deliveryChoice: colourPending.deliveryChoice,
        option,
        summary: buildModifySelectionColourReviewPaySummary(
          option,
          colourPending.deliveryChoice,
          summaryOptions,
        ),
        missingRedirect: "/booking/modify/colour",
        editColourPath: "/booking/modify/colour",
        carTitle: undefined as string | undefined,
        carVariant: undefined as string | undefined,
      };
    }

    if (flow === "variant" && variantPending != null) {
      const variant = findModifySelectionVariantOption(variantPending.variantId);
      const option = findModifySelectionColourOption(variantPending.colourId);
      if (variant == null || option == null) return null;
      return {
        colourId: variantPending.colourId,
        colourName: option.name,
        deliveryChoice: variantPending.deliveryChoice,
        option,
        summary: buildModifySelectionColourReviewPaySummary(
          option,
          variantPending.deliveryChoice,
          summaryOptions,
        ),
        missingRedirect: "/booking/modify/variant/colour",
        editColourPath: "/booking/modify/variant/colour",
        editVariantPath: "/booking/modify/variant",
        carTitle: undefined,
        carVariant: variant.name,
      };
    }

    if (
      flow === "different-car" &&
      differentCarPending != null &&
      brandId != null &&
      modelId != null &&
      differentCarPending.brandId === brandId &&
      differentCarPending.modelId === modelId
    ) {
      const brand = getModifySelectionCarBrandById(brandId);
      const model = getModifySelectionCarModelById(brandId, modelId);
      const variant = findModifySelectionVariantOption(differentCarPending.variantId);
      const option = findModifySelectionColourOption(differentCarPending.colourId);
      if (brand == null || model == null || variant == null || option == null) return null;
      return {
        colourId: differentCarPending.colourId,
        colourName: option.name,
        deliveryChoice: differentCarPending.deliveryChoice,
        option,
        summary: buildModifySelectionColourReviewPaySummary(
          option,
          differentCarPending.deliveryChoice,
          summaryOptions,
        ),
        missingRedirect: modifySelectionDifferentCarColourPath(brandId, modelId),
        editColourPath: modifySelectionDifferentCarColourPath(brandId, modelId),
        editVariantPath: modifySelectionDifferentCarModelPath(brandId, modelId),
        editCarPath: MODIFY_SELECTION_CAR_BRAND_PATH,
        carTitle: `${brand.name} ${model.name}`,
        carVariant: variant.name,
      };
    }

    return null;
  }, [
    brandId,
    colourPending,
    differentCarPending,
    flow,
    modelId,
    summaryOptions,
    variantPending,
  ]);

  useEffect(() => {
    if (resolved == null) {
      const fallback =
        flow === "different-car" && brandId != null && modelId != null
          ? modifySelectionDifferentCarColourPath(brandId, modelId)
          : flow === "variant"
            ? "/booking/modify/variant/colour"
            : "/booking/modify/colour";
      router.replace(fallback);
    }
  }, [brandId, flow, modelId, resolved, router]);

  const persistDeliveryChoice = useCallback(
    (choice: ModifySelectionDeliveryChoice) => {
      if (flow === "colour" && colourPending != null) {
        const next = { ...colourPending, deliveryChoice: choice };
        writeModifySelectionColourPending(next);
        setColourPending(next);
      } else if (flow === "variant" && variantPending != null) {
        const next = { ...variantPending, deliveryChoice: choice };
        writeModifySelectionVariantPending(next);
        setVariantPending(next);
      } else if (flow === "different-car" && differentCarPending != null) {
        const next = { ...differentCarPending, deliveryChoice: choice };
        writeModifySelectionDifferentCarPending(next);
        setDifferentCarPending(next);
      }
      setDeliverySheetOpen(false);
    },
    [colourPending, differentCarPending, flow, variantPending],
  );

  /**
   * Edit cascades from review:
   * - Delivery → sheet only (in place)
   * - Colour → colour → delivery → confirm
   * - Variant → variant → colour → delivery → confirm
   * - Make/model → brand → model → variant → colour → delivery → confirm
   *
   * Colour step after confirm needs the intermediate variant choice re-seeded
   * (cleared when pending was written).
   */
  const onEditColour = useCallback(() => {
    if (resolved == null) return;
    if (flow === "variant" && variantPending != null) {
      writeModifySelectionVariantChoice(variantPending.variantId);
    } else if (flow === "different-car" && differentCarPending != null) {
      writeModifySelectionDifferentCarVariantChoice(differentCarPending.variantId);
    }
    router.push(resolved.editColourPath);
  }, [differentCarPending, flow, resolved, router, variantPending]);

  const onEditVariant = useCallback(() => {
    if (resolved?.editVariantPath == null) return;
    router.push(resolved.editVariantPath);
  }, [resolved, router]);

  const onEditCar = useCallback(() => {
    if (resolved == null || !("editCarPath" in resolved) || resolved.editCarPath == null) return;
    router.push(resolved.editCarPath);
  }, [resolved, router]);

  const onEditDelivery = useCallback(() => {
    if (resolved?.option.isExpressDelivery) {
      setDeliverySheetOpen(true);
    }
  }, [resolved?.option.isExpressDelivery]);

  const onPay = useCallback(() => {
    if (resolved == null) return;
    writeModifySelectionPendingFromSummary(resolved.summary, {
      colourId: resolved.colourId,
      colourName: resolved.colourName,
      deliveryChoice: resolved.deliveryChoice,
      carTitle: resolved.carTitle,
      carVariant: resolved.carVariant,
    });
    if (flow === "colour") clearModifySelectionColourPending();
    if (flow === "variant") clearModifySelectionVariantPending();
    if (flow === "different-car") clearModifySelectionDifferentCarPending();
    start(() =>
      router.push(
        buildBookingLockCheckoutHref(resolved.summary.bookingAmountToPayInr, {
          returnSource: MODIFY_SELECTION_RETURN_SOURCE,
        }),
      ),
    );
  }, [flow, resolved, router, start]);

  if (resolved == null) {
    return null;
  }

  const expressQuote = resolveModifySelectionColourQuote(resolved.option, "express");

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <StandaloneScreenHeader />

      <main className={styles.mx_auto_0}>
        <PageLeadHeading
          title={MODIFY_SELECTION_REVIEW_PAY_TITLE}
          titleDelayMs={STAGGER_TITLE_MS}
        />

        <div
          className={[styles.payment_success_stagger_1, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_SELECTION_MS}ms` }}
        >
          <ModifySelectionReviewSelectionCard
            colourId={resolved.colourId}
            colourName={resolved.colourName}
            deliveryLine={resolved.summary.deliveryLine}
            isExpressDelivery={resolved.summary.isExpressDelivery}
            onEditColour={onEditColour}
            onEditDelivery={onEditDelivery}
            showDeliveryEdit={resolved.option.isExpressDelivery}
            carTitle={resolved.carTitle}
            carVariant={resolved.carVariant}
            onEditVariant={
              flow === "variant" || flow === "different-car" ? onEditVariant : undefined
            }
            onEditCar={flow === "different-car" ? onEditCar : undefined}
          />
        </div>

        <div
          className={[styles.payment_success_stagger_2, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_BOOKING_MS}ms` }}
        >
          <ModifySelectionReviewBookingAmountCard summary={resolved.summary} />
        </div>

        <div
          className={[
            styles.priceWash,
            styles.payment_success_stagger_2,
            "payment-success-stagger",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ animationDelay: `${STAGGER_PRICE_MS}ms` }}
        >
          <ModifySelectionReviewPaymentSummary summary={resolved.summary} />

          {/* QA-only — remove and the grey wash still ends the page at the footer */}
          <div className={styles.demo_slot}>
            <ModifySelectionReviewPayDemoSwitcher
              value={demoScenario}
              onChange={onDemoScenarioChange}
            />
          </div>
        </div>
      </main>

      {/* Amount lives in the pay-now card — footer is action-only to avoid repeating ₹. */}
      <div className={[styles.fixed_3, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.footerInner}>
          <PrimaryCta
            onClick={onPay}
            loading={loading}
            className={styles.primary_cta_full}
          >
            {reviewPayCtaLabel(resolved.summary.bookingAmountToPayInr)}
          </PrimaryCta>
        </div>
      </div>

      {resolved.option.isExpressDelivery ? (
        <ModifySelectionDeliveryOptionBottomSheet
          open={deliverySheetOpen}
          onClose={() => setDeliverySheetOpen(false)}
          onConfirm={persistDeliveryChoice}
          navigatesOnConfirm={false}
          initialDeliveryChoice={resolved.deliveryChoice}
          expressDeliveryPriceInr={expressQuote.ackoDrivePriceInr}
          expressDeliveryLine={resolved.option.deliveryLine}
        />
      ) : null}
    </div>
  );
}
