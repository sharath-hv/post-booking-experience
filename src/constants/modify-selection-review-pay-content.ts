import { readChangeEntryStage } from "@/constants/change-policy";
import { isModifyWithChargesFlow } from "@/helpers/experience-flow";
import type { ModifySelectionColourOption } from "@/constants/modify-selection-colours-content";
import {
  resolveModifySelectionColourQuote,
  type ModifySelectionDeliveryChoice,
} from "@/constants/modify-selection-colours-content";
import { MODIFY_BOOKING_CHANGE_FEE_INR } from "@/helpers/manage-booking-modify";
import {
  MODIFY_SELECTION_REVIEW_PAY_DEMO_DEFINITIONS,
  type ModifySelectionReviewPayDemoScenario,
} from "@/helpers/modify-selection-review-pay-demo";

/** Paid at booking lock — demo default when no scenario override (Figma 2696:9166). */
export const MODIFY_SELECTION_BOOKING_AMOUNT_PAID_INR = 10_000;

/** New booking lock for the updated selection — demo default (Figma 2696:9233). */
export const MODIFY_SELECTION_NEW_BOOKING_AMOUNT_INR = 15_000;

export const MODIFY_SELECTION_REVIEW_PAY_TITLE = "Confirm your changes";

/** Sticky footer + booking card — what the user pays on this step. */
export const MODIFY_SELECTION_REVIEW_PAY_NOW_LABEL = "Amount due";
export const MODIFY_SELECTION_REVIEW_PAY_NOTHING_DUE_LABEL = "No payment needed";
export const MODIFY_SELECTION_REVIEW_PAY_BREAKDOWN_TOGGLE = "How we calculated this";
/** Full on-road style price — secondary to the pay-now card. */
export const MODIFY_SELECTION_REVIEW_PAY_ACKO_DRIVE_PRICE_LABEL = "ACKO Drive price";
export const MODIFY_SELECTION_REVIEW_PAY_CAR_PRICE_HINT =
  "Your car's full on-road price. This step only covers the booking update.";

/**
 * Lock/fee shape for the booking-amount card.
 * Covers the five demo cases plus lower+fee if policy ever stacks both.
 */
export type ModifySelectionBookingAmountCase =
  | "higher"
  | "higher_fee"
  | "lower"
  | "lower_fee"
  | "same"
  | "same_fee";

export type ModifySelectionBookingAmountCardCopy = {
  caseId: ModifySelectionBookingAmountCase;
  dueLabel: string;
  /** One why-line under the amount — never stacks fee + situation as separate lines. */
  whyLine: string;
  priceLockTopUpInr: number;
  /**
   * Big number in the hero. Null when a ₹0 would feel empty (e.g. same lock, covered).
   * For surplus cases this is the credit amount, not the ₹0 due.
   */
  heroAmountInr: number | null;
  /** Visual tone for the hero amount. */
  heroAmountTone: "pay" | "credit";
  /** Breakdown footer label — “Amount due” or “Amount adjusted” for surplus. */
  totalLabel: string;
  /** Breakdown footer amount — due today, or surplus adjusted on lower (no fee). */
  totalAmountInr: number;
};
/** Price summary demo totals — Figma 2699:9390. */
export const MODIFY_SELECTION_PRICE_SUMMARY_DEMO = {
  exShowroomPriceInr: 2_016_300,
  otherChargesTotalInr: 1_365_301,
  totalDiscountInr: 104_871,
  ackoDriveDiscountInr: 69_701,
  ackoDrivePriceInr: 2_256_565,
} as const;

/** Demo line items inside “Other charges” (Figma 2699:9401). */
export const MODIFY_SELECTION_OTHER_CHARGES_LINE_ITEMS: readonly {
  label: string;
  amountInr: number;
}[] = [
  { label: "Registration amount", amountInr: 254_693 },
  { label: "Dealer Insurance premium", amountInr: 64_880 },
  { label: "Tax collected at source", amountInr: 20_163 },
  { label: "FasTag", amountInr: 850 },
  { label: "HSRP number plate charges", amountInr: 850 },
] as const;

