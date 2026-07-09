"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  AmountReceivedCard,
  CarSummaryCardLite,
  NextStepCard,
  NoteCallout,
  PlanList,
  type PlanItem,
} from "@/components/concierge/artifacts";
import { ConciergeTurnShell, type ConciergeTurn } from "@/components/concierge/ConciergeTurnShell";
import {
  BOOKING_CAR_COLOR,
  BOOKING_CAR_TITLE,
  BOOKING_CAR_VARIANT,
} from "@/components/kyc/booking-car-card-content";
import {
  DEMO_VEHICLE_CHASSIS_NO,
  DEMO_VEHICLE_ENGINE_NO,
} from "@/components/kyc/demo-vehicle-identification";
import { PaymentSummaryCard } from "@/components/payment/PaymentSummaryCard";
import { readActiveBookingSnapshot } from "@/lib/active-booking-snapshot";
import { ARRIVAL_LEAD_PAID, getTurnWords, type ConciergeMomentId } from "@/lib/concierge/script";
import {
  DEFAULT_EXPERIENCE_FLOW,
  isCancelNoChargesFlow,
  readExperienceFlow,
  type ExperienceFlow,
} from "@/lib/experience-flow";
import {
  getBookingDeliveryLine,
  getBookingDeliveryTextClass,
} from "@/lib/experience-flow-content";
import { JOURNEY_PATHS } from "@/lib/journey-routes";
import {
  recordKycVerificationFailure,
  resetKycVerificationFailureCount,
} from "@/lib/kyc-verification-attempts";
import {
  resolveKycVerificationFailureReason,
} from "@/components/kyc/kyc-verification-failed-content";
import {
  getKycVerificationNextHref,
  KYC_VERIFICATION_FAILED_HREF,
} from "@/lib/kyc-verification-outcome";
import { BOOKING_LOCK_AMOUNT_INR } from "@/lib/paymentUrls";

const DEALER_NAME = "Advaith Hyundai";
const DEALER_DETAIL = "Whitefield · Bengaluru";

export type ConciergeMomentProps = {
  moment: ConciergeMomentId;
};

/**
 * One scripted moment of the concierge journey — resolves the active flow,
 * pulls Shivi's words from the script, and assembles the turn (artifacts,
 * routes, demo time-skips) for the shell.
 */
export function ConciergeMoment({ moment }: ConciergeMomentProps) {
  return (
    <Suspense>
      <ConciergeMomentInner moment={moment} />
    </Suspense>
  );
}

