/**
 * Canonical post-booking paths (no `basePath` prefix).
 * Use for `href`, `router.push`, and milestone rules — not for static assets.
 */
export const JOURNEY_PATHS = {
  kyc: {
    hub: "/kyc",
    upload: "/kyc/upload",
    documentsReceived: "/kyc/documents-received",
    verificationInProgress: "/kyc/verification-in-progress",
    verificationFailed: "/kyc/verification-failed",
    manualVerification: "/kyc/manual-verification",
    processing: "/kyc/processing",
    bookingConfirmed: "/kyc/booking-confirmed",
    bookingAccepted: "/kyc/booking-accepted",
    modifySelection: "/kyc/modify-selection",
    cancelBooking: "/kyc/cancel-booking",
  },
  buyingGuide: {
    entry: "/kyc/buying-guide/1",
    exit: "/kyc",
  },
  carAllocation: {
    pending: "/car-allocation/pending",
    confirmed: "/car-allocation/confirmed",
    failed: "/car-allocation/failed",
  },
  payment: {
    /** Arrival after price-lock — before KYC / dealer (not the money chapter). */
    bookingSuccess: "/payment/booking-success",
    default: "/payment/default",
    choose: "/payment/choose",
    payDownPayment: "/payment/pay-down-payment",
    dealerDownPaymentConfirmed: "/payment/down-payment-dealer-confirmed",
    loanDisbursementReceived: "/payment/loan-disbursement-received",
  },
} as const;

export type JourneyPhase =
  | "identity_verification"
  | "kyc_documents"
  | "booking_processing"
  | "buying_guide"
  | "booking_celebration"
  | "booking_accepted"
  | "car_allocation"
  | "payment"
  | "delivery"
  | "unknown";

const IDENTITY_VERIFICATION_PATHS = new Set<string>([JOURNEY_PATHS.kyc.hub]);

const KYC_DOCUMENT_PATHS = new Set<string>([
  JOURNEY_PATHS.kyc.upload,
  JOURNEY_PATHS.kyc.documentsReceived,
  JOURNEY_PATHS.kyc.verificationInProgress,
  JOURNEY_PATHS.kyc.verificationFailed,
  JOURNEY_PATHS.kyc.manualVerification,
]);

const BUYING_GUIDE_STEP_PATH = /^\/kyc\/buying-guide\/[1-3]$/;
const CAR_ALLOCATION_PATH = /^\/car-allocation\//;
const KYC_CAR_ALLOCATION_LEGACY = /^\/kyc\/car-allocation-/;
const DELIVERY_PATH = /^\/kyc\/car-delivery-/;
const PAYMENT_PATH = /^\/payment\//;

/**
 * Strip trailing slashes so route rules match `trailingSlash: true` URLs
 * (e.g. `/kyc/` → `/kyc`).
 */
export function normalizeAppPathname(pathname: string): string {
  let path = pathname || "/";

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path || "/";
}

export function buyingGuideStepPath(step: number): string {
  return `/kyc/buying-guide/${step}`;
}

/**
 * Maps the current URL to a journey phase for copy, fees, and flow branching.
 * Phases are coarse — use URL parsers elsewhere for payment instalment state.
 */
export function resolveJourneyPhase(pathname: string): JourneyPhase {
  const path = normalizeAppPathname(pathname);

  // Price-lock arrival — before KYC / dealer. Must not use the money-chapter `payment` phase
  // (that would hide Change and charge Cancel).
  if (path === JOURNEY_PATHS.payment.bookingSuccess) {
    return "identity_verification";
  }
  if (IDENTITY_VERIFICATION_PATHS.has(path)) {
    return "identity_verification";
  }
  if (KYC_DOCUMENT_PATHS.has(path)) {
    return "kyc_documents";
  }
  if (path === JOURNEY_PATHS.kyc.processing) {
    return "booking_processing";
  }
  if (BUYING_GUIDE_STEP_PATH.test(path)) {
    return "buying_guide";
  }
  if (path === JOURNEY_PATHS.kyc.bookingConfirmed) {
    return "booking_celebration";
  }
  if (path === JOURNEY_PATHS.kyc.bookingAccepted) {
    return "booking_accepted";
  }
  // Exact unit with engine/chassis — same fee/visibility gate as booking-confirmed.
  if (path === JOURNEY_PATHS.carAllocation.confirmed) {
    return "booking_celebration";
  }
  // Pending / failed — manufacturing or edge case; no engine/chassis yet.
  if (CAR_ALLOCATION_PATH.test(path) || KYC_CAR_ALLOCATION_LEGACY.test(path)) {
    return "car_allocation";
  }
  if (DELIVERY_PATH.test(path)) {
    return "delivery";
  }
  if (PAYMENT_PATH.test(path)) {
    return "payment";
  }

  return "unknown";
}

/** Verify identity → KYC docs → processing booking (inclusive). */
export function isIdentityFunnelPhase(phase: JourneyPhase): boolean {
  return (
    phase === "identity_verification" ||
    phase === "kyc_documents" ||
    phase === "booking_processing"
  );
}

/**
 * Before a dealer partner is assigned — `/kyc` through verification only.
 * `/kyc/processing` assigns the partner (working done) and is post-allocation.
 */
export function isPreDealerAllocationPhase(phase: JourneyPhase): boolean {
  return phase === "identity_verification" || phase === "kyc_documents";
}

/**
 * Change selection is allowed only before vehicle ID (engine/chassis).
 * Free before dealer assigned; ₹5,000 from partner assigned through allocation-pending.
 * Blocked once engine/chassis exist (booking-confirmed / allocation-confirmed+).
 */
export function isChangeSelectionAllowedPhase(phase: JourneyPhase): boolean {
  return (
    isPreDealerAllocationPhase(phase) ||
    phase === "booking_processing" ||
    phase === "booking_accepted" ||
    phase === "car_allocation"
  );
}

/** @deprecated Use `isChangeSelectionAllowedPhase`. */
export function isChangeSelectionAvailablePhase(phase: JourneyPhase): boolean {
  return isChangeSelectionAllowedPhase(phase);
}

/**
 * ₹5,000 change fee applies once a dealer partner is assigned
 * (`/kyc/processing` onward, including allocation-pending — still no VIN).
 * OTP is manufacturer-portal confirmation; VIN is what blocks further changes.
 */
export function isDealerAllocatedChangeFeePhase(phase: JourneyPhase): boolean {
  return (
    phase === "booking_processing" ||
    phase === "booking_accepted" ||
    phase === "car_allocation"
  );
}

/** @deprecated Use `isDealerAllocatedChangeFeePhase`. */
export function isPostCarAllocationChangeFeePhase(phase: JourneyPhase): boolean {
  return isDealerAllocatedChangeFeePhase(phase);
}

/**
 * Engine/chassis available — change selection must not be offered.
 * booking-confirmed / allocation-confirmed (`booking_celebration`), then money / delivery.
 * Does **not** include allocation-pending (manufacturing sorted, no VIN yet).
 */
export function isPostVehicleIdentificationPhase(phase: JourneyPhase): boolean {
  return (
    phase === "booking_celebration" ||
    phase === "buying_guide" ||
    phase === "payment" ||
    phase === "delivery"
  );
}
