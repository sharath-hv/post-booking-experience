"use client";

import { useEffect, useRef, useState } from "react";

import { StatusLine } from "@/components/molecules/status/StatusLine";
import { instantRevealEnabled } from "@/lib/concierge/instant";
import { OVERLAY_GLASS_SURFACE_CLASS } from "@/helpers/overlay-glass-card";
import { cn } from "@/utils/utils";
import styles from "./WorkingNarration.module.scss";


/** Time each activity line stays “in progress” before ticking done (live mode). */
const LINE_ACTIVE_MS = 1500;

export type WorkingNarrationMode = "live" | "ongoing";
export type WorkingNarrationDoneTone = "success" | "warning";

export type WorkingNarrationProps = {
  /** Activity lines, narrated in Shivi's voice. */
  lines: readonly string[];
  /**
   * `live` — quick system actions that genuinely finish while you watch
   * (lines tick off one by one, then `doneLabel`).
   * `ongoing` — real-world work that takes hours or days: the first line keeps
   * spinning, the rest queue up, and nothing pretends to finish. The payoff
   * belongs to the next turn, after time has passed.
   */
  mode?: WorkingNarrationMode;
  /** Summary row after every line is done — live mode only. */
  doneLabel?: string;
  /** Colour + icon for `doneLabel` — defaults to success green. */
  doneTone?: WorkingNarrationDoneTone;
  /** Expectation row (clock icon) — ongoing mode, e.g. “I'll update you as soon as I have news”. */
  etaLabel?: string;
  /** Ongoing mode — lines before this index render done (e.g. “request placed” already happened). */
  ongoingDoneCount?: number;
  /** Gate the narration start (e.g. after dialogue completes). */
  startWhen?: boolean;
  /** Fires once when the feed has nothing left to reveal. */
  onAllDone?: () => void;
  className?: string;
};

/**
 * Shivi working — activity feed for moments where she's doing things behind
 * the scenes.
 */
export function WorkingNarration({
  lines,
  mode = "live",
  doneLabel,
  doneTone = "success",
  etaLabel,
  ongoingDoneCount = 0,
  startWhen = true,
  onAllDone,
  className,
}: WorkingNarrationProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  /** Index of the currently active line; lines.length means all done (live mode). */
  const [activeIndex, setActiveIndex] = useState(-1);
  const completedRef = useRef(false);
  const onAllDoneRef = useRef(onAllDone);
  onAllDoneRef.current = onAllDone;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches || instantRevealEnabled());
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!startWhen || activeIndex >= 0) return;
    if (mode === "ongoing" || reduceMotion) {
      setActiveIndex(mode === "ongoing" ? 0 : lines.length);
      if (mode === "ongoing" && !completedRef.current) {
        completedRef.current = true;
        onAllDoneRef.current?.();
      }
      return;
    }
    setActiveIndex(0);
  }, [startWhen, reduceMotion, activeIndex, lines.length, mode]);

  useEffect(() => {
    if (mode === "ongoing") return;
    if (activeIndex < 0) return;
    if (activeIndex >= lines.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        onAllDoneRef.current?.();
      }
      return;
    }
    const id = window.setTimeout(() => {
      setActiveIndex((i) => i + 1);
    }, LINE_ACTIVE_MS);
    return () => window.clearTimeout(id);
  }, [activeIndex, lines.length, mode]);

  if (activeIndex < 0) return null;

  const allDone = mode === "live" && activeIndex >= lines.length;

  return (
    <div
      className={cn(
        styles.rounded_2xl_6,
        OVERLAY_GLASS_SURFACE_CLASS,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className={styles.flex_2}>
        {lines.map((line, idx) => {
          if (mode === "live" && idx > activeIndex) return null;
          const done = mode === "live" ? idx < activeIndex : idx < ongoingDoneCount;
          const queued = mode === "ongoing" && idx > ongoingDoneCount;
          return (
            <StatusLine
              key={idx}
              state={done ? "done" : queued ? "queued" : "loading"}
              tone={done || queued ? "muted" : "ink"}
            >
              {line}
            </StatusLine>
          );
        })}
        {allDone && doneLabel ? (
          <StatusLine
            variant="footer"
            state={doneTone === "warning" ? "warning" : "done"}
            tone={doneTone === "warning" ? "warning" : "success"}
          >
            {doneLabel}
          </StatusLine>
        ) : null}
        {mode === "ongoing" && etaLabel ? (
          <StatusLine variant="footer" state="clock" tone="eta">
            {etaLabel}
          </StatusLine>
        ) : null}
      </div>
    </div>
  );
}
