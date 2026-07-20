"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import { ModifySelectionCarBrandCard } from "@/components/kyc/ModifySelectionCarBrandCard";
import {
  MODIFY_SELECTION_CAR_BRAND_OPTIONS,
  MODIFY_SELECTION_CAR_BRAND_SCREEN_TITLE,
} from "@/lib/modify-selection-car-brands-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/lib/modify-selection-content";
import { MODIFY_SELECTION_STAGGER_MS } from "@/lib/modify-selection-stagger";
import styles from "./ModifySelectionCarBrandScreen.module.scss";


const {
  title: STAGGER_TITLE_MS,
  brandGrid: STAGGER_GRID_MS,
  brandStep: STAGGER_BRAND_STEP_MS,
} = MODIFY_SELECTION_STAGGER_MS;

/**
 * Choose a different car — brand grid (Figma 2686:11633).
 */
export function ModifySelectionCarBrandScreen() {
  const router = useRouter();

  const onSelectBrand = useCallback(
    (brandId: string) => {
      router.push(`/kyc/modify-selection/different-car/${brandId}`);
    },
    [router],
  );

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <ModifySelectionScreenHeader />

      <main className={styles.mx_auto_0}>
        <ModifySelectionPageHeading
          title={MODIFY_SELECTION_CAR_BRAND_SCREEN_TITLE}
          titleDelayMs={STAGGER_TITLE_MS}
        />

        <div
          className={[styles.payment_success_stagger_1, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_GRID_MS}ms` }}
          role="group"
          aria-label={MODIFY_SELECTION_CAR_BRAND_SCREEN_TITLE}
        >
          {MODIFY_SELECTION_CAR_BRAND_OPTIONS.map((brand, index) => (
            <div
              key={brand.id}
              className={[styles.payment_success_stagger_2, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{
                animationDelay: `${STAGGER_GRID_MS + index * STAGGER_BRAND_STEP_MS}ms`,
              }}
            >
              <ModifySelectionCarBrandCard
                brand={brand}
                selected={false}
                onSelect={() => onSelectBrand(brand.id)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
