"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";

import { AllocationDecisionDeadlineFootnote } from "@/components/organisms/concierge/DeadlineCountdownFootnote";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { writeChangeEntryStage } from "@/constants/change-policy";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { writeExperienceFlow } from "@/helpers/experience-flow";
import {
  BOOKING_STANDARD_DELIVERY_LINE,
  splitBookingDeliveryLine,
} from "@/constants/experience-flow-content";
import { JOURNEY_PATHS } from "@/helpers/journey-routes";
import { OVERLAY_GLASS_CARD_CLASS } from "@/helpers/overlay-glass-card";
import { BOOKING_LOCK_AMOUNT_INR } from "@/helpers/paymentUrls";
import { cn } from "@/utils/utils";

import bookingCancelledIllustration from "@/assets/Booking cancelled.svg";
import standardDeliveryIllustration from "@/assets/standard delivery.svg";
import changeCarIllustration from "@/assets/Change car.svg";
import { Radio } from "@/components/atoms/selection/Radio";
import clockIcon from "@/assets/Time.svg";
import lockIcon from "@/assets/lock.svg";
import moneyIcon from "@/assets/money.svg";
import styles from "./ConciergeAllocationFailedScreen.module.scss";


const BOOKING_LOCK_LABEL = `₹${BOOKING_LOCK_AMOUNT_INR.toLocaleString("en-IN")}`;
const STANDARD_DELIVERY_DATE =
  splitBookingDeliveryLine(BOOKING_STANDARD_DELIVERY_LINE)?.date ?? "in ~3 months";

export type AllocationFailedMode = "express_miss" | "discontinued";

type AllocationFailedOptionId = "standard_delivery" | "different_car" | "refund";

type AllocationFailedOptionCardProps = {
  selected: boolean;
  onSelect: () => void;
  illustrationSrc: string | StaticImageData;
  title: string;
  subtitle: string;
  /** Icon + one decision-driving fact, in the dashed footer strip (mirrors the payment cards' step strip). */
  detailIcon: string | StaticImageData;
  detail: ReactNode;
};

function AllocationFailedOptionCard({
  selected,
  onSelect,
  illustrationSrc,
  title,
  subtitle,
  detailIcon,
  detail,
}: AllocationFailedOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        styles.w_full_13,
        OVERLAY_GLASS_CARD_CLASS,
        selected && styles.border_selected_1,
      )}
    >
      <div className={styles.flex_3}>
        <div className={styles.relative_4}>
          <Image
            src={illustrationSrc}
            alt=""
            fill
            className={styles.object_contain_5}
            unoptimized
            sizes="48px"
          />
        </div>
        <span className={styles.mt_0_5_6}>
          <Radio selected={selected} />
        </span>
      </div>

      <p className={styles.mt_3_7}>
        {title}
      </p>
      <p className={styles.mt_1_8}>{subtitle}</p>

      {/* Decision-driving fact — same dashed-separator slot the payment cards use for their steps. */}
      <div className={styles.mt_3_9}>
        <span className={styles.relative_0}>
          <Image src={detailIcon} alt="" fill className={styles.object_contain_1} unoptimized sizes="16px" />
        </span>
        <span className={styles.min_w_0_10}>{detail}</span>
      </div>
    </button>
  );
}

export type ConciergeAllocationFailedScreenProps = {
  /**
   * `express_miss` — exact unit unavailable on express (includes wait-for-standard).
   * `discontinued` — selected variant discontinued; no standard-delivery out.
   */
  mode?: AllocationFailedMode;
};

/**
 * Allocation / dealer-search failed — policy §1.14 remediation.
 * Radio-selectable option cards (one decision-driving fact each, in the payment
 * card's dashed-strip slot) with a contextual footer CTA.
 *
 * Express-only demo entries: “If no car is found” → `express_miss`;
 * “If the variant is discontinued” → `discontinued`.
 */
