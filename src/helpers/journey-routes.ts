/**
 * Canonical post-booking paths (no `basePath` prefix).
 * Use for `href`, `router.push`, and milestone rules — not for static assets.
 *
 * Chapters:
 * - booking — arrival, dealer search, partner lock, car reserved, modify/cancel
 * - onboarding — buying guide
 * - identity — PAN/Aadhaar collect + docs received
 * - kyc — verification outcome screens only
 * - carAllocation — manufacturing / unit assignment
 * - payment — money plan
 * - delivery — RTO / schedule (post-money)
 */
export const JOURNEY_PATHS = {
  quote: "/quote",
  booking: {
    /** Price-lock arrival / Shivi intro (not the money chapter). */
    received: "/booking/received",
    receivedNext: "/booking/received/next",
    /** Dealer search / booking processing. */
    processing: "/booking/processing",
    /** Partner locked — OTP. */
    accepted: "/booking/accepted",
    /** Car reserved — VIN on card (express). */
    confirmed: "/booking/confirmed",
    modify: "/booking/modify",
    cancel: "/booking/cancel",
    cancelSuccess: "/booking/cancel/success",
  },
  onboarding: {
    entry: "/onboarding/1",
    exit: "/identity",
  },
  identity: {
    hub: "/identity",
    upload: "/identity/upload",
    documentsReceived: "/identity/documents-received",
  },
  /** Verification screens only — not identity upload or booking. */
  kyc: {
    verificationInProgress: "/kyc/verification-in-progress",
    verificationFailed: "/kyc/verification-failed",
    manualVerification: "/kyc/manual-verification",
    verificationCancelled: "/kyc/verification-cancelled",
  },
  carAllocation: {
    pending: "/car-allocation/pending",
    /** Standard demo — car built early; user chooses early vs original date. */
    earlyOffer: "/car-allocation/early-offer",
    /** Standard demo — confirming early delivery with partner. */
    earlyConfirming: "/car-allocation/early-confirming",
    /** Standard demo — user kept original date; manufacturing wait resumes. */
    keepingDate: "/car-allocation/keeping-date",
    confirmed: "/car-allocation/confirmed",
    failed: "/car-allocation/failed",
    /** Express demo — selected variant discontinued; no standard-delivery out. */
    variantUnavailable: "/car-allocation/variant-unavailable",
    /** Decision SLA timed out on allocation remediation. */
    decisionCancelled: "/car-allocation/decision-cancelled",
  },
  payment: {
    /** Legacy URL — client-redirects to `choose` (money intro merged into car-assigned). */
    default: "/payment/default",
    choose: "/payment/choose",
    payDownPayment: "/payment/pay-down-payment",
    dealerDownPaymentConfirmed: "/payment/down-payment-dealer-confirmed",
    loanDisbursementReceived: "/payment/loan-disbursement-received",
    /** Bank verification OTP after loan application submit. */
    loanProcessing: "/payment/loan-processing",
    /** Post-OTP — bank processing the loan (2–3 working days). */
    loanUnderReview: "/payment/loan-under-review",
  },
  delivery: {
    insurancePrep: "/delivery/insurance-prep",
    rto: "/delivery/rto",
    rtoAdditionalDocuments: "/delivery/rto/additional-documents",
    schedule: "/delivery/schedule",
  },
} as const;

