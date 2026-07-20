"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import { ModifySelectionVariantCard } from "@/components/kyc/ModifySelectionVariantCard";
import { ModifySelectionVariantFilterChips } from "@/components/kyc/ModifySelectionVariantFilterChips";
import {
  getModifySelectionCarBrandById,
  MODIFY_SELECTION_CAR_BRAND_PATH,
} from "@/lib/modify-selection-car-brands-content";
import {
  getModifySelectionCarModelById,
  modifySelectionCarModelPath,
} from "@/lib/modify-selection-car-models-content";
import { modifySelectionDifferentCarVariantScreenTitle } from "@/lib/modify-selection-different-car-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/lib/modify-selection-content";
import { modifySelectionDifferentCarColourPath } from "@/lib/modify-selection-different-car-paths";
import { readModifySelectionDifferentCarPending } from "@/lib/modify-selection-different-car-pending";
import { writeModifySelectionDifferentCarVariantChoice } from "@/lib/modify-selection-different-car-variant-choice";
import styles from "./ModifySelectionDifferentCarVariantScreen.module.scss";

import {
  filterModifySelectionVariants,
  getModifySelectionAvailableVariantOptions,
  type ModifySelectionVariantFilters,
} from "@/lib/modify-selection-variants-content";
import {
  modifySelectionListStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/lib/modify-selection-stagger";

const {
  title: STAGGER_TITLE_MS,
  filters: STAGGER_FILTERS_MS,
  firstListItem: STAGGER_FIRST_VARIANT_MS,
} = MODIFY_SELECTION_STAGGER_MS;

type ModifySelectionDifferentCarVariantScreenProps = {
  brandId: string;
  modelId: string;
};

/**
 * Choose a different car — variant picker with Continue CTA (aligned with change-variant flow).
 */
export function ModifySelectionDifferentCarVariantScreen({
  brandId,
  modelId,
}: ModifySelectionDifferentCarVariantScreenProps) {
  const router = useRouter();
  const brand = useMemo(() => getModifySelectionCarBrandById(brandId), [brandId]);
  const model = useMemo(
    () => getModifySelectionCarModelById(brandId, modelId),
    [brandId, modelId],
  );
  const allVariants = useMemo(() => getModifySelectionAvailableVariantOptions(), []);
  const [filters, setFilters] = useState<ModifySelectionVariantFilters>({
    fuel: null,
    transmission: null,
  });
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(() => {
    const pending = readModifySelectionDifferentCarPending();
    return pending?.brandId === brandId && pending.modelId === modelId
      ? pending.variantId
      : null;
  });

  const filteredVariants = useMemo(
    () => filterModifySelectionVariants(allVariants, filters),
    [allVariants, filters],
  );

  useEffect(() => {
    if (brand == null) {
      router.replace(MODIFY_SELECTION_CAR_BRAND_PATH);
    } else if (model == null) {
      router.replace(modifySelectionCarModelPath(brandId));
    }
  }, [brand, brandId, model, router]);

  useEffect(() => {
    if (selectedVariantId == null) return;
    if (!filteredVariants.some((option) => option.id === selectedVariantId)) {
      setSelectedVariantId(null);
    }
  }, [filteredVariants, selectedVariantId]);

  const onContinue = useCallback(() => {
    if (selectedVariantId == null) return;
    writeModifySelectionDifferentCarVariantChoice(selectedVariantId);
    router.push(modifySelectionDifferentCarColourPath(brandId, modelId));
  }, [brandId, modelId, router, selectedVariantId]);

  if (brand == null || model == null) {
    return null;
  }

  const title = modifySelectionDifferentCarVariantScreenTitle(model.name);

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <ModifySelectionScreenHeader />

      <main className={styles.mx_auto_0}>
        <ModifySelectionPageHeading
          title={title}
          titleDelayMs={STAGGER_TITLE_MS}
        />

        <div
          className={[styles.payment_success_stagger_1, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_FILTERS_MS}ms` }}
        >
          <ModifySelectionVariantFilterChips
            filters={filters}
            onFuelChange={(fuel) => setFilters((prev) => ({ ...prev, fuel }))}
            onTransmissionChange={(transmission) =>
              setFilters((prev) => ({ ...prev, transmission }))
            }
          />
        </div>

        <div
          className={styles.mt_4_2}
          role="group"
          aria-label={title}
        >
          {filteredVariants.length === 0 ? (
            <p className={styles.text_sm_3}>
              No variants match these filters. Try changing or clearing a filter.
            </p>
          ) : (
            filteredVariants.map((option, index) => (
              <div
                key={option.id}
                className={[styles.payment_success_stagger_4, "payment-success-stagger"].filter(Boolean).join(" ")}
                style={{
                  animationDelay: `${modifySelectionListStaggerDelay(index, STAGGER_FIRST_VARIANT_MS)}ms`,
                }}
              >
                <ModifySelectionVariantCard
                  option={option}
                  selected={selectedVariantId === option.id}
                  onSelect={() => setSelectedVariantId(option.id)}
                />
              </div>
            ))
          )}
        </div>
      </main>

      <div className={[styles.fixed_5, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_6}>
          <button
            type="button"
            disabled={selectedVariantId == null}
            onClick={onContinue}
            className={[styles.primary_cta_7, "primary-cta"].filter(Boolean).join(" ")}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
