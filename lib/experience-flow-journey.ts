import {
  isCancelNoChargesFlow,
  isCancelWithChargesFlow,
  isModifyNoChargesFlow,
  isModifySelectionDemoFlow,
  readExperienceFlow,
  type ExperienceFlow,
} from "@/lib/experience-flow";
import {
  JOURNEY_PATHS,
  normalizeAppPathname,
} from "@/lib/journey-routes";
import { MODIFY_SELECTION_RETURN_SOURCE } from "@/lib/paymentUrls";

/** Optional query context for modify-no-charges journey guards. */
export type ModifyNoChargesJourneyContext = {
  returnSource?: string | null;
  /** `payment` — booking-lock success after mock checkout. */
  bookingConfirmedSource?: string | null;
};

function isModifySelectionBookingReceivedPath(
  path: string,
  context?: ModifyNoChargesJourneyContext,
): boolean {
  if (path !== JOURNEY_PATHS.kyc.bookingConfirmed) return false;
  return (
    context?.returnSource === MODIFY_SELECTION_RETURN_SOURCE &&
    context?.bookingConfirmedSource === "payment"
  );
}

/** Paths beyond KYC pending that redirect to `/kyc` in the modify-no-charges demo flow. */
const MODIFY_NO_CHARGES_BLOCKED_PATHS = new Set<string>([
  JOURNEY_PATHS.kyc.upload,
  JOURNEY_PATHS.kyc.documentsReceived,
  JOURNEY_PATHS.kyc.verificationInProgress,
  JOURNEY_PATHS.kyc.verificationFailed,
  JOURNEY_PATHS.kyc.manualVerification,
  JOURNEY_PATHS.kyc.processing,
  JOURNEY_PATHS.kyc.bookingAccepted,
  JOURNEY_PATHS.kyc.bookingConfirmed,
  JOURNEY_PATHS.carAllocation.pending,
  JOURNEY_PATHS.carAllocation.confirmed,
]);

/** Paths beyond verification in progress that redirect in the cancel-no-charges demo flow. */
const CANCEL_NO_CHARGES_BLOCKED_PATHS = new Set<string>([
  JOURNEY_PATHS.kyc.verificationFailed,
  JOURNEY_PATHS.kyc.manualVerification,
  JOURNEY_PATHS.kyc.processing,
  JOURNEY_PATHS.kyc.bookingAccepted,
  JOURNEY_PATHS.kyc.bookingConfirmed,
  JOURNEY_PATHS.carAllocation.pending,
  JOURNEY_PATHS.carAllocation.confirmed,
]);

const CANCEL_NO_CHARGES_ALLOWED_KYC_PATHS = new Set<string>([
  JOURNEY_PATHS.kyc.hub,
  JOURNEY_PATHS.kyc.upload,
  JOURNEY_PATHS.kyc.documentsReceived,
  JOURNEY_PATHS.kyc.verificationInProgress,
]);

/** Paths beyond booking-accepted (partner locked) that redirect in the cancel-with-charges demo flow. */
const CANCEL_WITH_CHARGES_BLOCKED_PATHS = new Set<string>([
  JOURNEY_PATHS.kyc.verificationFailed,
  JOURNEY_PATHS.kyc.manualVerification,
  JOURNEY_PATHS.kyc.bookingConfirmed,
  JOURNEY_PATHS.carAllocation.pending,
  JOURNEY_PATHS.carAllocation.confirmed,
]);

const CANCEL_WITH_CHARGES_ALLOWED_KYC_PATHS = new Set<string>([
  JOURNEY_PATHS.kyc.hub,
  JOURNEY_PATHS.kyc.upload,
  JOURNEY_PATHS.kyc.documentsReceived,
  JOURNEY_PATHS.kyc.verificationInProgress,
  JOURNEY_PATHS.kyc.processing,
  JOURNEY_PATHS.kyc.bookingAccepted,
]);

function isModifySelectionPath(path: string): boolean {
  return (
    path === JOURNEY_PATHS.kyc.modifySelection ||
    path.startsWith(`${JOURNEY_PATHS.kyc.modifySelection}/`)
  );
}

function isCancelBookingPath(path: string): boolean {
  return (
    path === JOURNEY_PATHS.kyc.cancelBooking ||
    path.startsWith(`${JOURNEY_PATHS.kyc.cancelBooking}/`)
  );
}

/** Whether the path is reachable in the modify-no-charges demo (quote → KYC pending + modify routes). */
export function isModifyNoChargesFlowPathAllowed(
  pathname: string,
  context?: ModifyNoChargesJourneyContext,
): boolean {
  const path = normalizeAppPathname(pathname);

  if (path === JOURNEY_PATHS.kyc.hub || isModifySelectionPath(path)) {
    return true;
  }

  if (isModifySelectionBookingReceivedPath(path, context)) {
    return true;
  }

  if (MODIFY_NO_CHARGES_BLOCKED_PATHS.has(path)) {
    return false;
  }

  if (path.startsWith("/car-allocation/") || /^\/kyc\/car-allocation-/.test(path)) {
    return false;
  }

  return true;
}

/** Whether the path is reachable in the cancel-no-charges demo (quote → verification in progress + cancel routes). */
export function isCancelNoChargesFlowPathAllowed(pathname: string): boolean {
  const path = normalizeAppPathname(pathname);

  if (CANCEL_NO_CHARGES_ALLOWED_KYC_PATHS.has(path) || isCancelBookingPath(path)) {
    return true;
  }

  if (isModifySelectionPath(path)) {
    return false;
  }

  if (CANCEL_NO_CHARGES_BLOCKED_PATHS.has(path)) {
    return false;
  }

  if (path.startsWith("/car-allocation/") || /^\/kyc\/car-allocation-/.test(path)) {
    return false;
  }

  return true;
}

