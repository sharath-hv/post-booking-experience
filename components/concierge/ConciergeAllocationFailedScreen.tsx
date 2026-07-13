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
import clockIcon from "@/assets/Time.svg";
import lockIcon from "@/assets/lock.svg";
import moneyIcon from "@/assets/money.svg";

const BOOKING_LOCK_LABEL = `₹${BOOKING_LOCK_AMOUNT_INR.toLocaleString("en-IN")}`;
const STANDARD_DELIVERY_DATE =
  splitBookingDeliveryLine(BOOKING_STANDARD_DELIVERY_LINE)?.date ?? "in ~3 months";

type AllocationFailedOptionId = "standard_delivery" | "different_car" | "refund";

/** Radio glyph — matches `ChoosePaymentOptionsScreen` (asset off, inline purple on). */
function RadioIndicator({ selected }: { selected: boolean }) {
  if (!selected) {
    return (
      <span className="relative h-4 w-4 shrink-0" aria-hidden>
        <Image src={radioOffIcon} alt="" fill className="object-contain" unoptimized sizes="16px" />
      </span>
    );
  }
  return (
    <span className="relative h-4 w-4 shrink-0" aria-hidden>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="h-4 w-4">
        <circle cx="8" cy="8" r="7.4" stroke="#5920C5" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="4" fill="#5920C5" />
      </svg>
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
        "w-full rounded-2xl border p-4 text-left transition-colors card-elevated",
        selected
          ? "border-[#bda6e8] bg-white bg-[linear-gradient(to_bottom,#f4eefe,rgba(244,238,254,0))]"
          : "border-transparent bg-white",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="relative h-12 w-12 shrink-0">
          <Image
            src={illustrationSrc}
            alt=""
            fill
            className="object-contain object-left"
            unoptimized
            sizes="48px"
          />
        </div>
        <span className="mt-0.5 flex shrink-0">
          <RadioIndicator selected={selected} />
        </span>
      </div>

      <p className="mt-3 text-[17px] font-semibold leading-6 tracking-[-0.1px] text-[#121212]">
        {title}
      </p>
      <p className="mt-1 text-[13px] leading-[19px] text-[#4b4b4b]">{subtitle}</p>

      {/* Decision-driving fact — same dashed-separator slot the payment cards use for their steps. */}
      <div className="mt-3 flex items-center gap-2 border-t border-dashed border-[#dcdbe1] pt-3">
        <span className="relative h-4 w-4 shrink-0">
          <Image src={detailIcon} alt="" fill className="object-contain" unoptimized sizes="16px" />
        </span>
        <span className="min-w-0 text-xs leading-5 text-[#4b4b4b]">{detail}</span>
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
        <div className="flex w-full flex-col gap-4">
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
                <span className="font-semibold text-[#121212]">{STANDARD_DELIVERY_DATE}</span>
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
                <span className="font-semibold text-[#121212]">{BOOKING_LOCK_LABEL}</span> carries over.
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
                Full <span className="font-semibold text-[#121212]">{BOOKING_LOCK_LABEL}</span> back in
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
