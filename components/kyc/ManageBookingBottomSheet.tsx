"use client";

import Image, { type StaticImageData } from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

import arrowRightIcon from "@/assets/Arrow_right.svg";
import changeSelectionIcon from "@/assets/change selection.svg";
import cancelBookingIcon from "@/assets/cancel booking.svg";
import { BookingCarSummaryCard } from "@/components/kyc/BookingCarSummaryCard";
import { DEMO_BOOKING_ID } from "@/components/kyc/booking-car-card-content";
import {
  activeBookingCardDetails,
  activeBookingCarCutoutSrc,
  readActiveBookingSnapshot,
} from "@/lib/active-booking-snapshot";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import {
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
  BOTTOM_SHEET_SCROLL_BODY_CLASS,
  BOTTOM_SHEET_SCROLL_PANEL_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import { ChooseLoanPaymentSummaryCard } from "@/components/payment/ChooseLoanPaymentSummaryCard";
import { ON_ROAD_PRICE_INR } from "@/components/payment/loan-amount-demo-constants";
import { PaymentSummaryCard } from "@/components/payment/PaymentSummaryCard";
import {
  isCancelDemoFlow,
  isModifyNoChargesFlow,
} from "@/lib/experience-flow";
import {
  isChangeSelectionAllowedPhase,
  JOURNEY_PATHS,
  resolveJourneyPhase,
} from "@/lib/journey-routes";
import {
  readPostLockChangesUsed,
  writeChangeEntryStage,
} from "@/lib/change-policy";
import {
  hasCarPaymentStarted,
  isCancelBookingMenuVisible,
  isChangeSelectionMenuVisible,
  modifyBookingCancelDescription,
  modifyBookingChangeDescription,
  resolveChangeSelectionFeeTier,
  resolveModifyBookingFeeTier,
} from "@/lib/manage-booking-modify";
import {
  BOOKING_LOCK_AMOUNT_INR,
  FULL_PAYMENT_BANK_ID,
  INSURANCE_PAYMENT_KIND,
} from "@/lib/paymentUrls";
import { cn } from "@/lib/utils";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import styles from "./ManageBookingBottomSheet.module.scss";


/** Keeps parity with other bottom sheets in the app */
const SHEET_TRANSITION_MS = 280;

type ModifyBookingActionRowProps = {
  iconSrc: StaticImageData;
  title: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
};

function ModifyBookingActionRow({
  iconSrc,
  title,
  description,
  onClick,
  disabled = false,
}: ModifyBookingActionRowProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={cn(
        styles.flex_14,
        disabled
          ? styles.cursor_not_allowed_15
          : styles.hover_bg_fafafa__16,
      )}
    >
      <span className={styles.flex_0}>
        <Image src={iconSrc} alt="" width={20} height={20} className={styles.shrink_0_1} unoptimized aria-hidden />
      </span>
      <span className={styles.min_w_0_2}>
        <span className={styles.block_3}>{title}</span>
        <span className={styles.mt_1_4}>{description}</span>
      </span>
      <span className={styles.relative_5}>
        <Image
          src={arrowRightIcon}
          alt=""
          fill
          className={styles.object_contain_6}
          unoptimized
          sizes="20px"
        />
      </span>
    </button>
  );
}

export type ManageBookingBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /**
   * Post–car-allocation journey (e.g. `/payment/default`) — engine/chassis rows + copy icons;
   * card grows below a fixed 228px visual stage.
   */
  showVehicleIdentification?: boolean;
};

/**
 * “Your booking” manage sheet — Figma [2486:11166](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2486-11166).
 */
