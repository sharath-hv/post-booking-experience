"use client";

import Image from "next/image";

import { modifySelectionSelectableCardClass } from "@/components/kyc/modify-selection-option-card-ui";
import type { ModifySelectionCarBrandOption } from "@/lib/modify-selection-car-brands-content";
import { cn } from "@/lib/utils";
import styles from "./ModifySelectionCarBrandCard.module.scss";


type ModifySelectionCarBrandCardProps = {
  brand: ModifySelectionCarBrandOption;
  selected: boolean;
  onSelect: () => void;
};

/**
 * Brand tile — Figma 2686:11633 (98×88, logo on #f5f5f5, 12px label).
 */
export function ModifySelectionCarBrandCard({
  brand,
  selected,
  onSelect,
}: ModifySelectionCarBrandCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        styles.flex_4,
        modifySelectionSelectableCardClass(selected),
      )}
    >
      <div className={styles.flex_0}>
        <div className={styles.relative_1}>
          <Image
            src={brand.logoSrc}
            alt=""
            fill
            className={styles.object_contain_2}
            unoptimized
            sizes="32px"
          />
        </div>
      </div>
      <p className={styles.mt_auto_3}>
        {brand.name}
      </p>
    </button>
  );
}
