"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ConciergeMoment } from "@/components/concierge/ConciergeMoment";
import { KycBookingConfirmedScreen } from "@/components/kyc/KycBookingConfirmedScreen";
import {
  syncModifySelectionBookingSnapshot,
  type ActiveBookingSnapshot,
} from "@/lib/active-booking-snapshot";
import {
  clearChangeEntryStage,
  readChangeEntryStage,
  recordPostLockChangeUsed,
} from "@/lib/change-policy";
import {
  isModifyWithChargesFlow,
  readExperienceFlow,
  writeExperienceFlow,
} from "@/lib/experience-flow";
import {
  BOOKING_LOCK_AMOUNT_INR,
  MODIFY_SELECTION_RETURN_SOURCE,
} from "@/lib/paymentUrls";

function parsePositiveInt(raw: string | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

export function KycBookingConfirmedPageClient() {
  const searchParams = useSearchParams();
  const afterModifySelection =
    searchParams.get("return_source") === MODIFY_SELECTION_RETURN_SOURCE;
  const variant = searchParams.get("source") === "payment" ? "payment" : "default";
  const paidAmountInr =
    parsePositiveInt(searchParams.get("paid")) ?? BOOKING_LOCK_AMOUNT_INR;

  const [activeBooking, setActiveBooking] = useState<ActiveBookingSnapshot | null>(null);

  useLayoutEffect(() => {
    if (!afterModifySelection) {
      setActiveBooking(null);
      return;
    }
    const snapshot = syncModifySelectionBookingSnapshot(variant, paidAmountInr);
    setActiveBooking(snapshot);

    // Express/standard journeys: spine delivery follows the selection just paid
    // (e.g. allocation-failed → pick a different car → chose standard). Demo
    // modify flows keep their flow id for journey guards / fee demos.
    const flow = readExperienceFlow();
    if (
      snapshot != null &&
      (flow === "express" || flow === "standard")
    ) {
      writeExperienceFlow(
        snapshot.deliveryChoice === "standard" ? "standard" : "express",
      );
    }

    // One-time change rule (policy §1.9): a post-allocation change consumes the allowance.
    if (readChangeEntryStage() === "post" || isModifyWithChargesFlow()) {
      recordPostLockChangeUsed();
    }
    clearChangeEntryStage();
  }, [afterModifySelection, paidAmountInr, variant]);

  const paymentPaidInr = useMemo(
    () => (variant === "payment" ? paidAmountInr : undefined),
    [variant, paidAmountInr],
  );

  // Spine (no checkout return) — the concierge “car reserved” turn.
  // Modify-selection pay returns use auto-advance Payment received (journey-aware next).
  if (variant === "default" && !afterModifySelection) {
    return <ConciergeMoment moment="carReserved" />;
  }

  return (
    <KycBookingConfirmedScreen
      variant={variant}
      paidAmountInr={paymentPaidInr}
      afterModifySelection={afterModifySelection}
      activeBooking={activeBooking}
    />
  );
}