function ConciergeMomentInner({ moment }: ConciergeMomentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [flow, setFlow] = useState<ExperienceFlow>(DEFAULT_EXPERIENCE_FLOW);
  const [flowReady, setFlowReady] = useState(false);
  /** Arrival only — the price-lock payment settles while Shivi talks. */
  const [arrivalPaid, setArrivalPaid] = useState(false);

  useEffect(() => {
    setFlow(readExperienceFlow());
    setFlowReady(true);
  }, []);

  const words = useMemo(() => getTurnWords(moment, flow), [moment, flow]);

  /** Car details — honour an updated selection from the modify flows. */
  const car = useMemo(() => {
    if (!flowReady) {
      return { title: BOOKING_CAR_TITLE, variant: BOOKING_CAR_VARIANT, colour: BOOKING_CAR_COLOR };
    }
    const snapshot = readActiveBookingSnapshot();
    return {
      title: snapshot?.carTitle ?? BOOKING_CAR_TITLE,
      variant: snapshot?.carVariant ?? BOOKING_CAR_VARIANT,
      colour: snapshot?.colourName ?? BOOKING_CAR_COLOR,
    };
  }, [flowReady]);

  const deliveryLine = getBookingDeliveryLine(flow);
  const deliveryLineClass = getBookingDeliveryTextClass(flow);

  const turn: ConciergeTurn & { hideBack?: boolean } = useMemo(() => {
    const base: ConciergeTurn & { hideBack?: boolean } = {
      dayStamp: words.dayStamp,
      says: words.says,
      footnote: words.footnote,
      footnoteLead: words.footnoteLead,
      callLabel: words.callLabel,
    };

    const primaryReply = (href: string) =>
      words.replyLabel
        ? [{ label: words.replyLabel, href, echo: words.replyEcho }]
        : undefined;

    const working = words.workingLines
      ? {
          lines: words.workingLines,
          mode: words.workingMode,
          doneLabel: words.workingDoneLabel,
          etaLabel: words.workingEtaLabel,
          doneCount: words.workingDoneCount,
        }
      : undefined;

    switch (moment) {
      case "arrival": {
        const planItems: PlanItem[] = [
          {
            icon: "documents",
            title: "A quick paperwork step",
            detail: "Confirm a couple of documents. Two minutes.",
          },
          {
            icon: "car",
            title: "I find your exact car",
            detail: "Your variant and colour, reserved in your name with a dealer.",
          },
          {
            icon: "money",
            title: "We sort the money",
            detail: "Finance through me or your own bank. Your call.",
          },
          {
            icon: "delivery",
            title: "Your Creta arrives",
            detail: deliveryLine,
          },
        ];
        return {
          ...base,
          says: arrivalPaid ? [ARRIVAL_LEAD_PAID, ...base.says.slice(1)] : base.says,
          hideBack: true,
          afterLead: (
            <AmountReceivedCard
              amountInr={BOOKING_LOCK_AMOUNT_INR}
              status={arrivalPaid ? "received" : "processing"}
              title={arrivalPaid ? "Payment received" : "Payment processing…"}
            />
          ),
          artifact: <PlanList items={planItems} />,
          replies: primaryReply(JOURNEY_PATHS.kyc.hub),
        };
      }

      case "documentsReceived": {
        // OCR verifies in-session — no queue screen. Failure surfaces right here;
        // the cancel-no-charges demo still parks on the holding turn.
        // Reset the retry counter on every fresh submission so demo reruns don't
        // accidentally exhaust retries from a previous session.
        resetKycVerificationFailureCount();
        const failed = getKycVerificationNextHref() === KYC_VERIFICATION_FAILED_HREF;

        // Tailor dialogue + working lines to whichever doc(s) were (re-)submitted.
        const reuploadReason = resolveKycVerificationFailureReason(searchParams.get("reason"));
        const reuploadSays: Record<typeof reuploadReason, readonly string[]> = {
          pan_not_clear:      ["Got your PAN, Sharath. Running it through now.", "This won't take long."],
          aadhaar_not_clear:  ["Got your Aadhaar, Sharath. Running it through now.", "This won't take long."],
          address_mismatch:   ["Got your Aadhaar, Sharath. Checking the address details now.", "This won't take long."],
          name_mismatch:      ["Got both documents, Sharath. Checking the names match now.", "This won't take long."],
          image_not_clear:    ["Got your documents, Sharath. I'm verifying them now.", "This won't take long."],
        };
        const reuploadWorkingLines: Record<typeof reuploadReason, readonly string[]> = {
          pan_not_clear:      ["Reading your PAN", "Checking your name"],
          aadhaar_not_clear:  ["Reading your Aadhaar", "Checking your name and address"],
          address_mismatch:   ["Reading your Aadhaar", "Checking your address details"],
          name_mismatch:      ["Reading your PAN", "Matching your Aadhaar details", "Checking your name and address"],
          image_not_clear:    ["Reading your PAN", "Matching your Aadhaar details", "Checking your name and address"],
        };
        // If ?reason= is present it's a re-upload — always treat as success (the fix worked).
        const isReupload = searchParams.has("reason");
        const overrideSays = isReupload ? reuploadSays[reuploadReason] : undefined;
        const overrideLines = isReupload ? reuploadWorkingLines[reuploadReason] : undefined;
        const nextHref = isCancelNoChargesFlow(flow)
          ? JOURNEY_PATHS.kyc.verificationInProgress
          : JOURNEY_PATHS.kyc.processing;
        const workingWithOverride = working && overrideLines
          ? { ...working, lines: overrideLines }
          : working;

        return {
          ...base,
          ...(overrideSays ? { says: overrideSays } : {}),
          working:
            workingWithOverride && failed && !isReupload
              ? {
                  ...workingWithOverride,
                  doneLabel: "One detail needs a second look",
                  doneTone: "warning",
                }
              : workingWithOverride,
          replies: failed && !isReupload
            ? [
                {
                  label: "Show me what's wrong",
                  echo: "Show me what's wrong",
                  onClick: () => {
                    recordKycVerificationFailure();
                    router.push(KYC_VERIFICATION_FAILED_HREF);
                  },
                },
              ]
            : primaryReply(nextHref),
        };
      }

      case "verificationInProgress": {
        const nextHref = getKycVerificationNextHref();
        const hideSkip = isCancelNoChargesFlow(flow);
        return {
          ...base,
          artifact: (
            <NoteCallout>
              Nothing needed from you right now. I&apos;ll message you the moment there&apos;s
              news.
            </NoteCallout>
          ),
          timeSkip:
            words.timeSkipLabel && !hideSkip
              ? {
                  label: words.timeSkipLabel,
                  href: nextHref,
                  onBeforeNavigate:
                    nextHref === KYC_VERIFICATION_FAILED_HREF
                      ? recordKycVerificationFailure
                      : undefined,
                }
              : undefined,
        };
      }

      case "dealerSearch":
        return {
          ...base,
          working,
          footnoteInline: true,
          timeSkip: words.timeSkipLabel
            ? { label: words.timeSkipLabel, href: JOURNEY_PATHS.kyc.bookingAccepted }
            : undefined,
        };

      case "dealerFound": {
        const deliveryDate = deliveryLine
          .replace("Express delivery by", "")
          .replace("Standard delivery by", "")
          .trim();
        return {
          ...base,
          // No reply buttons here, but the date is in the user's hands — the call is the action.
          dateHolder: "you",
          artifact: (
            <div className="flex flex-col gap-5">
              <CarSummaryCardLite
                title={car.title}
                variant={car.variant}
                colour={car.colour}
                statusChip="Reserved"
                statusChipVariant="blue"
                deliveryLine={deliveryLine}
                deliveryLineClassName={deliveryLineClass}
                dealerName={DEALER_NAME}
                dealerDetail={DEALER_DETAIL}
                engineNo={DEMO_VEHICLE_ENGINE_NO}
                chassisNo={DEMO_VEHICLE_CHASSIS_NO}
              />
              <NextStepCard
                title={`Pick up ${DEALER_NAME}'s call`}
                body="Share the OTP that you receive. It registers the Creta on Hyundai's system and locks it in your name. Expected today, before 6:00 PM."
              />
              <NoteCallout>
                If you miss the call, your reservation and your {deliveryDate} delivery could slip.
              </NoteCallout>
              <p className="px-1 text-xs leading-[18px] text-[#757575]">
                <span className="font-semibold">Having second thoughts?</span> A change costs ₹5,000 and
                cancelling holds back half of what you&apos;ve paid. Both are in the menu up top.
              </p>
            </div>
          ),
          timeSkip: words.timeSkipLabel
            ? { label: words.timeSkipLabel, href: JOURNEY_PATHS.kyc.bookingConfirmed }
            : undefined,
        };
      }

      case "carReserved":
        return {
          ...base,
          artifact: (
            <CarSummaryCardLite
              title={car.title}
              variant={car.variant}
              colour={car.colour}
              statusChip="Yours ✓"
              deliveryLine={deliveryLine}
              deliveryLineClassName={deliveryLineClass}
              dealerName={DEALER_NAME}
              dealerDetail={DEALER_DETAIL}
              engineNo={DEMO_VEHICLE_ENGINE_NO}
              chassisNo={DEMO_VEHICLE_CHASSIS_NO}
            />
          ),
          replies: primaryReply(JOURNEY_PATHS.payment.default),
        };

      case "allocationPending":
        return {
          ...base,
          working,
          timeSkip: words.timeSkipLabel
            ? { label: words.timeSkipLabel, href: JOURNEY_PATHS.carAllocation.confirmed }
            : undefined,
          altTimeSkip: { label: "If no car is found", href: "/car-allocation/failed" },
        };

      case "allocationDone":
        return {
          ...base,
          artifact: (
            <CarSummaryCardLite
              title={car.title}
              variant={car.variant}
              colour={car.colour}
              statusChip="Yours ✓"
              deliveryLine={deliveryLine}
              deliveryLineClassName={deliveryLineClass}
              dealerName={DEALER_NAME}
              dealerDetail={DEALER_DETAIL}
              engineNo={DEMO_VEHICLE_ENGINE_NO}
              chassisNo={DEMO_VEHICLE_CHASSIS_NO}
            />
          ),
          replies: primaryReply(JOURNEY_PATHS.payment.default),
        };

      case "moneyIntro":
        return {
          ...base,
          artifact: <PaymentSummaryCard />,
          replies: primaryReply(JOURNEY_PATHS.payment.choose),
        };
    }
  }, [moment, words, flow, car, deliveryLine, deliveryLineClass, arrivalPaid, router, searchParams]);

  const { hideBack, ...turnProps } = turn;

  return (
    <ConciergeTurnShell
      {...turnProps}
      hideBack={hideBack}
      onContentShown={moment === "arrival" ? () => setArrivalPaid(true) : undefined}
    />
  );
}

export type { ConciergeMomentId };

/** Convenience wrappers so app pages stay one-liners. */
export function ConciergeMomentPage({ moment }: { moment: ConciergeMomentId }): ReactNode {
  return <ConciergeMoment moment={moment} />;
}