export type ModifySelectionReviewPaySummary = {
  exShowroomPriceInr: number;
  otherChargesTotalInr: number;
  ackoDrivePriceInr: number;
  ackoDriveDiscountInr: number;
  totalDiscountInr: number;
  newBookingAmountInr: number;
  bookingAmountPaidInr: number;
  /** ₹5,000 when change fee applies — one-time change fee. */
  changeSelectionFeeInr: number;
  bookingAmountToPayInr: number;
  /**
   * When paid lock exceeds new lock — surplus adjusted into final car amount (not refunded here).
   */
  bookingAmountSurplusInr: number;
  deliveryLine: string;
  isExpressDelivery: boolean;
};

export type BuildModifySelectionReviewPaySummaryOptions = {
  /** Demo-only override — drives lock amounts and fee for QA scenario previews. */
  demoScenario?: ModifySelectionReviewPayDemoScenario;
};

function resolvePolicyChangeFeeInr(): number {
  // ₹5,000 one-time change fee applies from partner locked / booking-accepted (policy §1.9):
  // modify-with-charges demo flow, or express/standard entering after dealer found.
  return isModifyWithChargesFlow() || readChangeEntryStage() === "post"
    ? MODIFY_BOOKING_CHANGE_FEE_INR
    : 0;
}

export function buildModifySelectionColourReviewPaySummary(
  option: ModifySelectionColourOption,
  deliveryChoice: ModifySelectionDeliveryChoice,
  options?: BuildModifySelectionReviewPaySummaryOptions,
): ModifySelectionReviewPaySummary {
  const quote = resolveModifySelectionColourQuote(option, deliveryChoice);
  const { exShowroomPriceInr, otherChargesTotalInr, totalDiscountInr, ackoDriveDiscountInr, ackoDrivePriceInr } =
    MODIFY_SELECTION_PRICE_SUMMARY_DEMO;

  const demo =
    options?.demoScenario != null
      ? MODIFY_SELECTION_REVIEW_PAY_DEMO_DEFINITIONS[options.demoScenario]
      : null;

  const newBookingAmountInr =
    demo?.newBookingAmountInr ?? MODIFY_SELECTION_NEW_BOOKING_AMOUNT_INR;
  const bookingAmountPaidInr =
    demo?.bookingAmountPaidInr ?? MODIFY_SELECTION_BOOKING_AMOUNT_PAID_INR;
  // Demo lock amounts can still apply; fee follows real policy unless a
  // `*_fee` scenario explicitly forces the ₹5,000 line on for QA.
  const changeSelectionFeeInr =
    demo?.forceChangeFee === true
      ? MODIFY_BOOKING_CHANGE_FEE_INR
      : resolvePolicyChangeFeeInr();

  const lockDeltaInr = newBookingAmountInr - bookingAmountPaidInr;
  const bookingAmountToPayInr = Math.max(0, lockDeltaInr) + changeSelectionFeeInr;
  const bookingAmountSurplusInr = Math.max(0, -lockDeltaInr);

  return {
    exShowroomPriceInr,
    otherChargesTotalInr,
    ackoDrivePriceInr,
    ackoDriveDiscountInr,
    totalDiscountInr,
    newBookingAmountInr,
    bookingAmountPaidInr,
    changeSelectionFeeInr,
    bookingAmountToPayInr,
    bookingAmountSurplusInr,
    deliveryLine: quote.deliveryLine,
    isExpressDelivery: quote.isExpressDelivery,
  };
}

/**
 * Card IA for review-and-pay booking amount — one label, one meaningful amount, one why-line.
 * Lower/surplus cases lead with the credit (not ₹0). Fee math stays in the breakdown.
 */
