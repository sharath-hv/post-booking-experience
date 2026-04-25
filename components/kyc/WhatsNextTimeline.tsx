"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { KYC_ASSETS } from "@/components/kyc/kyc-assets";

export type WhatsNextTimelineVariant = "default" | "compact";

export type TimelineStepStatus = "done" | "in_progress" | "next";

export type WhatsNextTimelineProps = {
  /** Typically in progress (e.g. Car allocation). */
  firstStepTitle: string;
  firstStepDescription: string;
  /** Typically next (e.g. Payment). */
  secondStepTitle: string;
  secondStepDescription: string;
  /** Typically next (e.g. Car delivery). */
  thirdStepTitle: string;
  thirdStepDescription: string;
  /** Icon + title weight for each row (defaults: allocation in progress, payment & delivery next). */
  firstStepStatus?: TimelineStepStatus;
  secondStepStatus?: TimelineStepStatus;
  thirdStepStatus?: TimelineStepStatus;
  /**
   * `compact` — flat card + tighter gaps ([Figma 1961:7224 — Dev](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=1961-7224&m=dev)), used on loan processing only.
   * `default` — elevated card (e.g. payment default).
   */
  variant?: WhatsNextTimelineVariant;
};

function timelineStepTitleClassName(status: TimelineStepStatus) {
  const weight = status === "in_progress" ? "font-medium" : "font-normal";
  return `text-sm ${weight} leading-5 text-[#121212]`;
}

/** Subtext stays regular weight; only step titles vary by status. */
const TIMELINE_STEP_DESCRIPTION_CLASS =
  "mt-1 text-xs font-normal leading-[18px] text-[#757575]";

function TimelineStepIcon({ status }: { status: TimelineStepStatus }) {
  const src =
    status === "done"
      ? KYC_ASSETS.timelineDone
      : status === "in_progress"
        ? KYC_ASSETS.timelineInProgress
        : KYC_ASSETS.timelineNext;
  const label =
    status === "done" ? "Done" : status === "in_progress" ? "In progress" : "Next";

  return (
    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center" title={label}>
      <Image src={src} alt={label} fill className="object-contain" unoptimized sizes="24px" />
    </span>
  );
}

/**
 * Vertical connector from the center of the first status icon to the center of the last.
 * Row height depends on copy (wrapping), so we measure after layout.
 * [Figma 2052:7630](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2052-7630)
 */
export function WhatsNextTimeline({
  firstStepTitle,
  firstStepDescription,
  secondStepTitle,
  secondStepDescription,
  thirdStepTitle,
  thirdStepDescription,
  firstStepStatus = "in_progress",
  secondStepStatus = "next",
  thirdStepStatus = "next",
  variant = "default",
}: WhatsNextTimelineProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const icon1Ref = useRef<HTMLDivElement>(null);
  const icon2Ref = useRef<HTMLDivElement>(null);
  const icon3Ref = useRef<HTMLDivElement>(null);
  const [connector, setConnector] = useState({ top: 0, height: 0 });

  const updateConnector = useCallback(() => {
    const rail = railRef.current;
    const i1 = icon1Ref.current;
    const i3 = icon3Ref.current;
    if (!rail || !i1 || !i3) return;
    const rr = rail.getBoundingClientRect();
    const r1 = i1.getBoundingClientRect();
    const r3 = i3.getBoundingClientRect();
    const c1 = r1.top + r1.height / 2 - rr.top;
    const c3 = r3.top + r3.height / 2 - rr.top;
    setConnector({ top: c1, height: Math.max(0, c3 - c1) });
  }, []);

  useLayoutEffect(() => {
    updateConnector();
  }, [
    updateConnector,
    firstStepDescription,
    secondStepDescription,
    thirdStepDescription,
    firstStepStatus,
    secondStepStatus,
    thirdStepStatus,
    variant,
  ]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const ro = new ResizeObserver(() => updateConnector());
    ro.observe(rail);
    window.addEventListener("resize", updateConnector);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateConnector);
    };
  }, [updateConnector]);

  const sectionClassName =
    variant === "compact"
      ? "rounded-2xl border border-[#e8e8e8] bg-white p-4"
      : "rounded-2xl border border-[#e8e8e8] bg-white px-5 py-6 shadow-[0_2px_8px_-2px_rgba(54,53,76,0.06)]";
  const rowGapClass = variant === "compact" ? "gap-y-3" : "gap-y-4";

  return (
    <section className={sectionClassName}>
      <div ref={railRef} className={`relative grid grid-cols-[24px_1fr] items-start gap-x-3 ${rowGapClass}`}>
        <div
          className="pointer-events-none absolute left-3 w-px -translate-x-1/2 bg-[#e8e8e8]"
          style={{ top: connector.top, height: connector.height }}
          aria-hidden
        />
        <div ref={icon1Ref} className="relative z-[1] flex h-6 w-6 shrink-0 justify-center">
          <TimelineStepIcon status={firstStepStatus} />
        </div>
        <div className="min-w-0">
          <p className={timelineStepTitleClassName(firstStepStatus)}>{firstStepTitle}</p>
          <p className={TIMELINE_STEP_DESCRIPTION_CLASS}>{firstStepDescription}</p>
          <hr className="mt-3 border-0 border-t border-[#e8e8e8]" />
        </div>
        <div ref={icon2Ref} className="relative z-[1] flex h-6 w-6 shrink-0 justify-center">
          <TimelineStepIcon status={secondStepStatus} />
        </div>
        <div className="min-w-0">
          <p className={timelineStepTitleClassName(secondStepStatus)}>{secondStepTitle}</p>
          <p className={TIMELINE_STEP_DESCRIPTION_CLASS}>{secondStepDescription}</p>
          <hr className="mt-3 border-0 border-t border-[#e8e8e8]" />
        </div>
        <div ref={icon3Ref} className="relative z-[1] flex h-6 w-6 shrink-0 justify-center">
          <TimelineStepIcon status={thirdStepStatus} />
        </div>
        <div className="min-w-0">
          <p className={timelineStepTitleClassName(thirdStepStatus)}>{thirdStepTitle}</p>
          <p className={TIMELINE_STEP_DESCRIPTION_CLASS}>{thirdStepDescription}</p>
        </div>
      </div>
    </section>
  );
}