/** Whether the path is reachable in the cancel-with-charges demo (quote → processing + cancel routes). */
export function isCancelWithChargesFlowPathAllowed(pathname: string): boolean {
  const path = normalizeAppPathname(pathname);

  if (CANCEL_WITH_CHARGES_ALLOWED_KYC_PATHS.has(path) || isCancelBookingPath(path)) {
    return true;
  }

  if (isModifySelectionPath(path)) {
    return false;
  }

  if (CANCEL_WITH_CHARGES_BLOCKED_PATHS.has(path)) {
    return false;
  }

  if (path.startsWith("/car-allocation/") || /^\/kyc\/car-allocation-/.test(path)) {
    return false;
  }

  return true;
}

/**
 * When the modify-no-charges flow is active, post–KYC-pending URLs redirect to `/kyc`.
 * Returns `null` when no redirect is needed.
 */
export function getModifyNoChargesRedirectTarget(
  pathname: string,
  flow?: ExperienceFlow,
  context?: ModifyNoChargesJourneyContext,
): string | null {
  if (!isModifyNoChargesFlow(flow)) {
    return null;
  }

  if (isModifyNoChargesFlowPathAllowed(pathname, context)) {
    return null;
  }

  const path = normalizeAppPathname(pathname);

  if (
    path.startsWith("/kyc/") ||
    path.startsWith("/car-allocation/") ||
    /^\/kyc\/car-allocation-/.test(path)
  ) {
    return JOURNEY_PATHS.kyc.hub;
  }

  return null;
}

/**
 * When the cancel-no-charges flow is active, post–verification-in-progress URLs redirect
 * to `/kyc/verification-in-progress`. Returns `null` when no redirect is needed.
 */
export function getCancelNoChargesRedirectTarget(
  pathname: string,
  flow?: ExperienceFlow,
): string | null {
  if (!isCancelNoChargesFlow(flow)) {
    return null;
  }

  if (isCancelNoChargesFlowPathAllowed(pathname)) {
    return null;
  }

  const path = normalizeAppPathname(pathname);

  if (isModifySelectionPath(path)) {
    return JOURNEY_PATHS.kyc.verificationInProgress;
  }

  if (
    path.startsWith("/kyc/") ||
    path.startsWith("/car-allocation/") ||
    /^\/kyc\/car-allocation-/.test(path)
  ) {
    return JOURNEY_PATHS.kyc.verificationInProgress;
  }

  return null;
}

/**
 * When the cancel-with-charges flow is active, post–booking-accepted URLs redirect
 * to `/kyc/booking-accepted` (partner locked — fee boundary). Returns `null` when no redirect is needed.
 */
export function getCancelWithChargesRedirectTarget(
  pathname: string,
  flow?: ExperienceFlow,
): string | null {
  if (!isCancelWithChargesFlow(flow)) {
    return null;
  }

  if (isCancelWithChargesFlowPathAllowed(pathname)) {
    return null;
  }

  const path = normalizeAppPathname(pathname);

  if (isModifySelectionPath(path)) {
    return JOURNEY_PATHS.kyc.bookingAccepted;
  }

  if (
    path.startsWith("/kyc/") ||
    path.startsWith("/car-allocation/") ||
    /^\/kyc\/car-allocation-/.test(path)
  ) {
    return JOURNEY_PATHS.kyc.bookingAccepted;
  }

  return null;
}

/**
 * Unified journey guard for modify/cancel demo flows.
 * Returns `null` when no redirect is needed.
 */
export function getExperienceFlowJourneyRedirectTarget(
  pathname: string,
  flow?: ExperienceFlow,
  context?: ModifyNoChargesJourneyContext,
): string | null {
  const active = flow ?? readExperienceFlow();

  const modifyTarget = getModifyNoChargesRedirectTarget(pathname, active, context);
  if (modifyTarget) return modifyTarget;

  const cancelNoChargesTarget = getCancelNoChargesRedirectTarget(pathname, active);
  if (cancelNoChargesTarget) return cancelNoChargesTarget;

  const cancelWithChargesTarget = getCancelWithChargesRedirectTarget(pathname, active);
  if (cancelWithChargesTarget) return cancelWithChargesTarget;

  return null;
}

/**
 * Modify-selection routes are open to express/standard and the modify demo flows;
 * other flows redirect to `/kyc`. Change is only offered through dealer allocation
 * (`booking-accepted`); after vehicle ID it is hidden from the manage menu.
 * Returns `null` when no redirect is needed.
 */
export function getModifySelectionFlowRedirectTarget(
  pathname: string,
  flow?: ExperienceFlow,
): string | null {
  const path = normalizeAppPathname(pathname);
  if (!isModifySelectionPath(path)) {
    return null;
  }

  const active = flow ?? readExperienceFlow();
  const allowed =
    isModifySelectionDemoFlow(active) || active === "express" || active === "standard";
  if (!allowed) {
    return JOURNEY_PATHS.kyc.hub;
  }

  return null;
}

/**
 * Cancel-booking is available in every flow (policy §7). Kept for callers of the
 * obsolete guard; always returns `null`.
 */
export function getCancelBookingFlowRedirectTarget(
  pathname: string,
  _flow?: ExperienceFlow,
): string | null {
  const path = normalizeAppPathname(pathname);
  if (!isCancelBookingPath(path)) {
    return null;
  }

  return null;
}
