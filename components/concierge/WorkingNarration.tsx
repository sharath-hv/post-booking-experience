"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import warningAmberIcon from "@/assets/Warning amber.svg";

import { instantRevealEnabled } from "@/lib/concierge/instant";
import { cn } from "@/lib/utils";

/** Time each activity line stays “in progress” before ticking done (live mode). */
const LINE_ACTIVE_MS = 1500;

function SpinnerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 animate-spin text-[#6841e6] motion-reduce:animate-none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoneTickIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <circle cx="12" cy="12" r="9" fill="#0fa457" />
      <path
        d="M8.4 12.2l2.4 2.4 4.8-5"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QueuedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="#c2c2c2"
        strokeWidth="2"
        strokeDasharray="3.2 3.6"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <path
        d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
        stroke="#4B4B4B"
      />
      <path
        d="M8 5.60156V8.00156L9.2 9.20156"
        stroke="#4B4B4B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <Image
      src={warningAmberIcon}
      alt=""
      width={20}
      height={20}
      className="shrink-0"
      unoptimized
      aria-hidden
    />
  );
}

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
  /** Expectation row (clock icon) — ongoing mode, e.g. “Expect news by tomorrow morning”. */
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
        "rounded-2xl bg-white/75 card-elevated px-4 py-4 backdrop-blur-sm",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4">
        {lines.map((line, idx) => {
          if (mode === "live" && idx > activeIndex) return null;
          const done = mode === "live" ? idx < activeIndex : idx < ongoingDoneCount;
          const queued = mode === "ongoing" && idx > ongoingDoneCount;
          return (
            <div key={idx} className="kyc-stagger flex items-start gap-2.5">
              {done ? <DoneTickIcon /> : queued ? <QueuedIcon /> : <SpinnerIcon />}
              <span
                className={cn(
                  "text-sm leading-5 transition-colors duration-300",
                  done || queued ? "text-[#757575]" : "text-[#121212]"
                )}
              >
                {line}
              </span>
            </div>
          );
        })}
        {allDone && doneLabel ? (
          <div className="kyc-stagger mt-0.5 flex items-center gap-2.5 border-t border-dashed border-[#e8e8e8] pt-3">
            {doneTone === "warning" ? <WarningIcon /> : <DoneTickIcon />}
            <span
              className={cn(
                "text-sm font-medium leading-5",
                doneTone === "warning" ? "text-[#D16900]" : "text-[#0c7a42]"
              )}
            >
              {doneLabel}
            </span>
          </div>
        ) : null}
        {mode === "ongoing" && etaLabel ? (
          <div className="kyc-stagger mt-0.5 flex items-center gap-2.5 border-t border-dashed border-[#e8e8e8] pt-3">
            <ClockIcon />
            <span className="text-sm font-medium leading-5 text-[#121212]">{etaLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
