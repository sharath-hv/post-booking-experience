"use client";

import Image, { type StaticImageData } from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import arrowRightIcon from "@/assets/Arrow_right.svg";
import changeSelectionIcon from "@/assets/change selection.svg";
import cancelBookingIcon from "@/assets/cancel booking.svg";
import { BookingCarSummaryCard } from "@/components/organisms/BookingCarSummaryCard";
import { DEMO_BOOKING_ID } from "@/constants/booking-car-card-content";
import {
  activeBookingCardDetails,
  activeBookingCarCutoutSrc,
  readActiveBookingSnapshot,
} from "@/services/active-booking-snapshot";
import { BottomSheetCloseIcon } from "@/components/atoms/BottomSheetCloseIcon";
import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
import { IconWell } from "@/components/molecules/IconWell";
import {
  BOTTOM_SHEET_SCROLL_BODY_CLASS,
  BOTTOM_SHEET_SCROLL_PANEL_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { ChooseLoanPaymentSummaryCard } from "@/components/organisms/ChooseLoanPaymentSummaryCard";
import {
  BANK_DISBURSEMENT_INR,
  FULL_PAYMENT_CAR_AMOUNT_INR,
  cashDownPaymentDueInr,
} from "@/constants/loan-amount-demo-constants";
import { PaymentSummaryCard } from "@/components/organisms/PaymentSummaryCard";
import {
  isCancelDemoFlow,
  isModifyNoChargesFlow,
} from "@/helpers/experience-flow";
import {
  isChangeSelectionAllowedPhase,
  JOURNEY_PATHS,
  normalizeAppPathname,
  resolveJourneyPhase,
} from "@/helpers/journey-routes";
import { isVehicleRegistrationAvailable } from "@/helpers/journey-stage";
import { readLockedPickupDeliveryLine } from "@/helpers/pickup-slot";
import {
  readPostLockChangesUsed,
  writeChangeEntryStage,
} from "@/constants/change-policy";
import {
  hasCarPaymentStarted,
  isCancelBookingMenuVisible,
  isChangeSelectionMenuVisible,
  isDownPaymentSettledForSummaryPath,
  modifyBookingCancelDescription,
  modifyBookingChangeDescription,
  resolveChangeSelectionFeeTier,
  resolveModifyBookingFeeTier,
} from "@/helpers/manage-booking-modify";
import {
  BOOKING_LOCK_AMOUNT_INR,
  FULL_PAYMENT_BANK_ID,
  INSURANCE_PAYMENT_KIND,
} from "@/helpers/paymentUrls";
import { cn } from "@/utils/utils";
import { OVERLAY_GLASS_CARD_CLASS } from "@/helpers/overlay-glass-card";
import styles from "./ManageBookingBottomSheet.module.scss";

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
      <IconWell aria-hidden>
        <Image src={iconSrc} alt="" width={20} height={20} className={styles.shrink_0_1} unoptimized aria-hidden />
      </IconWell>
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
   * Post–car-allocation journey (e.g. `/payment/default`) — engine/chassis rows;
   * card grows below a fixed 228px visual stage.
   */
  showVehicleIdentification?: boolean;
};

/**
 * “Your booking” manage sheet — Figma [2486:11166](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2486-11166).
 */
/**
 * ACKO Drive — after application submit, URLs often only carry `?bank=`.
 * Still show the full loan + DP breakup in manage booking.
 */
const POST_LOAN_APPLICATION_PATHS = new Set<string>([
  "/payment/loan-application/submitted",
  "/payment/loan-processing",
  "/payment/loan-under-review",
  "/payment/loan-additional-documents",
  "/payment/loan-sanctioned",
  "/payment/loan-guarantor",
]);

function isPostLoanApplicationPath(pathname: string): boolean {
  return POST_LOAN_APPLICATION_PATHS.has(normalizeAppPathname(pathname));
}

/** Full-cash turns that never carry a loan breakup (even when `bank` is absent). */
function isFullCashPaymentPath(pathname: string): boolean {
  const path = normalizeAppPathname(pathname);
  return (
    path === "/payment/full-cash-payment-confirmed" ||
    path === "/payment/full-cash-payment-verification"
  );
}

