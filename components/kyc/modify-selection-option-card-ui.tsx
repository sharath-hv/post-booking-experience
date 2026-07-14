"use client";

import Image from "next/image";
import { useState } from "react";

import { ShiviCallSheet } from "@/components/concierge/ShiviCallSheet";
import { GetHelpPillButton } from "@/components/kyc/GetHelpPillButton";
import { cn } from "@/lib/utils";

import radioOffIcon from "@/assets/Radio button off.svg";

/** Base shell for selectable modify-selection option cards (border only, no shadow). */
export const MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS =
  "w-full rounded-2xl border text-left transition-colors";

/** Flat bordered summary cards on review-and-pay (no shadow). */
export const MODIFY_SELECTION_SUMMARY_CARD_CLASS =
  "overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white";

/** Page lead + body — matches `ShiviDialogue` on concierge turns. */
export const MODIFY_SELECTION_LEAD_CLASS =
  "text-2xl font-medium leading-8 tracking-[-0.2px] text-[#121212]";
export const MODIFY_SELECTION_BODY_CLASS =
  "text-base font-normal leading-6 text-[#4b4b4b]";

export function modifySelectionSelectableCardClass(selected: boolean, readOnly = false) {
  if (readOnly) {
    return "border-[#e8e8e8] bg-white";
  }
  return selected
    ? "border-[#bda6e8] bg-white bg-[linear-gradient(to_bottom,#f4eefe,rgba(244,238,254,0))]"
    : "border-[#e8e8e8] bg-white";
}

/** Radio glyph — shared by the modify-selection hub and downstream pickers. */
export function ModifySelectionRadioIndicator({ selected }: { selected: boolean }) {
  if (!selected) {
    return (
      <span className="relative h-4 w-4 shrink-0" aria-hidden>
        <Image src={radioOffIcon} alt="" fill className="object-contain" unoptimized sizes="16px" />
      </span>
    );
  }
  return (
    <span className="relative h-4 w-4 shrink-0" aria-hidden>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="h-4 w-4">
        <circle cx="8" cy="8" r="7.4" stroke="#5920C5" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="4" fill="#5920C5" />
      </svg>
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
