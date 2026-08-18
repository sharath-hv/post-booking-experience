"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import locationIcon from "@/assets/Location.svg";
import { IconWell } from "@/components/atoms/icon/IconWell";
import { CarSummaryCardLite } from "@/components/organisms/artifacts";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import {
  BOOKING_CAR_COLOR,
  BOOKING_CAR_TITLE,
  BOOKING_CAR_VARIANT,
} from "@/constants/booking-car-card-content";
import {
  DEMO_VEHICLE_CHASSIS_NO,
  DEMO_VEHICLE_ENGINE_NO,
  DEMO_VEHICLE_REGISTRATION_NO,
} from "@/constants/demo-vehicle-identification";
import { PartnerGarageCard } from "@/components/organisms/payment/PartnerGarageCard";
import { OVERLAY_GLASS_CARD_CLASS } from "@/helpers/overlay-glass-card";
import { fireBasicCannon } from "@/utils/confetti-basic-cannon";
import { CAR_SOURCE_DETAIL, CAR_SOURCE_NAME, NAMED_DEALER_DETAIL, NAMED_DEALER_NAME } from "@/constants/dealer-attribution-content";
import {
  DEFAULT_EXPERIENCE_FLOW,
  readExperienceFlow,
  type ExperienceFlow,
} from "@/helpers/experience-flow";
import {
  clearLockedPickupDeliveryLine,
  formatPickupDeliveryLine,
  writeLockedPickupDeliveryLine,
} from "@/helpers/pickup-slot";
import { cn } from "@/utils/utils";
import styles from "./CarDeliveryScheduleScreen.module.scss";

/** Candidate pickup days inside the promised window (flow-aware). */
const EXPRESS_DAYS = ["Sat 7 Jun", "Sun 8 Jun", "Mon 9 Jun", "Tue 10 Jun"] as const;
const STANDARD_DAYS = ["Thu 22 Oct", "Fri 23 Oct", "Sat 24 Oct", "Sun 25 Oct"] as const;

type PickupWindow = {
  /** Shown in the picker only — omitted from card / locked copy. */
  label: string;
  timeRange: string;
};

const WINDOWS: readonly PickupWindow[] = [
  { label: "Morning", timeRange: "9:00 AM – 12:00 PM" },
  { label: "Afternoon", timeRange: "12:00 PM – 4:00 PM" },
  { label: "Evening", timeRange: "4:00 PM – 8:00 PM" },
];

