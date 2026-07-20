"use client";

import Image from "next/image";
import { useState } from "react";

import { ShiviCallSheet } from "@/components/concierge/ShiviCallSheet";
import { GetHelpPillButton } from "@/components/kyc/GetHelpPillButton";
import { cn } from "@/lib/utils";

import radioOffIcon from "@/assets/Radio button off.svg";
import radioOnIcon from "@/assets/Radio button on.svg";
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

/** Radio glyph — shared by the modify-selection hub and downstream pickers. */
export function ModifySelectionRadioIndicator({ selected }: { selected: boolean }) {
  const src = selected ? radioOnIcon : radioOffIcon;

  return (
    <span className={styles.relative_0} aria-hidden>
      <Image src={src} alt="" fill className={styles.object_contain_1} unoptimized sizes="16px" />
    </span>
  );
}

/** Nav “Get help” — opens Shivi’s callback confirmation sheet. */
export function ModifySelectionGetHelpButton() {
  const [callSheetOpen, setCallSheetOpen] = useState(false);

  return (
    <>
      <GetHelpPillButton onClick={() => setCallSheetOpen(true)} />
      <ShiviCallSheet open={callSheetOpen} onClose={() => setCallSheetOpen(false)} />
    </>
  );
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
