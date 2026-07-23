import { readChangeEntryStage } from "@/lib/change-policy";
import { isModifyWithChargesFlow } from "@/lib/experience-flow";
import type { ModifySelectionColourOption } from "@/lib/modify-selection-colours-content";
import {
  resolveModifySelectionColourQuote,
  type ModifySelectionDeliveryChoice,
} from "@/lib/modify-selection-colours-content";
import { MODIFY_BOOKING_CHANGE_FEE_INR } from "@/lib/manage-booking-modify";
import {
  MODIFY_SELECTION_REVIEW_PAY_DEMO_DEFINITIONS,
  type ModifySelectionReviewPayDemoScenario,
} from "@/lib/modify-selection-review-pay-demo";

/** Paid at booking lock — demo default when no scenario override (Figma 2696:9166). */
export const MODIFY_SELECTION_BOOKING_AMOUNT_PAID_INR = 10_000;

/** New booking lock for the updated selection — demo default (Figma 2696:9233). */
export const MODIFY_SELECTION_NEW_BOOKING_AMOUNT_INR = 15_000;

export const MODIFY_SELECTION_REVIEW_PAY_TITLE = "Ready to lock this in?";

export const MODIFY_SELECTION_REVIEW_PAY_DUE_TODAY_HEADING = "What you'll pay";
export const MODIFY_SELECTION_REVIEW_PAY_DUE_TODAY_LABEL = "Due today";
export const MODIFY_SELECTION_REVIEW_PAY_BREAKDOWN_TOGGLE = "How we calculated this";
/** Primary label on the expandable car-price summary row. */
export const MODIFY_SELECTION_REVIEW_PAY_ACKO_DRIVE_PRICE_LABEL =
  "ACKO Drive price";

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
  /** Plain-language situation for the due-today card — omitted when lock is unchanged. */
  situationLine: string | null;
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

  const situationLine =
    demo != null
      ? demo.situationLine
      : bookingAmountSurplusInr > 0
        ? "You've already paid more than this car's price lock."
        : lockDeltaInr > 0
          ? "This car needs a higher price lock."
          : null;

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
    situationLine,
    deliveryLine: quote.deliveryLine,
    isExpressDelivery: quote.isExpressDelivery,
  };
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
