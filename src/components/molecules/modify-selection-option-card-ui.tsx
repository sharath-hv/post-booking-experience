import { cn } from "@/utils/utils";

import styles from "./modify-selection-option-card-ui.module.scss";


/** Base shell for selectable modify-selection option cards (border only, no shadow). */
export const MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS = styles.modifySelectionSelectableCardBase;

/** Flat bordered summary cards on review-and-pay (no shadow). */
export const MODIFY_SELECTION_SUMMARY_CARD_CLASS = styles.modifySelectionSummaryCard;

/**
 * Page lead + body for standalone screens (modify selection, etc.).
 * Lead is semibold — distinct from concierge `ShiviDialogue` (medium).
 */
export const MODIFY_SELECTION_LEAD_CLASS = styles.modifySelectionLead;
export const MODIFY_SELECTION_BODY_CLASS = styles.modifySelectionBody;

export function modifySelectionSelectableCardClass(selected: boolean, readOnly = false) {
  if (readOnly) {
    return styles.modifySelectionCardIdle;
  }
  return selected ? styles.modifySelectionCardSelected : styles.modifySelectionCardIdle;
}

export function modifySelectionSelectableCardClassName(
  selected: boolean,
  readOnly = false,
  extra?: string,
) {
  return cn(
    MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS,
    modifySelectionSelectableCardClass(selected, readOnly),
    extra,
  );
}
