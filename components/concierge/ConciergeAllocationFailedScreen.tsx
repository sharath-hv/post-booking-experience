"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { writeChangeEntryStage } from "@/lib/change-policy";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { writeExperienceFlow } from "@/lib/experience-flow";
import {
  BOOKING_STANDARD_DELIVERY_LINE,
  splitBookingDeliveryLine,
} from "@/lib/experience-flow-content";
import { JOURNEY_PATHS } from "@/lib/journey-routes";
import { BOOKING_LOCK_AMOUNT_INR } from "@/lib/paymentUrls";
import { cn } from "@/lib/utils";

import bookingCancelledIllustration from "@/assets/Booking cancelled.svg";
import standardDeliveryIllustration from "@/assets/standard delivery.svg";
import changeCarIllustration from "@/assets/Change car.svg";
import radioOffIcon from "@/assets/Radio button off.svg";
import radioOnIcon from "@/assets/Radio button on.svg";
import clockIcon from "@/assets/Time.svg";
import lockIcon from "@/assets/lock.svg";
import moneyIcon from "@/assets/money.svg";
import styles from "./ConciergeAllocationFailedScreen.module.scss";


const BOOKING_LOCK_LABEL = `₹${BOOKING_LOCK_AMOUNT_INR.toLocaleString("en-IN")}`;
const STANDARD_DELIVERY_DATE =
  splitBookingDeliveryLine(BOOKING_STANDARD_DELIVERY_LINE)?.date ?? "in ~3 months";

type AllocationFailedOptionId = "standard_delivery" | "different_car" | "refund";

/** Radio glyph — on/off from `assets/` (#121212 selected). */
function RadioIndicator({ selected }: { selected: boolean }) {
  const src = selected ? radioOnIcon : radioOffIcon;

  return (
    <span className={styles.relative_0} aria-hidden>
      <Image src={src} alt="" fill className={styles.object_contain_1} unoptimized sizes="16px" />
    </span>
  );
}

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
        styles.w_full_13, "card-elevated",
        selected
          ? styles.border_selected_1
          : styles.border_transparent_1,
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
          <RadioIndicator selected={selected} />
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

/**
 * Allocation / dealer-search failed — policy §1.14 remediation.
 * Radio-selectable option cards (one decision-driving fact each, in the payment
 * card's dashed-strip slot) with a contextual footer CTA.
 *
 * Only reachable from the express-only "If no car is found" pill, so it never
 * needs to guard against a standard-flow visit — including the back-nav case
 * right after picking "Wait for standard delivery" (that choice switches the
 * flow to standard, and the user should land back on this screen, not skip past it).
 */
export function ConciergeAllocationFailedScreen() {
  const router = useRouter();
  const [choice, setChoice] = useState<AllocationFailedOptionId>("standard_delivery");

  const onContinue = useCallback(() => {
    if (choice === "standard_delivery") {
      writeExperienceFlow("standard");
      writeConciergeEcho("I'll wait for standard delivery");
      router.push(JOURNEY_PATHS.kyc.bookingAccepted);
      return;
    }
    if (choice === "different_car") {
      writeChangeEntryStage("pre");
      writeConciergeEcho("Let's pick a different car");
      router.push(JOURNEY_PATHS.kyc.modifySelection);
      return;
    }
    router.push(
      `${JOURNEY_PATHS.kyc.cancelBooking}?paid=${BOOKING_LOCK_AMOUNT_INR}&reason=our-failure`
    );
  }, [choice, router]);

  const bodyLine = `We couldn't source your exact Creta on the express timeline. This one's on me, not you, so whatever you choose below, your ${BOOKING_LOCK_LABEL} stays exactly where it is and comes with you.`;

  const ctaLabel =
    choice === "standard_delivery"
      ? "Continue with standard delivery"
      : choice === "different_car"
        ? "Browse other cars"
        : "Get my full refund";

  return (
    <ConciergeTurnShell
      says={["I'm sorry, Sharath. I couldn't find your car.", bodyLine]}
      dateHolder="you"
      artifact={
        <div className={styles.flex_11}>
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
          <AllocationFailedOptionCard
            selected={choice === "different_car"}
            onSelect={() => setChoice("different_car")}
            illustrationSrc={changeCarIllustration}
            title="Change your selection"
            subtitle="Pick a different model, variant, or colour that can reach you sooner."
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
      replies={[{ label: ctaLabel, onClick: onContinue, echo: null }]}
      callLabel="Want to talk it through? I can call you"
    />
  );
}
