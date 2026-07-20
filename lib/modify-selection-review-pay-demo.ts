/**
 * Demo-only booking-amount scenarios for ModifySelectionReviewPayScreen.
 * Lets QA preview higher / lower / same lock deltas with and without the change fee.
 */

export const MODIFY_SELECTION_REVIEW_PAY_DEMO_STORAGE_KEY =
  "pbe_modify_review_pay_demo_v1";

export const MODIFY_SELECTION_REVIEW_PAY_DEMO_QUERY_KEY = "demo_booking";

export type ModifySelectionReviewPayDemoScenario =
  | "higher"
  | "higher_fee"
  | "lower"
  | "same"
  | "same_fee";

export const MODIFY_SELECTION_REVIEW_PAY_DEMO_SCENARIOS: readonly ModifySelectionReviewPayDemoScenario[] =
  ["higher", "higher_fee", "lower", "same", "same_fee"];

export const DEFAULT_MODIFY_SELECTION_REVIEW_PAY_DEMO_SCENARIO: ModifySelectionReviewPayDemoScenario =
  "higher";

export type ModifySelectionReviewPayDemoDefinition = {
  id: ModifySelectionReviewPayDemoScenario;
  /** Short label for the segmented demo control. */
  label: string;
  /** One-line situation copy above the booking math — null when redundant. */
  situationLine: string | null;
  newBookingAmountInr: number;
  bookingAmountPaidInr: number;
  /**
   * When true, forces the ₹5,000 change-fee line on (QA).
   * When false, fee still follows real policy (entry stage / flow).
   */
  forceChangeFee: boolean;
};

/** Paid lock is always ₹10,000 in the demo; new lock varies by case. */
export const MODIFY_SELECTION_REVIEW_PAY_DEMO_DEFINITIONS: Record<
  ModifySelectionReviewPayDemoScenario,
  ModifySelectionReviewPayDemoDefinition
> = {
  higher: {
    id: "higher",
    label: "Higher",
    situationLine: "This car needs a higher price lock.",
    newBookingAmountInr: 15_000,
    bookingAmountPaidInr: 10_000,
    forceChangeFee: false,
  },
  higher_fee: {
    id: "higher_fee",
    label: "Hi+fee",
    situationLine: "This car needs a higher price lock.",
    newBookingAmountInr: 15_000,
    bookingAmountPaidInr: 10_000,
    forceChangeFee: true,
  },
  lower: {
    id: "lower",
    label: "Lower",
    situationLine: "You've already paid more than this car's price lock.",
    newBookingAmountInr: 7_000,
    bookingAmountPaidInr: 10_000,
    forceChangeFee: false,
  },
  same: {
    id: "same",
    label: "Same",
    situationLine: null,
    newBookingAmountInr: 10_000,
    bookingAmountPaidInr: 10_000,
    forceChangeFee: false,
  },
  same_fee: {
    id: "same_fee",
    label: "Same+fee",
    situationLine: null,
    newBookingAmountInr: 10_000,
    bookingAmountPaidInr: 10_000,
    forceChangeFee: true,
  },
};

export function isModifySelectionReviewPayDemoScenario(
  value: string | null | undefined,
): value is ModifySelectionReviewPayDemoScenario {
  return (
    value === "higher" ||
    value === "higher_fee" ||
    value === "lower" ||
    value === "same" ||
    value === "same_fee"
  );
}

export function readModifySelectionReviewPayDemoScenario(): ModifySelectionReviewPayDemoScenario | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(MODIFY_SELECTION_REVIEW_PAY_DEMO_STORAGE_KEY);
    return isModifySelectionReviewPayDemoScenario(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeModifySelectionReviewPayDemoScenario(
  scenario: ModifySelectionReviewPayDemoScenario,
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MODIFY_SELECTION_REVIEW_PAY_DEMO_STORAGE_KEY, scenario);
  } catch {
    /* ignore */
  }
}

/**
 * Resolve demo scenario from URL query, then sessionStorage, then default.
 */
export function resolveModifySelectionReviewPayDemoScenario(
  queryValue: string | null | undefined,
): ModifySelectionReviewPayDemoScenario {
  if (isModifySelectionReviewPayDemoScenario(queryValue)) return queryValue;
  return (
    readModifySelectionReviewPayDemoScenario() ??
    DEFAULT_MODIFY_SELECTION_REVIEW_PAY_DEMO_SCENARIO
  );
}
