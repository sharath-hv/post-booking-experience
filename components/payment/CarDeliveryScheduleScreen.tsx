"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import carDeliveryIcon from "@/assets/Car delivery.svg";
import homeIcon from "@/assets/Home.svg";
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
import { fireBasicCannon } from "@/lib/confetti-basic-cannon";
import {
  DEFAULT_EXPERIENCE_FLOW,
  readExperienceFlow,
  type ExperienceFlow,
} from "@/lib/experience-flow";
import { cn } from "@/lib/utils";

const DEALER_NAME = "Advaith Hyundai";
const DEALER_DETAIL = "Whitefield · Bengaluru";

/** Candidate delivery days inside the promised window (flow-aware). */
const EXPRESS_DAYS = ["Sat 7 Jun", "Sun 8 Jun", "Mon 9 Jun", "Tue 10 Jun"] as const;
const STANDARD_DAYS = ["Thu 22 Oct", "Fri 23 Oct", "Sat 24 Oct", "Sun 25 Oct"] as const;

const WINDOWS = ["Morning · 9–12", "Afternoon · 12–4", "Evening · 4–8"] as const;

/** Day picker — stacked day / date / month cards in a grid row. */
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
    <div>
      <p className="text-xs font-medium uppercase leading-4 tracking-[0.06em] text-[#8f8e92]">
        Pick a day
      </p>
      <div className={cn("mt-2 grid gap-2", options.length === 4 ? "grid-cols-4" : "grid-cols-5")}>
        {options.map((option) => {
          const [dayName, dateNum] = option.split(" ");
          const isSelected = option === selected;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl border py-2.5 transition-colors",
                isSelected
                  ? "border-[#121212] bg-[#f5f5f5] text-[#121212]"
                  : "border-[#e8e8e8] bg-white text-[#121212] hover:bg-[#fafafa]"
              )}
            >
              <span className="text-[11px] leading-4 tracking-wide text-[#8f8e92]">
                {dayName}
              </span>
              <span className={cn("text-xl font-semibold leading-7 tabular-nums", isSelected ? "text-[#121212]" : "text-[#121212]")}>
                {dateNum}
              </span>
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
    <div>
      <p className="text-xs font-medium uppercase leading-4 tracking-[0.06em] text-[#8f8e92]">
        Pick a window
      </p>
      <div className="mt-2 flex flex-col gap-2">
        {options.map((option) => {
          const [label, time] = option.split(" · ");
          const isSelected = option === selected;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
                isSelected
                  ? "border-[#121212] bg-[#f5f5f5]"
                  : "border-[#e8e8e8] bg-white hover:bg-[#fafafa]"
              )}
            >
              <span className="text-sm font-medium leading-5 text-[#121212]">
                {label}
              </span>
              <span className="text-sm leading-5 tabular-nums text-[#757575]">
                {time}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The climax turn — Shivi asks for the slot right here (inline picker, no
 * detour), then locks it in with confetti. Final turn of the demo journey.
 */
type DeliveryMode = "pickup" | "home";

export function CarDeliveryScheduleScreen() {
  const [flow, setFlow] = useState<ExperienceFlow>(DEFAULT_EXPERIENCE_FLOW);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("pickup");
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
        label: deliveryMode === "pickup" ? "Lock my pickup slot" : "Lock my delivery slot",
        onClick: () => {
          setScheduled(true);
          fireBasicCannon();
        },
        disabled: deliveryMode === "pickup" ? (day == null || windowSlot == null) : (day == null || windowSlot == null),
        echo: null,
      },
    ],
    [day, windowSlot, deliveryMode]
  );

  if (scheduled && day && windowSlot) {
    return (
      <ConciergeTurnShell
        says={[
          `Locked — ${day}, ${windowSlot.toLowerCase()}.`,
          "Your Creta arrives at your door. I'll send the driver's details and your registration number the day before. It's been a pleasure, Sharath — enjoy every kilometre.",
        ]}
        artifact={
          <CarSummaryCardLite
            title={BOOKING_CAR_TITLE}
            variant={BOOKING_CAR_VARIANT}
            colour={BOOKING_CAR_COLOR}
            deliveryLine={`Arriving ${day} · ${windowSlot}`}
            dealerName={DEALER_NAME}
            dealerDetail={DEALER_DETAIL}
            engineNo={DEMO_VEHICLE_ENGINE_NO}
            chassisNo={DEMO_VEHICLE_CHASSIS_NO}
          />
        }
        timeSkip={{ label: "Start over", href: "/quote" }}
      />
    );
  }

  return (
    <ConciergeTurnShell
      says={[
        "Your Creta is ready, Sharath.",
        "Registered, insured, and ready to roll. Most people like to come collect it — pick a time and it's yours. Prefer your door? I can bring it instead.",
      ]}
      replies={replies}
      callLabel="Special instructions? I can call you"
    >
      <div className="flex flex-col rounded-2xl bg-white card-elevated overflow-hidden pb-4">
        {/* Segmented tab — matches LoanDocumentsChecklistCard pattern */}
        <div
          className="mx-4 mt-4 flex rounded-full bg-[#f5f5f5] p-1"
          role="tablist"
          aria-label="Delivery method"
        >
          {([
            { id: "pickup", label: "Pick it up" },
            { id: "home", label: "Home delivery" },
          ] as const).map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={deliveryMode === option.id}
              onClick={() => { setDeliveryMode(option.id); setDay(null); setWindowSlot(null); }}
              className={cn(
                "h-8 flex-1 rounded-full text-xs font-medium leading-4 transition-colors",
                deliveryMode === option.id
                  ? "bg-white text-[#121212] shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                  : "text-[#757575] hover:text-[#4b4b4b]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5 px-4 py-4">
          {/* Location row */}
          <div className="flex items-start gap-2.5 rounded-xl border border-[#e8e8e8] bg-[#fafafa] px-3 py-3">
            <Image
              src={deliveryMode === "pickup" ? carDeliveryIcon : homeIcon}
              alt=""
              width={20}
              height={20}
              className="mt-0.5 shrink-0 object-contain"
              unoptimized
            />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase leading-4 tracking-[0.06em] text-[#8f8e92]">
                {deliveryMode === "pickup" ? "Pickup location" : "Delivery address"}
              </p>
              {deliveryMode === "pickup" ? (
                <>
                  <p className="mt-1 text-sm font-semibold leading-5 text-[#121212]">{DEALER_NAME}</p>
                  <p className="text-xs leading-4 text-[#757575]">{DEALER_DETAIL}</p>
                </>
              ) : (
                <>
                  <p className="mt-1 text-sm font-semibold leading-5 text-[#121212]">Your registered address</p>
                  <p className="text-xs leading-4 text-[#757575]">Confirmed during KYC</p>
                </>
              )}
            </div>
          </div>

          <DayChips options={days} selected={day} onSelect={setDay} />
          <WindowChips options={WINDOWS} selected={windowSlot} onSelect={setWindowSlot} />
        </div>
      </div>
    </ConciergeTurnShell>
  );
}
