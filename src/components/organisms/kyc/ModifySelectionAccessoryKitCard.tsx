"use client";

import { Check } from "lucide-react";

import {
  INSURANCE_ADDON_ADD_LABEL,
  INSURANCE_ADDON_ADDED_LABEL,
} from "@/components/organisms/payment/insurance-coverage-content";
import { formatModifySelectionInr } from "@/constants/modify-selection-review-pay-content";
import {
  MODIFY_SELECTION_BASIC_ACCESSORY_ITEMS,
  MODIFY_SELECTION_BASIC_ACCESSORY_KIT_COMPARE_AT_INR,
  MODIFY_SELECTION_BASIC_ACCESSORY_KIT_ID,
  MODIFY_SELECTION_BASIC_ACCESSORY_KIT_INR,
  MODIFY_SELECTION_BASIC_ACCESSORY_KIT_TITLE,
} from "@/constants/modify-selection-coverage-content";
import { cn } from "@/utils/utils";
import styles from "./ModifySelectionAccessoryKitCard.module.scss";

type ModifySelectionAccessoryKitCardProps = {
  selected: boolean;
  onToggle: (id: string) => void;
};

/**
 * Basic accessory kit — included items, price + Add/Added.
 */
export function ModifySelectionAccessoryKitCard({
  selected,
  onToggle,
}: ModifySelectionAccessoryKitCardProps) {
  const price = formatModifySelectionInr(MODIFY_SELECTION_BASIC_ACCESSORY_KIT_INR);
  const compareAt = formatModifySelectionInr(MODIFY_SELECTION_BASIC_ACCESSORY_KIT_COMPARE_AT_INR);

  return (
    <article
      id={`insurance-addon-${MODIFY_SELECTION_BASIC_ACCESSORY_KIT_ID}`}
      className={cn(styles.card, selected && styles.cardSelected)}
      aria-label={`${MODIFY_SELECTION_BASIC_ACCESSORY_KIT_TITLE}, ${price}`}
    >
      <div className={styles.body}>
        <h3 className={styles.title}>{MODIFY_SELECTION_BASIC_ACCESSORY_KIT_TITLE}</h3>
        <ul className={styles.items}>
          {MODIFY_SELECTION_BASIC_ACCESSORY_ITEMS.map((item) => (
            <li key={item} className={styles.item}>
              <span className={styles.itemIcon} aria-hidden>
                <Check size={10} strokeWidth={2.5} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.footer}>
        <p className={styles.priceRow}>
          <span className={styles.price}>{price}</span>
          <span className={styles.compareAt}>{compareAt}</span>
        </p>
        <button
          type="button"
          onClick={() => onToggle(MODIFY_SELECTION_BASIC_ACCESSORY_KIT_ID)}
          aria-pressed={selected}
          className={cn(styles.addBtn, selected && styles.addBtnSelected)}
        >
          {selected ? (
            <>
              <Check size={14} strokeWidth={2.5} aria-hidden />
              {INSURANCE_ADDON_ADDED_LABEL}
            </>
          ) : (
            INSURANCE_ADDON_ADD_LABEL
          )}
        </button>
      </div>
    </article>
  );
}
