"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import locationIcon from "@/assets/Location.svg";
import { CarSummaryCardLite } from "@/components/concierge/artifacts";
import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import {
  BOOKING_CAR_COLOR,
  BOOKING_CAR_TITLE,
  BOOKING_CAR_VARIANT,
} from "@/components/kyc/booking-car-card-content";
import {
  DEMO_VEHICLE_CHASSIS_NO,
  DEMO_VEHICLE_ENGINE_NO,
} from "@/components/kyc/demo-vehicle-identification";
import { PartnerGarageCard } from "@/components/payment/PartnerGarageCard";
import { fireBasicCannon } from "@/lib/confetti-basic-cannon";
import { CAR_SOURCE_DETAIL, CAR_SOURCE_NAME } from "@/lib/dealer-attribution-content";
import {
  DEFAULT_EXPERIENCE_FLOW,
  readExperienceFlow,
  type ExperienceFlow,
} from "@/lib/experience-flow";
import { cn } from "@/lib/utils";
import styles from "./CarDeliveryScheduleScreen.module.scss";

/** Real pickup address — kept as-is, not brand attribution. */
const DEALER_NAME = "Advaith Hyundai";
const DEALER_DETAIL = "Whitefield · Bengaluru";

/** Candidate pickup days inside the promised window (flow-aware). */
const EXPRESS_DAYS = ["Sat 7 Jun", "Sun 8 Jun", "Mon 9 Jun", "Tue 10 Jun"] as const;
const STANDARD_DAYS = ["Thu 22 Oct", "Fri 23 Oct", "Sat 24 Oct", "Sun 25 Oct"] as const;

const WINDOWS = [
  "Morning · 9:00 AM – 12:00 PM",
  "Afternoon · 12:00 PM – 4:00 PM",
  "Evening · 4:00 PM – 8:00 PM",
] as const;

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
  options: readonly string[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionLabel}>Pick a window</p>
      <div className={styles.windowList}>
        {options.map((option) => {
          const [label, time] = option.split(" · ");
          const isSelected = option === selected;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option)}
              className={cn(styles.windowRow, isSelected ? styles.chipSelected : styles.chipIdle)}
            >
              <span className={styles.windowLabel}>{label}</span>
              <span className={styles.windowTime}>{time}</span>
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
  const [day, setDay] = useState<string | null>(null);
  const [windowSlot, setWindowSlot] = useState<string | null>(null);
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    setFlow(readExperienceFlow());
  }, []);

  const days = flow === "standard" ? STANDARD_DAYS : EXPRESS_DAYS;

  const replies = useMemo(
    () => [
      {
        label: "Lock my pickup slot",
        onClick: () => {
          setScheduled(true);
          fireBasicCannon();
        },
        disabled: day == null || windowSlot == null,
        echo: null,
      },
    ],
    [day, windowSlot]
  );

  if (scheduled && day && windowSlot) {
    return (
      <ConciergeTurnShell
        says={[
          `Locked: ${day}, ${windowSlot.toLowerCase()}.`,
          "Your Creta will be ready at the dealership. I'll send the bay details and your registration number the day before. It's been a pleasure, Sharath. Enjoy every kilometre.",
        ]}
        artifact={
          <div className={styles.artifactStack}>
            <PartnerGarageCard name={DEALER_NAME} detail={DEALER_DETAIL} />
            <CarSummaryCardLite
              title={BOOKING_CAR_TITLE}
              variant={BOOKING_CAR_VARIANT}
              colour={BOOKING_CAR_COLOR}
              deliveryLine={`Pickup ${day} · ${windowSlot}`}
              dealerName={CAR_SOURCE_NAME}
              dealerDetail={CAR_SOURCE_DETAIL}
              engineNo={DEMO_VEHICLE_ENGINE_NO}
              chassisNo={DEMO_VEHICLE_CHASSIS_NO}
            />
          </div>
        }
        timeSkip={{ label: "Start over", href: "/quote" }}
      />
    );
  }

  return (
    <ConciergeTurnShell
      says={[
        "Your Creta is ready, Sharath.",
        "Registered, insured, and ready to roll. Come collect it — pick a day and a window, and I'll have it waiting.",
      ]}
      replies={replies}
      callLabel="Special instructions? I can call you"
    >
      <div className={cn(styles.card, "card-elevated")}>
        <div className={styles.locationPanel}>
          <span className={styles.locationIconWell} aria-hidden>
            <Image
              src={locationIcon}
              alt=""
              width={20}
              height={20}
              className={styles.locationIcon}
              unoptimized
            />
          </span>
          <div className={styles.locationCopy}>
            <p className={styles.locationName}>{DEALER_NAME}</p>
            <p className={styles.locationDetail}>{DEALER_DETAIL}</p>
          </div>
        </div>

        <div className={styles.body}>
          <DayChips options={days} selected={day} onSelect={setDay} />
          <WindowChips options={WINDOWS} selected={windowSlot} onSelect={setWindowSlot} />
        </div>
      </div>
    </ConciergeTurnShell>
  );
}