export function getModifySelectionBookingAmountCardCopy(
  summary: Pick<
    ModifySelectionReviewPaySummary,
    | "newBookingAmountInr"
    | "bookingAmountPaidInr"
    | "changeSelectionFeeInr"
    | "bookingAmountToPayInr"
    | "bookingAmountSurplusInr"
  >,
): ModifySelectionBookingAmountCardCopy {
  const priceLockTopUpInr = Math.max(
    0,
    summary.newBookingAmountInr - summary.bookingAmountPaidInr,
  );
  const surplusInr = summary.bookingAmountSurplusInr;
  const feeInr = summary.changeSelectionFeeInr;
  const dueInr = summary.bookingAmountToPayInr;
  const hasFee = feeInr > 0;

  let caseId: ModifySelectionBookingAmountCase;
  if (priceLockTopUpInr > 0) {
    caseId = hasFee ? "higher_fee" : "higher";
  } else if (surplusInr > 0) {
    caseId = hasFee ? "lower_fee" : "lower";
  } else {
    caseId = hasFee ? "same_fee" : "same";
  }

  switch (caseId) {
    case "higher":
      return {
        caseId,
        dueLabel: MODIFY_SELECTION_REVIEW_PAY_NOW_LABEL,
        whyLine: "Your new car has a higher booking amount",
        priceLockTopUpInr,
        heroAmountInr: dueInr,
        heroAmountTone: "pay",
        totalLabel: MODIFY_SELECTION_REVIEW_PAY_NOW_LABEL,
        totalAmountInr: dueInr,
      };
    case "higher_fee":
      return {
        caseId,
        dueLabel: MODIFY_SELECTION_REVIEW_PAY_NOW_LABEL,
        whyLine: `Your new car has a higher booking amount. A one-time ${formatModifySelectionInr(feeInr)} change fee also applies`,
        priceLockTopUpInr,
        heroAmountInr: dueInr,
        heroAmountTone: "pay",
        totalLabel: MODIFY_SELECTION_REVIEW_PAY_NOW_LABEL,
        totalAmountInr: dueInr,
      };
    case "lower":
      return {
        caseId,
        dueLabel: "Comes off your final car price",
        whyLine: `Your new car has a lower booking amount. The ${formatModifySelectionInr(surplusInr)} extra comes off your car's final price.`,
        priceLockTopUpInr,
        heroAmountInr: surplusInr,
        heroAmountTone: "credit",
        totalLabel: "Amount adjusted",
        totalAmountInr: surplusInr,
      };
    case "lower_fee":
      return {
        caseId,
        dueLabel: MODIFY_SELECTION_REVIEW_PAY_NOW_LABEL,
        whyLine: `${formatModifySelectionInr(surplusInr)} will come off the final price. You only pay the change fee now.`,
        priceLockTopUpInr,
        heroAmountInr: dueInr,
        heroAmountTone: "pay",
        totalLabel: MODIFY_SELECTION_REVIEW_PAY_NOW_LABEL,
        totalAmountInr: dueInr,
      };
    case "same":
      return {
        caseId,
        dueLabel: MODIFY_SELECTION_REVIEW_PAY_NOTHING_DUE_LABEL,
        whyLine: "You've already paid for this booking.",
        priceLockTopUpInr,
        heroAmountInr: null,
        heroAmountTone: "pay",
        totalLabel: MODIFY_SELECTION_REVIEW_PAY_NOW_LABEL,
        totalAmountInr: dueInr,
      };
    case "same_fee":
      return {
        caseId,
        dueLabel: "One-time fee",
        whyLine: "This is a one-time fee for updating your booking",
        priceLockTopUpInr,
        heroAmountInr: dueInr,
        heroAmountTone: "pay",
        totalLabel: MODIFY_SELECTION_REVIEW_PAY_NOW_LABEL,
        totalAmountInr: dueInr,
      };
  }
}

export function formatModifySelectionInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

export function formatModifySelectionInrSigned(amount: number): string {
  const formatted = formatModifySelectionInr(Math.abs(amount));
  if (amount < 0) return `-${formatted}`;
  return formatted;
}
