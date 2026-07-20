"use client";

import Image from "next/image";

import { splitBookingDeliveryLine } from "@/lib/experience-flow-content";
import {
  modifySelectionSelectableCardClass,
  MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS,
  ModifySelectionRadioIndicator,
} from "@/components/kyc/modify-selection-option-card-ui";
import { formatModifySelectionInr } from "@/lib/modify-selection-review-pay-content";
import { cn } from "@/lib/utils";
import styles from "./ModifySelectionDeliveryOptionCard.module.scss";


export type ModifySelectionDeliveryOptionCardProps = {
  selected: boolean;
  onSelect: () => void;
  deliveryLine: string;
  deliveryLineClass: string;
  iconSrc: string;
  priceInr: number;
};

/**
 * Express vs standard delivery row — shared by delivery sheet and review-and-pay.
 */
export function ModifySelectionDeliveryOptionCard({
  selected,
  onSelect,
  deliveryLine,
  deliveryLineClass,
  iconSrc,
  priceInr,
}: ModifySelectionDeliveryOptionCardProps) {
  const deliveryParts = splitBookingDeliveryLine(deliveryLine);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS,
        styles.p_4_8,
        modifySelectionSelectableCardClass(selected),
      )}
    >
      <div className={styles.flex_0}>
        <div className={styles.min_w_0_1}>
          <div className={styles.flex_2}>
            <p className={cn(styles.text_sm_9, deliveryLineClass)}>
              {deliveryParts ? (
                <>
                  {deliveryParts.prefix}
                  <span className={styles.font_semibold_3}>{deliveryParts.date}</span>
                </>
              ) : (
                deliveryLine
              )}
            </p>
            <span className={styles.relative_4} aria-hidden>
              <Image
                src={iconSrc}
                alt=""
                width={16}
                height={16}
                className={styles.size_4_5}
                unoptimized
                sizes="16px"
              />
            </span>
          </div>
          <p className={styles.mt_2_6}>
            {formatModifySelectionInr(priceInr)}
          </p>
        </div>
        <span className={styles.mt_0_5_7}>
          <ModifySelectionRadioIndicator selected={selected} />
        </span>
      </div>
    </button>
  );
}
