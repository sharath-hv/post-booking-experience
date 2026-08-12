import { BOOKING_LOCK_AMOUNT_INR } from "@/helpers/paymentUrls";
import {
  isCancelDemoFlow,
  isCancelNoChargesFlow,
  isModifyNoChargesFlow,
  isModifyWithChargesFlow,
} from "@/helpers/experience-flow";
import {
  isChangeSelectionAllowedPhase,
  isDealerAllocatedChangeFeePhase,
  isPostVehicleIdentificationPhase,
  isPreDealerAllocationPhase,
  normalizeAppPathname,
  resolveJourneyPhase,
} from "@/helpers/journey-routes";

export { normalizeAppPathname };

/** 50% of booking lock — show amount in copy, not percentage. */
export const MODIFY_BOOKING_CANCEL_FEE_INR = BOOKING_LOCK_AMOUNT_INR / 2;

export const MODIFY_BOOKING_CHANGE_FEE_INR = 5_000;

export type ModifyBookingFeeTier = "free" | "standard";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Cancellation fee tier — free through dealer search (`/booking/processing`).
 * Standard from booking-accepted onward (50% of booking amount retained), including before OTP.
 */
export function resolveModifyBookingFeeTier(pathname: string): ModifyBookingFeeTier {
  if (isModifyNoChargesFlow() || isCancelNoChargesFlow()) {
    return "free";
  }
  const phase = resolveJourneyPhase(pathname);
  if (isPreDealerAllocationPhase(phase) || phase === "booking_processing") {
    return "free";
  }
  return "standard";
}

/**
 * Change-selection fee tier — free through dealer search;
 * ₹5,000 from `/booking/accepted` (partner locked) through allocation-pending.
 * OTP / booking-confirmed hides change entirely.
 */
export function resolveChangeSelectionFeeTier(pathname: string): ModifyBookingFeeTier {
  if (isModifyNoChargesFlow() || isCancelDemoFlow()) {
    return "free";
  }
  if (isModifyWithChargesFlow()) {
    return "standard";
  }
  const phase = resolveJourneyPhase(pathname);
  return isDealerAllocatedChangeFeePhase(phase) ? "standard" : "free";
}

export function modifyBookingCancelDescription(tier: ModifyBookingFeeTier): string {
  return tier === "free"
    ? "Free — everything you've paid comes back"
    : "50% of your booking amount is retained";
}

export function modifyBookingChangeDescription(tier: ModifyBookingFeeTier): string {
  return tier === "free"
    ? "No change fee"
    : `A ${formatInr(MODIFY_BOOKING_CHANGE_FEE_INR)} change fee applies if you switch your pick`;
}

/**
 * Whether Change selection should appear in the manage menu.
 * Hidden once engine/chassis are available (booking-confirmed+), or when the
 * vehicle-identification card is shown.
 */
export function isChangeSelectionMenuVisible(
  pathname: string,
  showVehicleIdentification = false,
): boolean {
  if (showVehicleIdentification) return false;
  const phase = resolveJourneyPhase(pathname);
  if (isPostVehicleIdentificationPhase(phase)) return false;
  return isChangeSelectionAllowedPhase(phase);
}

/**
 * Routes where money toward the car (beyond the ₹10k lock) has been paid or is
 * awaiting verification — Cancel must not be offered. URL params alone miss
 * screens like `/payment/full-cash-payment-confirmed?car_amount=…`.
 */
const CAR_PAYMENT_STARTED_PATHS = new Set<string>([
  "/payment/full-cash-payment-confirmed",
  "/payment/full-cash-payment-verification",
  "/payment/self-finance-transfer-confirmed",
  "/payment/self-finance-transfer-verification",
  "/payment/down-payment-dealer-confirmed",
  "/payment/down-payment-success",
  "/payment/down-payment-insurance-setup",
  "/payment/loan-disbursement-received",
  "/payment/margin-money-slip",
  "/payment/pay-insurance-premium",
  "/payment/insurance-addons",
  "/payment/choose-insurance-tenure",
  "/payment/insurance-premium-success",
  "/delivery/schedule",
  "/delivery/rto",
  "/delivery/rto/additional-documents",
  "/delivery/insurance-prep",
]);

export function isCarPaymentStartedPath(pathname: string): boolean {
  return CAR_PAYMENT_STARTED_PATHS.has(normalizeAppPathname(pathname));
}

/**
 * Paths where the customer has claimed payment but the dealer/bank has not
 * confirmed yet — manage summary must not show “Down payment paid”.
 */
const DOWN_PAYMENT_AWAITING_CONFIRMATION_PATHS = new Set<string>([
  "/payment/down-payment-dealer-confirmed",
  "/payment/full-cash-payment-verification",
  "/payment/self-finance-transfer-verification",
  "/payment/margin-money-slip",
]);

/**
 * True when manage-booking may show car DP as settled (paid).
 * Stricter than {@link isCarPaymentStartedPath} (cancel still hides on await routes).
 */
export function isDownPaymentSettledForSummaryPath(pathname: string): boolean {
  const path = normalizeAppPathname(pathname);
  if (!CAR_PAYMENT_STARTED_PATHS.has(path)) return false;
  if (DOWN_PAYMENT_AWAITING_CONFIRMATION_PATHS.has(path)) return false;
  return true;
}

export type CarPaymentStartedSignals = {
  pathname: string;
  /** Paid toward loan DP (partial). */
  downPaymentPaidInr?: number;
  downPaymentFullyPaid?: boolean;
  /** Paid toward full-payment instalments (`bank=full_payment` URL plan). */
  fullPaymentPaidInr?: number;
};

/**
 * True once the customer has paid (or submitted) money toward the car beyond the lock.
 */
export function hasCarPaymentStarted(signals: CarPaymentStartedSignals): boolean {
  if (isCarPaymentStartedPath(signals.pathname)) return true;
  const dpPaid = Math.max(0, signals.downPaymentPaidInr ?? 0);
  const fullPaid = Math.max(0, signals.fullPaymentPaidInr ?? 0);
  return dpPaid > 0 || Boolean(signals.downPaymentFullyPaid) || fullPaid > 0;
}

/**
 * Whether Cancel should appear in the manage menu.
 * Hidden once car payment beyond the lock has started.
 */
export function isCancelBookingMenuVisible(carPaymentStarted: boolean): boolean {
  return !carPaymentStarted;
}
