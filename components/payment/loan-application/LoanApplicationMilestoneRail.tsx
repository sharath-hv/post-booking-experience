"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import type { TimelineStepStatus } from "@/components/kyc/WhatsNextTimeline";
import styles from "./LoanApplicationMilestoneRail.module.scss";

import {
  LOAN_APPLICATION_MILESTONES,
  routeToMilestone,
  type LoanApplicationMilestoneId,
  type LoanApplicationRoute,
} from "@/lib/loan-application-content";

const CONNECTOR_ACTIVE_LIGHT = "#138808";
const CONNECTOR_INACTIVE_LIGHT = "#e8e8e8";
const CONNECTOR_ACTIVE_DARK = "#ffffff";
const CONNECTOR_INACTIVE_DARK = "rgba(255,255,255,0.28)";
/** Opaque fill so connector lines do not show through hollow step rings. */
const MILESTONE_ICON_FILL_DARK = "#044328";

type LineSeg = { left: number; width: number };

const EMPTY_LINE: LineSeg = { left: 0, width: 0 };

function milestoneStatus(
  milestoneId: LoanApplicationMilestoneId,
  activeMilestone: LoanApplicationMilestoneId,
): TimelineStepStatus {
  const order = LOAN_APPLICATION_MILESTONES.map((m) => m.id);
  const activeIndex = order.indexOf(activeMilestone);
  const index = order.indexOf(milestoneId);
  if (index < activeIndex) return "done";
  if (index === activeIndex) return "in_progress";
  return "next";
}

function MilestoneIcon({
  status,
  theme,
}: {
  status: TimelineStepStatus;
  theme: "light" | "dark";
}) {
  const label =
    status === "done" ? "Done" : status === "in_progress" ? "In progress" : "Up next";

  if (theme === "dark") {
    return (
      <span className={styles.relative_0} title={label}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          {status === "done" ? (
            <>
              <circle
                cx="12"
                cy="12"
                r="9"
                fill={MILESTONE_ICON_FILL_DARK}
                stroke="white"
                strokeWidth="1.33"
              />
              <path
                d="M8.25 12.25 10.75 14.75 15.75 9.75"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : status === "in_progress" ? (
            <>
              <circle
                cx="12"
                cy="12"
                r="9"
                fill={MILESTONE_ICON_FILL_DARK}
                stroke="white"
                strokeWidth="1.33"
              />
              <circle cx="12" cy="12" r="4" fill="white" />
            </>
          ) : (
            <circle
              cx="12"
              cy="12"
              r="9"
              fill={MILESTONE_ICON_FILL_DARK}
              stroke="white"
              strokeWidth="1.33"
            />
          )}
        </svg>
      </span>
    );
  }

  const src =
    status === "done"
      ? KYC_ASSETS.timelineDone
      : status === "in_progress"
        ? KYC_ASSETS.timelineInProgress
        : KYC_ASSETS.timelineNext;

  return (
    <span className={styles.relative_0} title={label}>
      <Image src={src} alt={label} fill className={styles.object_contain_1} unoptimized sizes="20px" />
    </span>
  );
}

type LoanApplicationMilestoneRailProps = {
  currentRoute: LoanApplicationRoute;
  theme?: "light" | "dark";
};

/**
 * Horizontal milestone rail — same done / in-progress / next logic as delivery timeline.
 */
export function LoanApplicationMilestoneRail({
  currentRoute,
  theme = "light",
}: LoanApplicationMilestoneRailProps) {
  const activeMilestone = routeToMilestone(currentRoute);
  const connectorActive =
    theme === "dark" ? CONNECTOR_ACTIVE_DARK : CONNECTOR_ACTIVE_LIGHT;
  const connectorInactive =
    theme === "dark" ? CONNECTOR_INACTIVE_DARK : CONNECTOR_INACTIVE_LIGHT;
  const railRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [connectorGreen, setConnectorGreen] = useState<LineSeg>(EMPTY_LINE);
  const [connectorGrey, setConnectorGrey] = useState<LineSeg>(EMPTY_LINE);

  const updateConnector = useCallback(() => {
    const rail = railRef.current;
    const icons = iconRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!rail || icons.length < 2) {
      setConnectorGreen(EMPTY_LINE);
      setConnectorGrey(EMPTY_LINE);
      return;
    }

    const rr = rail.getBoundingClientRect();
    const mid = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.left + r.width / 2 - rr.left;
    };

    const centers = icons.map(mid);
    const first = centers[0]!;
    const last = centers[centers.length - 1]!;

    const activeIndex = LOAN_APPLICATION_MILESTONES.findIndex((m) => m.id === activeMilestone);
    const progressIndex = Math.max(0, activeIndex);

    if (progressIndex <= 0) {
      setConnectorGreen(EMPTY_LINE);
      setConnectorGrey({ left: first, width: Math.max(0, last - first) });
      return;
    }

    const currentCenter = centers[progressIndex] ?? last;
    let progressCenter = currentCenter;

    // Personal milestone has two substeps — address fills halfway toward Documents.
    if (currentRoute === "address" && progressIndex + 1 < centers.length) {
      const nextCenter = centers[progressIndex + 1]!;
      progressCenter = currentCenter + (nextCenter - currentCenter) * 0.5;
    }

    setConnectorGreen({ left: first, width: Math.max(0, progressCenter - first) });
    setConnectorGrey({ left: progressCenter, width: Math.max(0, last - progressCenter) });
  }, [activeMilestone, currentRoute]);

  useLayoutEffect(() => {
    updateConnector();
    const rail = railRef.current;
    if (!rail) return;
    const ro = new ResizeObserver(updateConnector);
    ro.observe(rail);
    window.addEventListener("resize", updateConnector);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateConnector);
    };
  }, [updateConnector, currentRoute]);

  return (
    <div
      ref={railRef}
      className={styles.relative_2}
      role="navigation"
      aria-label="Loan application progress"
    >
      <div
        className={styles.pointer_events_none_3}
        aria-hidden
        style={{
          left: connectorGrey.left,
          width: connectorGrey.width,
          backgroundColor: connectorInactive,
        }}
      />
      <div
        className={styles.pointer_events_none_3}
        aria-hidden
        style={{
          left: connectorGreen.left,
          width: connectorGreen.width,
          backgroundColor: connectorActive,
        }}
      />

      <ol className={styles.relative_4}>
        {LOAN_APPLICATION_MILESTONES.map((milestone, index) => {
          const status = milestoneStatus(milestone.id, activeMilestone);
          return (
            <li
              key={milestone.id}
              className={styles.flex_5}
              aria-current={status === "in_progress" ? "step" : undefined}
            >
              <div
                ref={(el) => {
                  iconRefs.current[index] = el;
                }}
                className={styles.relative_6}
              >
                <MilestoneIcon status={status} theme={theme} />
              </div>
              <span
                className={cn(styles.w_full_0, status === "in_progress"
                    ? theme === "dark"
                      ? styles.font_medium_0
                      : styles.labelInk
                    : theme === "dark" ? styles.font_normal_0 : styles.font_normal_0_0)}
              >
                {milestone.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
