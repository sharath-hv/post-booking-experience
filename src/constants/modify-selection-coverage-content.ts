import {
  INSURANCE_TENURE_OPTIONS,
  type InsuranceTenureId,
  type InsuranceTenureOption,
} from "@/components/organisms/payment/insurance-coverage-content";

export const MODIFY_SELECTION_INSURANCE_PATH = "/booking/modify/insurance";
export const MODIFY_SELECTION_ACCESSORIES_PATH = "/booking/modify/accessories";

export const MODIFY_SELECTION_INSURANCE_SCREEN_TITLE = "Which insurance cover would you like?";
export const MODIFY_SELECTION_INSURANCE_SCREEN_SUBLINE =
  "Standard (1+3) or Extended cover (3+3) — I'll carry your pick onto this booking.";
export const MODIFY_SELECTION_INSURANCE_CONTINUE_CTA = "Continue";

export const MODIFY_SELECTION_ACCESSORY_SCREEN_TITLE = "Would you like to include car accessories?";
export const MODIFY_SELECTION_ACCESSORY_SCREEN_SUBLINE =
  "4 in 5 customers add an accessory kit to their booking.";
export const MODIFY_SELECTION_ACCESSORY_AVAILABLE_HEADING = "Accessory kit";
export const MODIFY_SELECTION_ACCESSORY_CONTINUE_CTA = "Continue";

export const MODIFY_SELECTION_DEFAULT_INSURANCE_TENURE: InsuranceTenureId = "1+3";
export const MODIFY_SELECTION_DEFAULT_ACCESSORY_SELECTED = true;

/** Standard first, then Extended — modify-selection only. Payment tenure stays Extended-first. */
export const MODIFY_SELECTION_INSURANCE_TENURE_OPTIONS: readonly InsuranceTenureOption[] = [
  ...INSURANCE_TENURE_OPTIONS.filter((option) => option.id === "1+3"),
  ...INSURANCE_TENURE_OPTIONS.filter((option) => option.id === "3+3"),
];

/** Extra vs Standard — the only insurance amount shown on the modify-selection tenure step. */
export const MODIFY_SELECTION_INSURANCE_EXTENDED_EXTRA_INR = 25_000;

export const MODIFY_SELECTION_BASIC_ACCESSORY_KIT_ID = "basic";
export const MODIFY_SELECTION_BASIC_ACCESSORY_KIT_INR = 4_999;
export const MODIFY_SELECTION_BASIC_ACCESSORY_KIT_COMPARE_AT_INR = 5_499;
export const MODIFY_SELECTION_BASIC_ACCESSORY_KIT_TITLE = "Basic accessory kit";
export const MODIFY_SELECTION_BASIC_ACCESSORY_ITEMS = [
  "Floor mat",
  "Perfume",
  "Idol",
  "Mud flap",
] as const;

export function modifySelectionInsuranceCardValue(tenure: InsuranceTenureId): string {
  return tenure === "3+3" ? "Extended cover (3+3)" : "Standard (1+3)";
}

export function modifySelectionInsuranceExtendedExtraLabel(extraInr: number): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(extraInr)));
  return `${formatted} extra`;
}

export const MODIFY_SELECTION_ACCESSORY_ADD_CTA = "Add";

export function modifySelectionAccessoryCardValue(selected: boolean): string {
  return selected ? MODIFY_SELECTION_BASIC_ACCESSORY_KIT_TITLE : MODIFY_SELECTION_ACCESSORY_ADD_CTA;
}