function parseConfirmedLoanPlan(searchParams: URLSearchParams) {
  const loan = Number(searchParams.get("loan_amount"));
  if (!Number.isFinite(loan) || loan <= 0) {
    return null;
  }

  const loanAmountInr = Math.round(loan);
  const totalDownPaymentInr = Math.max(0, Math.round(ON_ROAD_PRICE_INR - loanAmountInr));
  const isInsuranceCheckout = searchParams.get("payment_kind") === INSURANCE_PAYMENT_KIND;

  const downPaymentRaw = searchParams.get("down_payment");
  const downPayment =
    downPaymentRaw != null && downPaymentRaw !== "" ? Number(downPaymentRaw) : NaN;
  const originalDownPayment = Number(searchParams.get("original_down_payment"));
  const hasOriginal =
    Number.isFinite(originalDownPayment) && originalDownPayment > 0;

  if (isInsuranceCheckout && totalDownPaymentInr > 0) {
    return {
      loanAmountInr,
      downPaymentAmountInr: 0,
      downPaymentPaidInr: totalDownPaymentInr,
      downPaymentFullyPaid: true,
    };
  }

  if (
    hasOriginal &&
    (downPaymentRaw === "0" || !Number.isFinite(downPayment) || downPayment <= 0)
  ) {
    return {
      loanAmountInr,
      downPaymentAmountInr: 0,
      downPaymentPaidInr: Math.round(originalDownPayment),
      downPaymentFullyPaid: true,
    };
  }

  if (downPaymentRaw == null || downPaymentRaw === "") {
    if (totalDownPaymentInr > 0) {
      return {
        loanAmountInr,
        downPaymentAmountInr: 0,
        downPaymentPaidInr: totalDownPaymentInr,
        downPaymentFullyPaid: true,
      };
    }
    return null;
  }

  if (!Number.isFinite(downPayment) || downPayment <= 0) {
    return null;
  }

  const downPaymentAmountInr = Math.round(downPayment);
  const hasPartialDownPayment =
    hasOriginal && originalDownPayment > downPaymentAmountInr;

  return {
    loanAmountInr,
    downPaymentAmountInr,
    downPaymentPaidInr: hasPartialDownPayment
      ? Math.round(originalDownPayment - downPaymentAmountInr)
      : undefined,
    downPaymentFullyPaid: false,
  };
}

/** Partial / complete car payment on full-payment journey (`?bank=full_payment`, no `loan_amount`). */
function parseFullPaymentPlan(searchParams: URLSearchParams) {
  if (searchParams.get("bank") !== FULL_PAYMENT_BANK_ID) {
    return null;
  }
  if (searchParams.get("loan_amount")) {
    return null;
  }

  const downPaymentRaw = searchParams.get("down_payment");
  const downPayment =
    downPaymentRaw != null && downPaymentRaw !== "" ? Number(downPaymentRaw) : NaN;
  const originalDownPayment = Number(searchParams.get("original_down_payment"));
  const hasOriginal =
    Number.isFinite(originalDownPayment) && originalDownPayment > 0;

  if (
    hasOriginal &&
    (downPaymentRaw === "0" || !Number.isFinite(downPayment) || downPayment <= 0)
  ) {
    return {
      paymentPaidInr: Math.round(originalDownPayment),
      amountRemainingInr: 0,
    };
  }

  if (!hasOriginal || !Number.isFinite(downPayment) || downPayment <= 0) {
    return null;
  }

  const amountRemainingInr = Math.round(downPayment);
  if (originalDownPayment <= amountRemainingInr) {
    return null;
  }

  return {
    paymentPaidInr: Math.round(originalDownPayment - amountRemainingInr),
    amountRemainingInr,
  };
}

export type ManageBookingSectionsProps = {
  onClose: () => void;
  showVehicleIdentification?: boolean;
  /** `overlay` — cards sit on the page surface (elevation); `sheet` — hairline borders on white. */
  surface?: "sheet" | "overlay";
  /** Extra section rendered between the payment summary and “Make a change” (e.g. receipts). */
  beforeChange?: React.ReactNode;
  /** When true, the hero car card is omitted (rendered elsewhere in the overlay layout). */
  hideCarCard?: boolean;
};

/**
 * Booked-car hero card with live snapshot from session storage.
 */
export function ManageBookingCarCard({
  showVehicleIdentification = false,
}: {
  showVehicleIdentification?: boolean;
}) {
  const [activeBooking, setActiveBooking] = useState<ReturnType<
    typeof readActiveBookingSnapshot
  >>(null);

  useEffect(() => {
    setActiveBooking(readActiveBookingSnapshot());
  }, []);

  return (
    <BookingCarSummaryCard
      showVehicleIdentification={showVehicleIdentification}
      cardDetails={
        activeBooking != null ? activeBookingCardDetails(activeBooking) : undefined
      }
      carCutoutSrc={
        activeBooking != null ? activeBookingCarCutoutSrc(activeBooking) : undefined
      }
    />
  );
}

