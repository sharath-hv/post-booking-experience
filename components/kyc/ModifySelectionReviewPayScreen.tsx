"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

import infoIcon from "@/assets/Info.svg";
import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import {
  MODIFY_SELECTION_BOOKING_AMOUNT_SECTION_ID,
  ModifySelectionReviewBookingAmountCard,
} from "@/components/kyc/ModifySelectionReviewBookingAmountCard";
import { ModifySelectionDeliveryOptionBottomSheet } from "@/components/kyc/ModifySelectionDeliveryOptionBottomSheet";
import { ModifySelectionReviewPayDemoSwitcher } from "@/components/kyc/ModifySelectionReviewPayDemoSwitcher";
import { ModifySelectionReviewPaymentSummary } from "@/components/kyc/ModifySelectionReviewPaymentSummary";
import { ModifySelectionReviewSelectionCard } from "@/components/kyc/ModifySelectionReviewSelectionCard";
import { writeModifySelectionPendingFromSummary } from "@/lib/active-booking-snapshot";
import {
  getModifySelectionCarBrandById,
  MODIFY_SELECTION_CAR_BRAND_PATH,
} from "@/lib/modify-selection-car-brands-content";
import { getModifySelectionCarModelById } from "@/lib/modify-selection-car-models-content";
import {
  clearModifySelectionColourPending,
  readModifySelectionColourPending,
  writeModifySelectionColourPending,
} from "@/lib/modify-selection-colour-pending";
import {
  findModifySelectionColourOption,
  resolveModifySelectionColourQuote,
  type ModifySelectionDeliveryChoice,
} from "@/lib/modify-selection-colours-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/lib/modify-selection-content";
import {
  clearModifySelectionDifferentCarPending,
  readModifySelectionDifferentCarPending,
  writeModifySelectionDifferentCarPending,
} from "@/lib/modify-selection-different-car-pending";
import {
  modifySelectionDifferentCarColourPath,
  modifySelectionDifferentCarModelPath,
} from "@/lib/modify-selection-different-car-paths";
import { writeModifySelectionDifferentCarVariantChoice } from "@/lib/modify-selection-different-car-variant-choice";
import {
  buildModifySelectionColourReviewPaySummary,
  formatModifySelectionInr,
  MODIFY_SELECTION_REVIEW_PAY_DUE_TODAY_LABEL,
  MODIFY_SELECTION_REVIEW_PAY_TITLE,
} from "@/lib/modify-selection-review-pay-content";
import {
  MODIFY_SELECTION_REVIEW_PAY_DEMO_QUERY_KEY,
  resolveModifySelectionReviewPayDemoScenario,
  writeModifySelectionReviewPayDemoScenario,
  type ModifySelectionReviewPayDemoScenario,
} from "@/lib/modify-selection-review-pay-demo";
import { MODIFY_SELECTION_STAGGER_MS } from "@/lib/modify-selection-stagger";
import { writeModifySelectionVariantChoice } from "@/lib/modify-selection-variant-choice";
import {
  clearModifySelectionVariantPending,
  readModifySelectionVariantPending,
  writeModifySelectionVariantPending,
} from "@/lib/modify-selection-variant-pending";
import { findModifySelectionVariantOption } from "@/lib/modify-selection-variants-content";
import styles from "./ModifySelectionReviewPayScreen.module.scss";

import {
  buildBookingLockCheckoutHref,
  MODIFY_SELECTION_RETURN_SOURCE,
} from "@/lib/paymentUrls";

const { title: STAGGER_TITLE_MS, section: STAGGER_SELECTION_MS, bookingAmount: STAGGER_BOOKING_MS, priceSummary: STAGGER_PRICE_MS } =
  MODIFY_SELECTION_STAGGER_MS;

function reviewPayCtaLabel(amountToPayInr: number): string {
  if (amountToPayInr <= 0) return "Confirm";
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
  const searchParams = useSearchParams();
  const bookingAmountSectionRef = useRef<HTMLElement>(null);
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
          ? `/kyc/modify-selection/different-car/${brandId}/${modelId}/confirm`
          : flow === "variant"
            ? "/kyc/modify-selection/variant/confirm"
            : "/kyc/modify-selection/colour/confirm";
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
        missingRedirect: "/kyc/modify-selection/colour",
        editColourPath: "/kyc/modify-selection/colour",
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
        missingRedirect: "/kyc/modify-selection/variant/colour",
        editColourPath: "/kyc/modify-selection/variant/colour",
        editVariantPath: "/kyc/modify-selection/variant",
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
            ? "/kyc/modify-selection/variant/colour"
            : "/kyc/modify-selection/colour";
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

  const scrollToBookingAmount = useCallback(() => {
    const target =
      bookingAmountSectionRef.current ??
      document.getElementById(MODIFY_SELECTION_BOOKING_AMOUNT_SECTION_ID);
    if (target == null) return;
    const headerOffsetPx = 56;
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerOffsetPx;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

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
    router.push(
      buildBookingLockCheckoutHref(resolved.summary.bookingAmountToPayInr, {
        returnSource: MODIFY_SELECTION_RETURN_SOURCE,
      }),
    );
  }, [flow, resolved, router]);

  if (resolved == null) {
    return null;
  }

  const expressQuote = resolveModifySelectionColourQuote(resolved.option, "express");

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <ModifySelectionScreenHeader />

      <main className={styles.mx_auto_0}>
        <ModifySelectionPageHeading
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
          <ModifySelectionReviewBookingAmountCard
            summary={resolved.summary}
            sectionRef={bookingAmountSectionRef}
          />
        </div>

        <div
          className={[styles.payment_success_stagger_2, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_PRICE_MS}ms` }}
        >
          <ModifySelectionReviewPaymentSummary summary={resolved.summary} />
        </div>

        <div className={styles.demo_slot}>
          <ModifySelectionReviewPayDemoSwitcher
            value={demoScenario}
            onChange={onDemoScenarioChange}
          />
        </div>
      </main>

      <div className={[styles.fixed_3, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_4}>
          <div className={styles.min_w_0_5}>
            <p className={styles.text_xs_6}>{MODIFY_SELECTION_REVIEW_PAY_DUE_TODAY_LABEL}</p>
            <div className={styles.mt_0_5_7}>
              <span className={styles.text_lg_8}>
                {formatModifySelectionInr(resolved.summary.bookingAmountToPayInr)}
              </span>
              <button
                type="button"
                onClick={scrollToBookingAmount}
                className={styles.flex_9}
                aria-label="View what you pay today"
              >
                <Image src={infoIcon} alt="" width={16} height={16} className={styles.size_4_10} unoptimized />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onPay}
            className={[styles.primary_cta_wide, "primary-cta"].filter(Boolean).join(" ")}
          >
            {reviewPayCtaLabel(resolved.summary.bookingAmountToPayInr)}
          </button>
        </div>
      </div>

      {resolved.option.isExpressDelivery ? (
        <ModifySelectionDeliveryOptionBottomSheet
          open={deliverySheetOpen}
          onClose={() => setDeliverySheetOpen(false)}
          onConfirm={persistDeliveryChoice}
          initialDeliveryChoice={resolved.deliveryChoice}
          expressDeliveryPriceInr={expressQuote.ackoDrivePriceInr}
          expressDeliveryLine={resolved.option.deliveryLine}
        />
      ) : null}
    </div>
  );
}
