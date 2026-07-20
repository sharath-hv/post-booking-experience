"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BookingCarSummaryCard } from "@/components/kyc/BookingCarSummaryCard";
import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import { ModifySelectionVariantCard } from "@/components/kyc/ModifySelectionVariantCard";
import { ModifySelectionVariantFilterChips } from "@/components/kyc/ModifySelectionVariantFilterChips";
import { writeModifySelectionVariantChoice } from "@/lib/modify-selection-variant-choice";
import { readModifySelectionVariantPending } from "@/lib/modify-selection-variant-pending";
import styles from "./ModifySelectionVariantScreen.module.scss";

import {
  MODIFY_SELECTION_CURRENT_SELECTION_HEADING,
  MODIFY_SELECTION_PAGE_SHELL_CLASS,
} from "@/lib/modify-selection-content";
import {
  filterModifySelectionVariants,
  getModifySelectionAvailableVariantOptions,
  MODIFY_SELECTION_AVAILABLE_VARIANTS_HEADING,
  MODIFY_SELECTION_VARIANT_COLOUR_PATH,
  MODIFY_SELECTION_VARIANT_SCREEN_SUBLINE,
  MODIFY_SELECTION_VARIANT_SCREEN_TITLE,
  type ModifySelectionVariantFilters,
} from "@/lib/modify-selection-variants-content";
import {
  modifySelectionCardStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/lib/modify-selection-stagger";

const {
  title: STAGGER_TITLE_MS,
  subtext: STAGGER_SUBTEXT_MS,
  section: STAGGER_CAR_SUMMARY_MS,
  heading: STAGGER_SECTION_HEADING_MS,
  filters: STAGGER_FILTERS_MS,
  firstCard: STAGGER_FIRST_VARIANT_MS,
} = MODIFY_SELECTION_STAGGER_MS;

/**
 * Change variant — booked car summary, quick filters, variant cards (Figma 2682:9105).
 */
export function ModifySelectionVariantScreen() {
  const router = useRouter();
  const allVariants = useMemo(() => getModifySelectionAvailableVariantOptions(), []);
  const [filters, setFilters] = useState<ModifySelectionVariantFilters>({
    fuel: null,
    transmission: null,
  });
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(() => {
    const pending = readModifySelectionVariantPending();
    return pending?.variantId ?? null;
  });

  const filteredVariants = useMemo(
    () => filterModifySelectionVariants(allVariants, filters),
    [allVariants, filters],
  );

  useEffect(() => {
    if (selectedVariantId == null) return;
    if (!filteredVariants.some((option) => option.id === selectedVariantId)) {
      setSelectedVariantId(null);
    }
  }, [filteredVariants, selectedVariantId]);

  const onContinue = useCallback(() => {
    if (selectedVariantId == null) return;
    writeModifySelectionVariantChoice(selectedVariantId);
    router.push(MODIFY_SELECTION_VARIANT_COLOUR_PATH);
  }, [router, selectedVariantId]);

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <ModifySelectionScreenHeader />

      <main className={styles.mx_auto_0}>
        <ModifySelectionPageHeading
          title={MODIFY_SELECTION_VARIANT_SCREEN_TITLE}
          subline={MODIFY_SELECTION_VARIANT_SCREEN_SUBLINE}
          titleDelayMs={STAGGER_TITLE_MS}
          sublineDelayMs={STAGGER_SUBTEXT_MS}
        />

        <section
          className={[styles.payment_success_stagger_1, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_CAR_SUMMARY_MS}ms` }}
          aria-labelledby="modify-selection-variant-current-selection-heading"
        >
          <h2
            id="modify-selection-variant-current-selection-heading"
            className={styles.text_sm_2}
          >
            {MODIFY_SELECTION_CURRENT_SELECTION_HEADING}
          </h2>
          <div className={styles.mt_3_3}>
            <BookingCarSummaryCard variant="detailsOnly" />
          </div>
        </section>

        <h2
          className={[styles.payment_success_stagger_4, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_SECTION_HEADING_MS}ms` }}
        >
          {MODIFY_SELECTION_AVAILABLE_VARIANTS_HEADING}
        </h2>

        <div
          className={[styles.payment_success_stagger_5, "payment-success-stagger"].filter(Boolean).join(" ")}
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
          className={styles.mt_4_6}
          role="group"
          aria-label={MODIFY_SELECTION_AVAILABLE_VARIANTS_HEADING}
        >
          {filteredVariants.length === 0 ? (
            <p className={styles.text_sm_7}>
              No variants match these filters. Try changing or clearing a filter.
            </p>
          ) : (
            filteredVariants.map((option, index) => (
              <div
                key={option.id}
                className={[styles.payment_success_stagger_8, "payment-success-stagger"].filter(Boolean).join(" ")}
                style={{
                  animationDelay: `${modifySelectionCardStaggerDelay(index, STAGGER_FIRST_VARIANT_MS)}ms`,
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

      <div className={[styles.fixed_9, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_10}>
          <button
            type="button"
            disabled={selectedVariantId == null}
            onClick={onContinue}
            className={[styles.primary_cta_11, "primary-cta"].filter(Boolean).join(" ")}
          >
            Continue
          </button>
        </div>
      </div>

    </div>
  );
}
