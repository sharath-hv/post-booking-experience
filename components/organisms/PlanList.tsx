"use client";

import Image, { type StaticImageData } from "next/image";

import carIcon from "@/assets/Car.svg";
import identityIcon from "@/assets/Identity.svg";
import moneyRoundIcon from "@/assets/Money round.svg";
import newCarIcon from "@/assets/New car.svg";
import tickIcon from "@/assets/tick01.svg";
import { KYC_ASSETS } from "@/lib/kyc-assets";
import { IconWell } from "@/components/molecules/IconWell";
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
  /**
   * `plan` — day-one commitments (icon wells, optional “Now”).
   * `progress` — purchase-state menu timeline ([Figma 3342:18746](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=3342-18746)):
   * 32px status nodes, “In progress”, 20px stage gaps.
   */
  appearance?: "plan" | "progress";
};

/**
 * “Here's how I'll get you your car” — her commitments as a timeline:
 * icon nodes on a solid rail; live step uses the purple icon well as “Now”.
 * Purchase-state menu uses `appearance="progress"` for the Figma status rail.
 */
export function PlanList({
  items,
  variant = "default",
  showNowLabel = false,
  appearance = "plan",
}: PlanListProps) {
  const isProgress = appearance === "progress";

  return (
    <ol
      className={cn(
        styles.planList,
        isProgress && styles.planListProgress,
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
        const showIntoNowRail = isNow && showNowLabel && !isProgress;
        const showInProgressLabel = isProgress && isNow;
        const progressStatusIcon = isDone
          ? KYC_ASSETS.timelineDone
          : isNow
            ? KYC_ASSETS.timelineInProgress
            : KYC_ASSETS.timelineNext;
        const progressStatusLabel = isDone
          ? "Done"
          : isNow
            ? "In progress"
            : "Up next";

        return (
          <li
            key={item.title}
            className={cn(styles.planStep, isProgress && styles.planStepProgress)}
          >
            <span className={cn(styles.planRail, isProgress && styles.planRailProgress)}>
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
              {showInProgressLabel ? (
                <span
                  className={cn(
                    styles.planConnectorIntoProgressSpacer,
                    intoNowFromDone && styles.planConnectorIntoProgressFromDone,
                  )}
                  aria-hidden
                />
              ) : null}
              {isProgress ? (
                <span className={cn(styles.planNode, styles.planNodeProgress)}>
                  <Image
                    src={progressStatusIcon}
                    alt={progressStatusLabel}
                    width={28}
                    height={28}
                    className={styles.planProgressStatusIcon}
                    unoptimized
                  />
                </span>
              ) : (
                <IconWell
                  tone={isNow ? "purple" : isDone ? "green" : "grey"}
                  className={cn(
                    styles.planNode,
                    isNow
                      ? styles.planNodeNow
                      : isDone
                        ? styles.planNodeDone
                        : styles.planNodeTodo,
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
                </IconWell>
              )}
              {!isLast ? (
                <span
                  className={cn(
                    styles.planConnector,
                    isProgress && styles.planConnectorProgress,
                    isDone &&
                      (isProgress
                        ? styles.planConnectorFromDoneProgress
                        : styles.planConnectorFromDone),
                  )}
                  aria-hidden
                />
              ) : null}
            </span>
            <div
              className={cn(
                styles.planStepCopy,
                isNow && showNowLabel && !isProgress && styles.planStepCopyNow,
                !isLast && !isProgress && styles.planStepCopySpaced,
                !isLast && isProgress && styles.planStepCopySpacedProgress,
              )}
            >
              {isNow && showNowLabel && !isProgress ? (
                <p className={styles.planNowLabel}>Now</p>
              ) : null}
              {showInProgressLabel ? (
                <p className={styles.planInProgressLabel}>In progress</p>
              ) : null}
              <div className={styles.planTitleRow}>
                <p
                  className={cn(
                    styles.planTitle,
                    isProgress && !isNow && styles.planTitleMutedWeight,
                  )}
                >
                  {item.title}
                </p>
              </div>
              <p
                className={cn(
                  styles.planDetail,
                  isProgress && styles.planDetailProgress,
                  isDone ? styles.planDetailDone : styles.planDetailTodo,
                )}
              >
                {item.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
