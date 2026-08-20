import { FULL_PAYMENT_INSURANCE_INR } from "@/constants/loan-amount-demo-constants";
import {
  BOOKING_AMOUNT_QUERY,
  BOOKING_LOCK_AMOUNT_INR,
  FULL_PAYMENT_BANK_ID,
  INSURANCE_PAYMENT_KIND,
} from "@/helpers/paymentUrls";

type SearchParamsLike = {
  get(name: string): string | null;
};

function parsePositiveAmount(raw: string | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}

export type PaymentCheckoutMeta = {
  totalDue: number;
  originalDownPayment: number;
  checkoutSubtitle: string;
  isDownPaymentFromUrl: boolean;
  isBookingLockCheckout: boolean;
  bookingLockDue: number;
  returnSource: string | null;
  isFullPayment: boolean;
  isInsurancePayment: boolean;
};

/**
 * Shape mock-checkout query params into the checkout view model.
 * Demo stand-in for a payment-intent API reader.
 */
export function readPaymentCheckoutQuery(
  searchParams: SearchParamsLike,
): PaymentCheckoutMeta {
  const downPayment = parsePositiveAmount(searchParams.get("down_payment"));
  const hasDownPaymentParam = downPayment != null;
  const due = hasDownPaymentParam ? downPayment : BOOKING_LOCK_AMOUNT_INR;
  const originalFromUrl = parsePositiveAmount(
    searchParams.get("original_down_payment"),
  );
  const originalDownPayment =
    hasDownPaymentParam && originalFromUrl != null ? originalFromUrl : due;
  const isFullPayment = searchParams.get("bank") === FULL_PAYMENT_BANK_ID;
  const isInsurancePayment =
    searchParams.get("payment_kind") === INSURANCE_PAYMENT_KIND;
  const insuranceDue =
    isInsurancePayment && hasDownPaymentParam ? due : FULL_PAYMENT_INSURANCE_INR;
  const isBookingLockCheckout = !hasDownPaymentParam && !isInsurancePayment;
  const bookingLockDue = isBookingLockCheckout
    ? parsePositiveAmount(searchParams.get(BOOKING_AMOUNT_QUERY)) ??
      BOOKING_LOCK_AMOUNT_INR
    : BOOKING_LOCK_AMOUNT_INR;

  return {
    totalDue: isInsurancePayment ? insuranceDue : due,
    originalDownPayment: isInsurancePayment ? insuranceDue : originalDownPayment,
    checkoutSubtitle: isInsurancePayment
      ? "Insurance premium · incl. applicable taxes"
      : hasDownPaymentParam
        ? isFullPayment
          ? "Full payment · incl. applicable taxes"
          : "Down payment · incl. applicable taxes"
        : "Booking amount · incl. applicable taxes",
    isDownPaymentFromUrl: hasDownPaymentParam,
    isBookingLockCheckout,
    bookingLockDue,
    returnSource: searchParams.get("return_source"),
    isFullPayment,
    isInsurancePayment,
  };
}

export function parsePositiveIntQuery(raw: string | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}