/** Old pathnames kept for redirects + phase matching during URL migration. */
export const LEGACY_JOURNEY_PATHS = {
  bookingReceived: "/payment/booking-success",
  bookingReceivedNext: "/payment/booking-success/next",
  bookingProcessing: "/kyc/processing",
  bookingAccepted: "/kyc/booking-accepted",
  bookingConfirmed: "/kyc/booking-confirmed",
  bookingModify: "/kyc/modify-selection",
  bookingCancel: "/kyc/cancel-booking",
  bookingCancelSuccess: "/kyc/cancel-booking/success",
  onboardingPrefix: "/kyc/buying-guide",
  identityHub: "/kyc",
  identityUpload: "/kyc/upload",
  identityDocumentsReceived: "/kyc/documents-received",
  deliveryInsurancePrep: "/payment/car-delivery-insurance-prep",
  deliveryRto: "/payment/car-delivery-rto",
  deliveryRtoAdditionalDocuments: "/payment/car-delivery-rto-additional-documents",
  deliverySchedule: "/payment/car-delivery-schedule",
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

const IDENTITY_VERIFICATION_PATHS = new Set<string>([
  JOURNEY_PATHS.identity.hub,
  JOURNEY_PATHS.identity.upload,
  LEGACY_JOURNEY_PATHS.identityHub,
  LEGACY_JOURNEY_PATHS.identityUpload,
  JOURNEY_PATHS.booking.received,
  LEGACY_JOURNEY_PATHS.bookingReceived,
]);

const KYC_DOCUMENT_PATHS = new Set<string>([
  JOURNEY_PATHS.identity.documentsReceived,
  LEGACY_JOURNEY_PATHS.identityDocumentsReceived,
  JOURNEY_PATHS.kyc.verificationInProgress,
  JOURNEY_PATHS.kyc.verificationFailed,
  JOURNEY_PATHS.kyc.manualVerification,
  JOURNEY_PATHS.kyc.verificationCancelled,
]);

const BOOKING_PROCESSING_PATHS = new Set<string>([
  JOURNEY_PATHS.booking.processing,
  LEGACY_JOURNEY_PATHS.bookingProcessing,
]);

const BOOKING_ACCEPTED_PATHS = new Set<string>([
  JOURNEY_PATHS.booking.accepted,
  LEGACY_JOURNEY_PATHS.bookingAccepted,
]);

const BOOKING_CELEBRATION_PATHS = new Set<string>([
  JOURNEY_PATHS.booking.confirmed,
  LEGACY_JOURNEY_PATHS.bookingConfirmed,
  JOURNEY_PATHS.carAllocation.confirmed,
]);

const BUYING_GUIDE_STEP_PATH = /^\/(?:onboarding|kyc\/buying-guide)\/[1-3]$/;
const CAR_ALLOCATION_PATH = /^\/car-allocation\//;
const KYC_CAR_ALLOCATION_LEGACY = /^\/kyc\/car-allocation-/;
const DELIVERY_PATH =
  /^\/(?:delivery\/|payment\/car-delivery-|kyc\/car-delivery-)/;
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
  return `/onboarding/${step}`;
}

/**
 * Maps the current URL to a journey phase for copy, fees, and flow branching.
 * Phases are coarse — use URL parsers elsewhere for payment instalment state.
 */
export function resolveJourneyPhase(pathname: string): JourneyPhase {
  const path = normalizeAppPathname(pathname);

  // Price-lock arrival — before KYC / dealer. Must not use the money-chapter `payment` phase
  // (that would hide Change and charge Cancel).
  if (
    path === JOURNEY_PATHS.booking.received ||
    path === JOURNEY_PATHS.booking.receivedNext ||
    path === LEGACY_JOURNEY_PATHS.bookingReceived ||
    path === LEGACY_JOURNEY_PATHS.bookingReceivedNext
  ) {
    return "identity_verification";
  }
  if (IDENTITY_VERIFICATION_PATHS.has(path)) {
    return "identity_verification";
  }
  if (KYC_DOCUMENT_PATHS.has(path)) {
    return "kyc_documents";
  }
  if (BOOKING_PROCESSING_PATHS.has(path)) {
    return "booking_processing";
  }
  if (BUYING_GUIDE_STEP_PATH.test(path)) {
    return "buying_guide";
  }
  if (BOOKING_CELEBRATION_PATHS.has(path)) {
    return "booking_celebration";
  }
  if (BOOKING_ACCEPTED_PATHS.has(path)) {
    return "booking_accepted";
  }
  // Pending / failed — manufacturing or edge case; no engine/chassis yet.
  if (CAR_ALLOCATION_PATH.test(path) || KYC_CAR_ALLOCATION_LEGACY.test(path)) {
    return "car_allocation";
  }
  if (DELIVERY_PATH.test(path)) {
    return "delivery";
  }
  // Money chapter — exclude arrival + delivery legacy that still sit under /payment
  if (
    PAYMENT_PATH.test(path) &&
    path !== LEGACY_JOURNEY_PATHS.bookingReceived &&
    path !== LEGACY_JOURNEY_PATHS.bookingReceivedNext &&
    !path.startsWith("/payment/car-delivery")
  ) {
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
 * Before dealer search — identity + verification only.
 * `/booking/processing` is still free for change/cancel; fees start at booking-accepted.
 */
export function isPreDealerAllocationPhase(phase: JourneyPhase): boolean {
  return phase === "identity_verification" || phase === "kyc_documents";
}

/**
 * Change selection is allowed only before vehicle ID (engine/chassis).
 * Free through dealer search; ₹5,000 from dealer found (booking-accepted) through allocation-pending.
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
 * ₹5,000 change fee applies once a dealer partner is locked
 * (`/booking/accepted` onward, including allocation-pending — still no VIN).
 * Dealer search (`/booking/processing`) stays free. OTP is manufacturer-portal confirmation;
 * VIN is what blocks further changes.
 */
export function isDealerAllocatedChangeFeePhase(phase: JourneyPhase): boolean {
  return phase === "booking_accepted" || phase === "car_allocation";
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