/** Day picker — stacked day / date cards in a grid row. */
function DayChips({
  options,
  selected,
  onSelect,
}: {
  options: readonly string[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionLabel}>Pick a day</p>
      <div className={cn(styles.dayGrid, options.length === 4 ? styles.dayGrid4 : styles.dayGrid5)}>
        {options.map((option) => {
          const [dayName, dateNum] = option.split(" ");
          const isSelected = option === selected;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option)}
              className={cn(styles.dayChip, isSelected ? styles.chipSelected : styles.chipIdle)}
            >
              <span className={styles.dayName}>{dayName}</span>
              <span className={styles.dayDate}>{dateNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Window picker — full-width rows with label on the left, time range on the right. */
function WindowChips({
  options,
  selected,
  onSelect,
}: {
  options: readonly PickupWindow[];
  selected: string | null;
  onSelect: (timeRange: string) => void;
}) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionLabel}>Pick a window</p>
      <div className={styles.windowList}>
        {options.map((option) => {
          const isSelected = option.timeRange === selected;
          return (
            <button
              key={option.timeRange}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.timeRange)}
              className={cn(styles.windowRow, isSelected ? styles.chipSelected : styles.chipIdle)}
            >
              <span className={styles.windowLabel}>{option.label}</span>
              <span className={styles.windowTime}>{option.timeRange}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The climax turn — Shivi asks for the pickup slot right here (inline picker,
 * no detour), then locks it in with confetti. Final turn of the demo journey.
 */
export function CarDeliveryScheduleScreen() {
  const [flow, setFlow] = useState<ExperienceFlow>(DEFAULT_EXPERIENCE_FLOW);
  const [day, setDay] = useState<string | null>(EXPRESS_DAYS[0]);
  const [windowSlot, setWindowSlot] = useState<string | null>(null);
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    const nextFlow = readExperienceFlow();
    setFlow(nextFlow);
    const nextDays = nextFlow === "standard" ? STANDARD_DAYS : EXPRESS_DAYS;
    setDay((current) =>
      current != null && nextDays.some((d) => d === current) ? current : nextDays[0]
    );
  }, []);

  const days = flow === "standard" ? STANDARD_DAYS : EXPRESS_DAYS;

  const pickupLine = useMemo(
    () => (day != null && windowSlot != null ? formatPickupDeliveryLine(day, windowSlot) : null),
    [day, windowSlot],
  );

  const replies = useMemo(
    () => [
      {
        label: "Lock my pickup slot",
        onClick: () => {
          if (pickupLine != null) {
            writeLockedPickupDeliveryLine(pickupLine);
          }
          setScheduled(true);
          fireBasicCannon();
        },
        disabled: day == null || windowSlot == null,
        echo: null,
      },
    ],
    [day, windowSlot, pickupLine]
  );

  // Same-URL two-beat turn — don't skip the day/window picker via history.
  const onBackFromLocked = useCallback(() => {
    clearLockedPickupDeliveryLine();
    setScheduled(false);
  }, []);

  if (scheduled && day && windowSlot && pickupLine) {
    return (
      <ConciergeTurnShell
        key="schedule-locked"
        says={[
          `Locked: ${day}, ${windowSlot}.`,
          "Your Creta will be ready at the dealership. I'll send the bay details and your registration number the day before. It's been a pleasure, Sharath. Enjoy every kilometre.",
        ]}
        artifact={
          <div className={styles.artifactStack}>
            <PartnerGarageCard
              name={NAMED_DEALER_NAME}
              detail={NAMED_DEALER_DETAIL}
              variant="glass"
            />
            <CarSummaryCardLite
              title={BOOKING_CAR_TITLE}
              variant={BOOKING_CAR_VARIANT}
              colour={BOOKING_CAR_COLOR}
              deliveryLine={pickupLine}
              dealerName={CAR_SOURCE_NAME}
              dealerDetail={CAR_SOURCE_DETAIL}
              engineNo={DEMO_VEHICLE_ENGINE_NO}
              chassisNo={DEMO_VEHICLE_CHASSIS_NO}
              registrationNo={DEMO_VEHICLE_REGISTRATION_NO}
            />
          </div>
        }
        timeSkip={{ label: "Start over", href: "/quote" }}
        onBack={onBackFromLocked}
      />
    );
  }

  return (
    <ConciergeTurnShell
      key="schedule-picker"
      says={[
        "Your Creta is ready, Sharath.",
        "Registered, insured, and ready to roll. Come collect it — pick a day and a window, and I'll have it waiting.",
      ]}
      replies={replies}
      callLabel="Special instructions? I can call you"
    >
      <div className={cn(styles.card, OVERLAY_GLASS_CARD_CLASS)}>
        <div className={styles.locationPanel}>
          <IconWell aria-hidden>
            <Image
              src={locationIcon}
              alt=""
              width={20}
              height={20}
              className={styles.locationIcon}
              unoptimized
            />
          </IconWell>
          <div className={styles.locationCopy}>
            <p className={styles.locationName}>{NAMED_DEALER_NAME}</p>
            <p className={styles.locationDetail}>{NAMED_DEALER_DETAIL}</p>
          </div>
        </div>
        <hr className={styles.locationSeparator} />

        <div className={styles.body}>
          <DayChips options={days} selected={day} onSelect={setDay} />
          <WindowChips options={WINDOWS} selected={windowSlot} onSelect={setWindowSlot} />
        </div>
      </div>
    </ConciergeTurnShell>
  );
}