function parseConfirmedLoanPlan(
  searchParams: URLSearchParams,
  pathname: string,
) {
  const bank = searchParams.get("bank");
  const loanParam = Number(searchParams.get("loan_amount"));
  const hasLoanParam = Number.isFinite(loanParam) && loanParam > 0;
  const pathSettled = isDownPaymentSettledForSummaryPath(pathname);

  // Post–submit ACKO / self-finance: demo loan when `loan_amount` is not on the URL yet.
  // After money settles, keep DP + loan visible even if delivery dropped `bank`.
  const useDemoLoan =
    !hasLoanParam &&
    bank !== FULL_PAYMENT_BANK_ID &&
    !isFullCashPaymentPath(pathname) &&
    ((Boolean(bank) && isPostLoanApplicationPath(pathname)) || pathSettled);

  if (!hasLoanParam && !useDemoLoan) {
    return null;
  }

  const loanAmountInr = hasLoanParam
    ? Math.round(loanParam)
    : BANK_DISBURSEMENT_INR;
  /** Car DP only — never on-road − loan (that double-counts booking + insurance). */
  const carDownPaymentInr = cashDownPaymentDueInr(loanAmountInr);
  const isInsuranceCheckout = searchParams.get("payment_kind") === INSURANCE_PAYMENT_KIND;

  const downPaymentRaw = searchParams.get("down_payment");
  const downPayment =
    downPaymentRaw != null && downPaymentRaw !== "" ? Number(downPaymentRaw) : NaN;
  const originalDownPayment = Number(searchParams.get("original_down_payment"));
  const hasOriginal =
    Number.isFinite(originalDownPayment) && originalDownPayment > 0;

  if (isInsuranceCheckout && carDownPaymentInr > 0) {
    return {
      loanAmountInr,
      downPaymentAmountInr: 0,
      downPaymentPaidInr: carDownPaymentInr,
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
    if (carDownPaymentInr <= 0) return null;
    // Bare `loan_amount` — paid only after dealer/bank confirmation (not await routes).
    const path = normalizeAppPathname(pathname);
    const slipReady =
      path === "/payment/margin-money-slip" &&
      searchParams.get("slip_ready") === "1";
    const dealerDpConfirmed =
      path === "/payment/down-payment-dealer-confirmed" &&
      searchParams.get("dp_confirmed") === "1";
    const dpSettled =
      isDownPaymentSettledForSummaryPath(pathname) ||
      slipReady ||
      dealerDpConfirmed;
    if (dpSettled) {
      return {
        loanAmountInr,
        downPaymentAmountInr: 0,
        downPaymentPaidInr: carDownPaymentInr,
        downPaymentFullyPaid: true,
      };
    }
    return {
      loanAmountInr,
      downPaymentAmountInr: carDownPaymentInr,
      downPaymentPaidInr: undefined,
      downPaymentFullyPaid: false,
    };
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

/**
 * Partial / complete car payment on the full-payment journey
 * (`?bank=full_payment`, or settled delivery paths with no loan).
 */
function parseFullPaymentPlan(
  searchParams: URLSearchParams,
  pathname: string,
) {
  if (searchParams.get("loan_amount")) {
    return null;
  }

  const bank = searchParams.get("bank");
  const isFullPaymentBank = bank === FULL_PAYMENT_BANK_ID;
  // Loan / self-finance breakup is handled by {@link parseConfirmedLoanPlan}.
  if (bank != null && bank !== "" && !isFullPaymentBank) {
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

  if (hasOriginal && Number.isFinite(downPayment) && downPayment > 0) {
    const amountRemainingInr = Math.round(downPayment);
    if (originalDownPayment > amountRemainingInr) {
      return {
        paymentPaidInr: Math.round(originalDownPayment - amountRemainingInr),
        amountRemainingInr,
      };
    }
  }

  // Full-cash / full-payment only — loan journeys use {@link parseConfirmedLoanPlan}
  // (Down payment paid + Loan amount) once money is settled.
  if (
    isDownPaymentSettledForSummaryPath(pathname) &&
    (isFullPaymentBank || isFullCashPaymentPath(pathname))
  ) {
    const carAmountRaw = searchParams.get("car_amount");
    const carAmount = carAmountRaw != null ? Number(carAmountRaw) : NaN;
    const paymentPaidInr =
      Number.isFinite(carAmount) && carAmount > 0
        ? Math.round(carAmount)
        : FULL_PAYMENT_CAR_AMOUNT_INR;
    return {
      paymentPaidInr,
      amountRemainingInr: 0,
    };
  }

  return null;
}

export type ManageBookingSectionsProps = {
  onClose: () => void;
  showVehicleIdentification?: boolean;
  /** Post-RTO — car registration number on the vehicle ID block. */
  showVehicleRegistration?: boolean;
  /** `overlay` — cards sit on the page surface (elevation); `sheet` — hairline borders on white. */
  surface?: "sheet" | "overlay";
  /** Extra section rendered between the payment summary and “Make a change” (e.g. receipts). */
  beforeChange?: React.ReactNode;
  /** When true, the hero car card is omitted (rendered elsewhere in the overlay layout). */
  hideCarCard?: boolean;
};

/**
 * Booked-car hero card with live snapshot from session storage.
 * On the schedule stage, a locked pickup line replaces the delivery ETA.
 */
export function ManageBookingCarCard({
  showVehicleIdentification = false,
  showVehicleRegistration = false,
}: {
  showVehicleIdentification?: boolean;
  showVehicleRegistration?: boolean;
}) {
  const pathname = usePathname();
  const [activeBooking, setActiveBooking] = useState<ReturnType<
    typeof readActiveBookingSnapshot
  >>(null);
  const [pickupLine, setPickupLine] = useState<string | null>(null);

  useEffect(() => {
    setActiveBooking(readActiveBookingSnapshot());
    setPickupLine(readLockedPickupDeliveryLine());
  }, []);

  const baseDetails =
    activeBooking != null ? activeBookingCardDetails(activeBooking) : undefined;
  const usePickupLine =
    isVehicleRegistrationAvailable(pathname) && pickupLine != null;
  const cardDetails = usePickupLine
    ? { ...baseDetails, deliveryLine: pickupLine }
    : baseDetails;

  return (
    <BookingCarSummaryCard
      showVehicleIdentification={showVehicleIdentification}
      showVehicleRegistration={showVehicleRegistration}
      cardDetails={cardDetails}
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
  showVehicleRegistration = false,
  surface = "sheet",
  beforeChange,
  hideCarCard = false,
}: ManageBookingSectionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const showReg =
    showVehicleRegistration || isVehicleRegistrationAvailable(pathname);
  const searchParams = useSearchParams();
  const confirmedLoanPlan = useMemo(
    () => parseConfirmedLoanPlan(searchParams, pathname),
    [searchParams, pathname],
  );
  const fullPaymentPlan = useMemo(
    () => parseFullPaymentPlan(searchParams, pathname),
    [searchParams, pathname],
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
        `${JOURNEY_PATHS.booking.cancel}?paid=${totalPaidInr}&stage=post&reason=second-change`,
      );
      return;
    }
    writeChangeEntryStage(stage);
    router.push(JOURNEY_PATHS.booking.modify);
  }, [onClose, router, changeFeeTier, totalPaidInr]);

  const onCancelBooking = useCallback(() => {
    onClose();
    const stage = modifyFeeTier === "free" ? "pre" : "post";
    router.push(`${JOURNEY_PATHS.booking.cancel}?paid=${totalPaidInr}&stage=${stage}`);
  }, [onClose, router, modifyFeeTier, totalPaidInr]);

  return (
    <div className={styles.flex_7}>
      {hideCarCard ? null : (
        <ManageBookingCarCard
          showVehicleIdentification={showVehicleIdentification}
          showVehicleRegistration={showReg}
        />
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
  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      showCloseButton={false}
      panelClassName={BOTTOM_SHEET_SCROLL_PANEL_CLASS}
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
            Booking ID: {DEMO_BOOKING_ID}
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
    </BottomSheetShell>
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