export function ConciergeAllocationFailedScreen({
  mode = "express_miss",
}: ConciergeAllocationFailedScreenProps) {
  const router = useRouter();
  const isDiscontinued = mode === "discontinued";
  const [choice, setChoice] = useState<AllocationFailedOptionId>(
    isDiscontinued ? "different_car" : "standard_delivery",
  );

  const onContinue = useCallback(() => {
    if (choice === "standard_delivery") {
      writeExperienceFlow("standard");
      writeConciergeEcho("I'll wait for standard delivery");
      router.push(JOURNEY_PATHS.booking.accepted);
      return;
    }
    if (choice === "different_car") {
      writeChangeEntryStage("pre");
      writeConciergeEcho("Let's pick a different car");
      router.push(JOURNEY_PATHS.booking.modify);
      return;
    }
    writeConciergeEcho("Get my full refund");
    router.push(
      `${JOURNEY_PATHS.booking.cancel}?paid=${BOOKING_LOCK_AMOUNT_INR}&reason=our-failure`
    );
  }, [choice, router]);

  const says = isDiscontinued
    ? ([
        "I'm sorry, Sharath. That Creta variant isn't available anymore.",
        `Hyundai has discontinued the exact variant you locked. This one's on me, not you, so whatever you choose below, your ${BOOKING_LOCK_LABEL} stays exactly where it is and comes with you.`,
      ] as const)
    : ([
        "I'm sorry, Sharath. I couldn't find your car.",
        `We couldn't source your exact Creta on the express timeline. This one's on me, not you, so whatever you choose below, your ${BOOKING_LOCK_LABEL} stays exactly where it is and comes with you.`,
      ] as const);

  const ctaLabel =
    choice === "standard_delivery"
      ? "Continue with standard delivery"
      : choice === "different_car"
        ? "Browse other cars"
        : "Get my full refund";

  return (
    <ConciergeTurnShell
      says={says}
      dateHolder="you"
      artifact={
        <div className={styles.flex_11}>
          {isDiscontinued ? null : (
            <AllocationFailedOptionCard
              selected={choice === "standard_delivery"}
              onSelect={() => setChoice("standard_delivery")}
              illustrationSrc={standardDeliveryIllustration}
              title="Wait for standard delivery"
              subtitle="The exact same Creta, same spec, sourced on the standard timeline instead of express."
              detailIcon={clockIcon}
              detail={
                <>
                  Estimated delivery by{" "}
                  <span className={styles.font_semibold_12}>{STANDARD_DELIVERY_DATE}</span>
                </>
              }
            />
          )}
          <AllocationFailedOptionCard
            selected={choice === "different_car"}
            onSelect={() => setChoice("different_car")}
            illustrationSrc={changeCarIllustration}
            title="Change your selection"
            subtitle={
              isDiscontinued
                ? "Pick a different model, variant, or colour that's still available."
                : "Pick a different model, variant, or colour that can reach you sooner."
            }
            detailIcon={lockIcon}
            detail={
              <>
                No change fee. Your{" "}
                <span className={styles.font_semibold_12}>{BOOKING_LOCK_LABEL}</span> carries over.
              </>
            }
          />
          <AllocationFailedOptionCard
            selected={choice === "refund"}
            onSelect={() => setChoice("refund")}
            illustrationSrc={bookingCancelledIllustration}
            title="Cancel with a full refund"
            subtitle="Prefer to step away for now? No hard feelings, and the door stays open."
            detailIcon={moneyIcon}
            detail={
              <>
                Full <span className={styles.font_semibold_12}>{BOOKING_LOCK_LABEL}</span> back in
                5–7 days.
              </>
            }
          />
        </div>
      }
      footnote={<AllocationDecisionDeadlineFootnote />}
      replies={[{ label: ctaLabel, onClick: onContinue, navigates: true, echo: null }]}
      altTimeSkip={{
        label: "SLA timed out",
        href: JOURNEY_PATHS.carAllocation.decisionCancelled,
      }}
      callLabel="Want to talk?"
    />
  );
}