/**
 * The manage-booking content (car card, payment summary, make-a-change) with
 * all its policy logic — shared by the bottom sheet and the concierge zoom
 * overlay. Requires a Suspense boundary (`useSearchParams`).
 */
export function ManageBookingSections({
  onClose,
  showVehicleIdentification = false,
  surface = "sheet",
  beforeChange,
  hideCarCard = false,
}: ManageBookingSectionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const confirmedLoanPlan = useMemo(
    () => parseConfirmedLoanPlan(searchParams),
    [searchParams],
  );
  const fullPaymentPlan = useMemo(
    () => parseFullPaymentPlan(searchParams),
    [searchParams],
  );

  const modifyFeeTier = useMemo(
    () => resolveModifyBookingFeeTier(pathname),
    [pathname],
  );
  const changeFeeTier = useMemo(
    () => resolveChangeSelectionFeeTier(pathname),
    [pathname],
  );

  /** Car payment beyond the ₹10k lock — hides Cancel (and the whole section if Change is gone). */
  const carPaymentStarted = useMemo(
    () =>
      hasCarPaymentStarted({
        pathname,
        downPaymentPaidInr: confirmedLoanPlan?.downPaymentPaidInr,
        downPaymentFullyPaid: confirmedLoanPlan?.downPaymentFullyPaid,
        fullPaymentPaidInr: fullPaymentPlan?.paymentPaidInr,
      }),
    [pathname, confirmedLoanPlan, fullPaymentPlan],
  );

  const showChangeSelection = useMemo(
    () => isChangeSelectionMenuVisible(pathname, showVehicleIdentification),
    [pathname, showVehicleIdentification],
  );
  const showCancelBooking = useMemo(
    () => isCancelBookingMenuVisible(carPaymentStarted),
    [carPaymentStarted],
  );
  const showMakeAChangeSection = showChangeSelection || showCancelBooking;

  /** Post–dealer-allocation changes already used (exactly one ₹5,000 change allowed). */
  const [changesUsed, setChangesUsed] = useState(0);
  useEffect(() => {
    setChangesUsed(readPostLockChangesUsed());
  }, []);

  const changeSelectionDescription = useMemo(() => {
    if (changeFeeTier !== "free" && changesUsed >= 1) {
      return "Change used — another means cancel & rebook";
    }
    return modifyBookingChangeDescription(changeFeeTier);
  }, [changeFeeTier, changesUsed]);

  const changeSelectionClickable = useMemo(() => {
    if (!showChangeSelection) return false;
    if (isCancelDemoFlow()) return false;
    if (isModifyNoChargesFlow()) return true;
    return isChangeSelectionAllowedPhase(resolveJourneyPhase(pathname));
  }, [pathname, showChangeSelection]);

  const cancelBookingDescription = useMemo(
    () => modifyBookingCancelDescription(modifyFeeTier),
    [modifyFeeTier],
  );

  const totalPaidInr = useMemo(() => {
    const dpPaid = Math.max(0, confirmedLoanPlan?.downPaymentPaidInr ?? 0);
    const fullPaid = Math.max(0, fullPaymentPlan?.paymentPaidInr ?? 0);
    return BOOKING_LOCK_AMOUNT_INR + dpPaid + fullPaid;
  }, [confirmedLoanPlan, fullPaymentPlan]);

  const onChangeSelection = useCallback(() => {
    onClose();
    const stage = changeFeeTier === "free" ? "pre" : "post";
    // Second post–dealer-allocation change = cancellation + rebook.
    if (stage === "post" && readPostLockChangesUsed() >= 1) {
      router.push(
        `${JOURNEY_PATHS.kyc.cancelBooking}?paid=${totalPaidInr}&stage=post&reason=second-change`,
      );
      return;
    }
    writeChangeEntryStage(stage);
    router.push(JOURNEY_PATHS.kyc.modifySelection);
  }, [onClose, router, changeFeeTier, totalPaidInr]);

  const onCancelBooking = useCallback(() => {
    onClose();
    const stage = modifyFeeTier === "free" ? "pre" : "post";
    router.push(`${JOURNEY_PATHS.kyc.cancelBooking}?paid=${totalPaidInr}&stage=${stage}`);
  }, [onClose, router, modifyFeeTier, totalPaidInr]);

  return (
    <div className={styles.flex_7}>
      {hideCarCard ? null : (
        <ManageBookingCarCard showVehicleIdentification={showVehicleIdentification} />
      )}

      <section aria-labelledby="manage-booking-payment-heading">
        <h3
          id="manage-booking-payment-heading"
          className={styles.mb_4_8}
        >
          Payment summary
        </h3>
        {confirmedLoanPlan ? (
          <ChooseLoanPaymentSummaryCard
            loanAmountInr={confirmedLoanPlan.loanAmountInr}
            downPaymentAmountInr={confirmedLoanPlan.downPaymentAmountInr}
            downPaymentPaidInr={confirmedLoanPlan.downPaymentPaidInr}
            downPaymentFullyPaid={confirmedLoanPlan.downPaymentFullyPaid}
            variant={surface === "overlay" ? "glass" : "default"}
          />
        ) : (
          <PaymentSummaryCard
            paymentPaidInr={fullPaymentPlan?.paymentPaidInr}
            amountRemainingInr={fullPaymentPlan?.amountRemainingInr}
            variant={surface === "overlay" ? "glass" : "default"}
          />
        )}
      </section>

      {beforeChange}

      {showMakeAChangeSection ? (
        <section aria-labelledby="manage-booking-modify-heading">
          <h3
            id="manage-booking-modify-heading"
            className={styles.mb_4_8}
          >
            Make a change
          </h3>
          <div
            className={cn(
              surface === "overlay"
                ? OVERLAY_GLASS_CARD_CLASS
                : styles.overflow_hidden_18,
            )}
          >
            {showChangeSelection ? (
              <ModifyBookingActionRow
                iconSrc={changeSelectionIcon}
                title="Change selection"
                description={changeSelectionDescription}
                onClick={changeSelectionClickable ? onChangeSelection : undefined}
              />
            ) : null}
            {showChangeSelection && showCancelBooking ? (
              <hr className={styles.border_0_9} />
            ) : null}
            {showCancelBooking ? (
              <ModifyBookingActionRow
                iconSrc={cancelBookingIcon}
                title="Cancel my purchase"
                description={cancelBookingDescription}
                onClick={onCancelBooking}
              />
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

/** ACKO Drive + self finance: partial or full down payment. Full payment: any instalment paid. */
function ManageBookingBottomSheetInner({
  open,
  onClose,
  showVehicleIdentification = false,
}: ManageBookingBottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setMounted(true);
    setAnimateIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return;
    setAnimateIn(false);
    exitTimeoutRef.current = setTimeout(() => {
      exitTimeoutRef.current = null;
      setMounted(false);
    }, SHEET_TRANSITION_MS);
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  const onBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={cn(styles.fixed_0, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
      <button
        type="button"
        className={cn(styles.absolute_1, animateIn ? styles.opacity_100_1 : styles.opacity_0_1)}
        onClick={onBackdropClick}
        aria-label="Dismiss"
      />
      <div
        className={cn(styles.absolute_2, BOTTOM_SHEET_MAX_HEIGHT_CLASS, styles.w_full_2, BOTTOM_SHEET_SCROLL_PANEL_CLASS, styles.rounded_t_24px__2, "sheet-elevated", animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-booking-sheet-title"
      >
        <header className={styles.flex_10}>
          <div className={styles.min_w_0_2}>
            <h2
              id="manage-booking-sheet-title"
              className={styles.text_left_11}
            >
              Your car
            </h2>
            <p className={styles.mt_1_12}>
              Reference ID: {DEMO_BOOKING_ID}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={[styles.cta_ghost_13, "cta-ghost"].filter(Boolean).join(" ")}
            aria-label="Close"
          >
            <BottomSheetCloseIcon />
          </button>
        </header>

        <div
          className={cn(BOTTOM_SHEET_SCROLL_BODY_CLASS, styles.px_5_3)}
        >
          <ManageBookingSections
            onClose={onClose}
            showVehicleIdentification={showVehicleIdentification}
          />
        </div>
      </div>
    </div>
    </BottomSheetPortal>
  );
}

/** `useSearchParams` requires a Suspense boundary for static export prerender. */
export function ManageBookingBottomSheet(props: ManageBookingBottomSheetProps) {
  return (
    <Suspense fallback={null}>
      <ManageBookingBottomSheetInner {...props} />
    </Suspense>
  );
}
