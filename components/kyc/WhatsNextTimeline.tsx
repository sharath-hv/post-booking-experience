"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import styles from "./WhatsNextTimeline.module.scss";


export type WhatsNextTimelineVariant = "default" | "compact";

export type WhatsNextTimelineSurface = "card" | "flat";

export type TimelineStepStatus = "done" | "in_progress" | "next";

/** Nested rows under the main “Payment” timeline step (self finance only). */
export type WhatsNextTimelinePaymentSubStep = {
  title: string;
  description?: string;
  status: TimelineStepStatus;
};

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
  /**
   * `card` — bordered panel with inner padding (e.g. `/payment/default`).
   * `flat` — rail only: aligns with parent `px-5`.
   */
  surface?: WhatsNextTimelineSurface;
  /**
   * When set (e.g. self finance), renders a nested checklist under the second step copy.
   * Does not add main-rail icons — connector math stays 3-step.
   */
  paymentSubSteps?: WhatsNextTimelinePaymentSubStep[];
};

function timelineStepTitleClassName(status: TimelineStepStatus) {
  const weight = status === "in_progress" ? styles.font_medium_0 : styles.font_normal_1;
  return cn(styles.stepTitleBase, weight);
}

/** Subtext stays regular weight; only step titles vary by status. */
const TIMELINE_STEP_DESCRIPTION_CLASS = styles.timelineStepDescription;

/** Completed / active connector. */
const CONNECTOR_ACTIVE = "#138808";

type LineSeg = { top: number; height: number };

const EMPTY_LINE: LineSeg = { top: 0, height: 0 };

function TimelineStepIcon({ status }: { status: TimelineStepStatus }) {
  const src =
    status === "done"
      ? KYC_ASSETS.timelineDone
      : status === "in_progress"
        ? KYC_ASSETS.timelineInProgress
        : KYC_ASSETS.timelineNext;
  const label =
    status === "done" ? "Done" : status === "in_progress" ? "In progress" : "Up next";

  return (
    <span className={styles.relative_0} title={label}>
      <Image src={src} alt={label} fill className={styles.object_contain_1} unoptimized sizes="24px" />
    </span>
  );
}

function TimelinePaymentSubStepIcon({ status }: { status: TimelineStepStatus }) {
  const src =
    status === "done"
      ? KYC_ASSETS.timelineDone
      : status === "in_progress"
        ? KYC_ASSETS.timelineInProgress
        : KYC_ASSETS.timelineNext;
  const label =
    status === "done" ? "Done" : status === "in_progress" ? "In progress" : "Up next";

  return (
    <span
      className={styles.relative_2}
      title={label}
    >
      <Image src={src} alt={label} fill className={styles.object_contain_1} unoptimized sizes="16px" />
    </span>
  );
}

function timelinePaymentSubStepTitleClassName(status: TimelineStepStatus) {
  const weight = status === "in_progress" ? styles.font_medium_2 : styles.font_normal_3;
  return cn(styles.subStepTitleBase, weight);
}

