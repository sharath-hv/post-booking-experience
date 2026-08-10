"use client";

import Image, { type StaticImageData } from "next/image";

import carIcon from "@/assets/Car.svg";
import identityIcon from "@/assets/Identity.svg";
import moneyRoundIcon from "@/assets/Money round.svg";
import newCarIcon from "@/assets/New car.svg";
import tickIcon from "@/assets/tick01.svg";
import { cn } from "@/lib/utils";
import { OVERLAY_GLASS_SURFACE_CLASS } from "@/lib/overlay-glass-card";
import styles from "./PlanList.module.scss";

export type PlanTimelineIcon = "documents" | "car" | "money" | "delivery";

export type PlanItem = {
  icon: PlanTimelineIcon;
  title: string;
  detail: string;
  /** Step state — defaults to first=now, rest=todo (the day-one plan). */
  status?: "done" | "now" | "todo";
};

const PLAN_ICON_ASSETS: Partial<Record<PlanTimelineIcon, StaticImageData>> = {
  documents: identityIcon,
  car: carIcon,
  money: moneyRoundIcon,
  delivery: newCarIcon,
};

function PlanTimelineGlyph({ name, className }: { name: PlanTimelineIcon; className?: string }) {
  const asset = PLAN_ICON_ASSETS[name];
  if (!asset) return null;
  return (
    <Image
      src={asset}
      alt=""
      width={20}
      height={20}
      className={cn(styles.shrink_0_16, className)}
      unoptimized
      aria-hidden
    />
  );
}

export type PlanListProps = {
  items: readonly PlanItem[];
  /** `glass` — frosted gradient surface used on the manage-booking overlay. */
  variant?: "default" | "glass";
  /**
   * Show the “Now” eyebrow on the live step.
   * Only the arrival “next few days” timeline opts in; progress overlays omit it.
   */
  showNowLabel?: boolean;
};

/**
 * “Here's how I'll get you your car” — her commitments as a timeline:
 * icon nodes on a solid rail; live step uses the purple icon well as “Now”.
 */
export function PlanList({
  items,
  variant = "default",
  showNowLabel = false,
}: PlanListProps) {
  return (
    <ol
      className={cn(
        styles.planList,
        "card-elevated",
        variant === "glass" ? OVERLAY_GLASS_SURFACE_CLASS : styles.planListSolid
      )}
    >
      {items.map((item, idx) => {
        const status = item.status ?? (idx === 0 ? "now" : "todo");
        const isNow = status === "now";
        const isDone = status === "done";
        const isLast = idx === items.length - 1;
        const prevStatus =
          idx > 0
            ? (items[idx - 1]!.status ?? (idx - 1 === 0 ? "now" : "todo"))
            : null;
        // Only when the “Now” eyebrow is shown: offset the node under that label.
        // Without the label, keep the node top-aligned with title/detail like done/todo.
        const intoNowFromDone = isNow && prevStatus === "done";
        const showIntoNowRail = isNow && showNowLabel;
        return (
          <li key={item.title} className={styles.planStep}>
            <span className={styles.planRail}>
              {showIntoNowRail ? (
                <span
                  className={cn(
                    styles.planConnector,
                    intoNowFromDone
                      ? styles.planConnectorIntoNow
                      : styles.planConnectorIntoNowSpacer,
                  )}
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  styles.planNode,
                  isNow
                    ? ["icon-well-surface-purple", styles.planNodeNow]
                    : isDone
                      ? ["icon-well-surface-green", styles.planNodeDone]
                      : ["icon-well-surface", styles.planNodeTodo]
                )}
              >
                {isDone ? (
                  <Image
                    src={tickIcon}
                    alt=""
                    width={20}
                    height={20}
                    className={styles.planNodeTick}
                    unoptimized
                    aria-hidden
                  />
                ) : (
                  <PlanTimelineGlyph
                    name={item.icon}
                    className={isNow ? styles.planGlyphOnNow : undefined}
                  />
                )}
              </span>
              {!isLast ? (
                <span
                  className={cn(
                    styles.planConnector,
                    isDone && styles.planConnectorFromDone,
                  )}
                  aria-hidden
                />
              ) : null}
            </span>
            <div
              className={cn(
                styles.planStepCopy,
                isNow && showNowLabel && styles.planStepCopyNow,
                !isLast && styles.planStepCopySpaced
              )}
            >
              {isNow && showNowLabel ? <p className={styles.planNowLabel}>Now</p> : null}
              <div className={styles.planTitleRow}>
                <p className={styles.planTitle}>{item.title}</p>
              </div>
              <p className={cn(styles.planDetail, isDone ? styles.planDetailDone : styles.planDetailTodo)}>
                {item.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
