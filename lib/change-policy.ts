/**
 * One-time change rule (policy §1.9 / §2.3):
 * - Through dealer search (`/kyc/processing`): changes are free (no ₹5,000 fee).
 * - From partner locked on `/kyc/booking-accepted` through allocation-pending (before VIN):
 *   exactly ONE model/colour change, ₹5,000 + any price difference.
 * - After vehicle ID (engine/chassis / booking-confirmed): change is not offered.
 * - A second post–dealer-allocation change is treated as cancellation (50% of booking
 *   amount) + rebook.
 *
 * The counter tracks post–dealer-allocation changes only; the entry stage records
 * whether the user entered before or after the fee boundary, so review-and-pay
 * can charge correctly. OTP is manufacturer-portal confirmation — not the fee boundary.
 */

const CHANGES_USED_KEY = "pbe-post-lock-changes-used";
const ENTRY_STAGE_KEY = "pbe-change-entry-stage";

export type ChangeEntryStage = "pre" | "post";

export function readPostLockChangesUsed(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = sessionStorage.getItem(CHANGES_USED_KEY);
    const n = raw == null ? 0 : Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
  } catch {
    return 0;
  }
}

export function recordPostLockChangeUsed(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CHANGES_USED_KEY, String(readPostLockChangesUsed() + 1));
  } catch {
    /* ignore */
  }
}

export function writeChangeEntryStage(stage: ChangeEntryStage): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ENTRY_STAGE_KEY, stage);
  } catch {
    /* ignore */
  }
}

export function readChangeEntryStage(): ChangeEntryStage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ENTRY_STAGE_KEY);
    return raw === "pre" || raw === "post" ? raw : null;
  } catch {
    return null;
  }
}

export function clearChangeEntryStage(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ENTRY_STAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Demo flow switch — start the policy counters fresh. */
export function resetChangePolicy(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CHANGES_USED_KEY);
    sessionStorage.removeItem(ENTRY_STAGE_KEY);
  } catch {
    /* ignore */
  }
}