/**
 * Vertical connectors: green through completed steps up to `in_progress`; grey for the rest.
 * When every step is still “up next”, the full rail stays grey.
 * Spans the center of the first icon to the center of the last.
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
  surface = "card",
  paymentSubSteps,
}: WhatsNextTimelineProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const icon1Ref = useRef<HTMLDivElement>(null);
  const icon2Ref = useRef<HTMLDivElement>(null);
  const icon3Ref = useRef<HTMLDivElement>(null);
  const [connectorGreen, setConnectorGreen] = useState<LineSeg>(EMPTY_LINE);
  const [connectorGrey, setConnectorGrey] = useState<LineSeg>(EMPTY_LINE);

  const updateConnector = useCallback(() => {
    const rail = railRef.current;
    const i1 = icon1Ref.current;
    const i2 = icon2Ref.current;
    const i3 = icon3Ref.current;
    if (!rail || !i1 || !i2 || !i3) {
      setConnectorGreen(EMPTY_LINE);
      setConnectorGrey(EMPTY_LINE);
      return;
    }
    const rr = rail.getBoundingClientRect();
    const mid = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 - rr.top;
    };
    const y = [mid(i1), mid(i2), mid(i3)] as const;

    const statuses: TimelineStepStatus[] = [firstStepStatus, secondStepStatus, thirdStepStatus];
    const inProgressIdx = statuses.findIndex((s) => s === "in_progress");

    let splitIdx: number;
    if (inProgressIdx >= 0) {
      splitIdx = inProgressIdx;
    } else if (statuses.every((s) => s === "done")) {
      splitIdx = 2;
    } else {
      let lastDoneIdx = -1;
      for (let i = 0; i < statuses.length; i++) {
        if (statuses[i] === "done") lastDoneIdx = i;
        else break;
      }
      // No done / in-progress steps yet — keep the full rail grey (e.g. all “up next”).
      splitIdx = lastDoneIdx >= 0 ? lastDoneIdx : 0;
    }

    setConnectorGreen({ top: y[0], height: Math.max(0, y[splitIdx] - y[0]) });
    setConnectorGrey({ top: y[splitIdx], height: Math.max(0, y[2] - y[splitIdx]) });
  }, [firstStepStatus, secondStepStatus, thirdStepStatus]);

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
    surface,
    paymentSubSteps,
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

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updateConnector);
    });
    return () => window.cancelAnimationFrame(id);
  }, [updateConnector]);

  const sectionClassName =
    variant === "compact"
      ? [styles.rounded_2xl_4, "card-elevated"].filter(Boolean).join(" ")
      : [styles.rounded_2xl_5, "card-elevated"].filter(Boolean).join(" ");
  const rowGapClass = variant === "compact" ? styles.gap_y_3_6 : styles.gap_y_4_7;

  const timelineRail = (
    <div ref={railRef} className={cn(styles.relative_0_0, rowGapClass)}>
      {connectorGreen.height > 0 ? (
        <div
          className={styles.pointer_events_none_3}
          style={{
            top: connectorGreen.top,
            height: connectorGreen.height,
            backgroundColor: CONNECTOR_ACTIVE,
          }}
          aria-hidden
        />
      ) : null}
      {connectorGrey.height > 0 ? (
        <div
          className={styles.pointer_events_none_4}
          style={{ top: connectorGrey.top, height: connectorGrey.height }}
          aria-hidden
        />
      ) : null}
      <div ref={icon1Ref} className={styles.relative_5}>
        <TimelineStepIcon status={firstStepStatus} />
      </div>
      <div className={styles.min_w_0_6}>
        <p className={timelineStepTitleClassName(firstStepStatus)}>{firstStepTitle}</p>
        <p className={TIMELINE_STEP_DESCRIPTION_CLASS}>{firstStepDescription}</p>
        <hr className={styles.mt_3_7} />
      </div>
      <div ref={icon2Ref} className={styles.relative_5}>
        <TimelineStepIcon status={secondStepStatus} />
      </div>
      <div className={styles.min_w_0_6}>
        <p className={timelineStepTitleClassName(secondStepStatus)}>{secondStepTitle}</p>
        <p className={TIMELINE_STEP_DESCRIPTION_CLASS}>{secondStepDescription}</p>
        {paymentSubSteps && paymentSubSteps.length > 0 ? (
          <ul
            className={styles.mt_3_8}
            aria-label="Payment steps"
          >
            {paymentSubSteps.map((step, index) => (
              <li key={`${step.title}-${index}`} className={styles.flex_9}>
                <TimelinePaymentSubStepIcon status={step.status} />
                <div className={styles.min_w_0_6}>
                  <p className={timelinePaymentSubStepTitleClassName(step.status)}>{step.title}</p>
                  {step.description ? (
                    <p className={styles.mt_0_5_10}>
                      {step.description}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        <hr className={styles.mt_3_7} />
      </div>
      <div ref={icon3Ref} className={styles.relative_5}>
        <TimelineStepIcon status={thirdStepStatus} />
      </div>
      <div className={styles.min_w_0_6}>
        <p className={timelineStepTitleClassName(thirdStepStatus)}>{thirdStepTitle}</p>
        <p className={TIMELINE_STEP_DESCRIPTION_CLASS}>{thirdStepDescription}</p>
      </div>
    </div>
  );

  if (surface === "flat") {
    return timelineRail;
  }

  return <section className={sectionClassName}>{timelineRail}</section>;
}
