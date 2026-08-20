"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

import { ShiviContentBody } from "@/components/molecules/shivi/ShiviContentBody";
import { ShiviHeader } from "@/components/molecules/shivi/ShiviHeader";
import { ShiviLeadTitle } from "@/components/molecules/shivi/ShiviLeadTitle";
import { instantRevealEnabled } from "@/lib/concierge/instant";
import { cn } from "@/utils/utils";
import styles from "./ShiviDialogue.module.scss";


/** Word cadence — aligned with the hero headlines elsewhere (speech rhythm). */
const LEAD_WORD_DELAY_MS = 120;
const BODY_WORD_DELAY_MS = 65;
/** Beat between her lines. */
const LINE_GAP_MS = 280;
/** Longer beat after the lead when something lands between her words. */
const AFTER_LEAD_SLOT_GAP_MS = 700;

export type ShiviDialogueProps = {
  /** Her lines for this turn — first line is the lead (large), rest are body. */
  lines: readonly string[];
  /** Lands between the lead and the body lines once the lead is spoken (e.g. a live receipt). */
  afterLead?: ReactNode;
  /** Continues the last body line once it has been spoken. */
  afterBody?: ReactNode;
  /** Render the final line as a section heading for the card/artifact below it. */
  headingLastLine?: boolean;
  /** Gate the reveal (e.g. wait for the user's echo chip to land). */
  startWhen?: boolean;
  /** Fires once after the last line has fully revealed. */
  onComplete?: () => void;
  className?: string;
};

/**
 * Shivi speaking — left-aligned dialogue block with her avatar.
 * Lines reveal word-by-word, one after another, like someone talking.
 * Reduced motion (or the instant-reveal demo flag) shows everything at once.
 */
export function ShiviDialogue({
  lines,
  afterLead,
  afterBody,
  headingLastLine = false,
  startWhen = true,
  onComplete,
  className,
}: ShiviDialogueProps) {
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [skipResolved, setSkipResolved] = useState(false);
  /** Number of lines currently revealing/revealed. */
  const [activeLines, setActiveLines] = useState(0);
  /** Lines fully spoken — rendered static so later copy swaps don't re-animate. */
  const [doneLines, setDoneLines] = useState(0);
  const [leadDone, setLeadDone] = useState(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setSkipAnimation(mq.matches || instantRevealEnabled());
    apply();
    setSkipResolved(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!startWhen || !skipResolved) return;
    if (skipAnimation) {
      setActiveLines(lines.length);
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }
    setActiveLines((count) => (count === 0 ? 1 : count));
  }, [startWhen, skipResolved, skipAnimation, lines.length]);

  const onLineComplete = (index: number) => {
    if (index === 0) setLeadDone(true);
    setDoneLines((count) => Math.max(count, index + 1));
    if (index < lines.length - 1) {
      const gap = index === 0 && afterLead ? AFTER_LEAD_SLOT_GAP_MS : LINE_GAP_MS;
      window.setTimeout(() => {
        setActiveLines((count) => Math.max(count, index + 2));
      }, gap);
      return;
    }
    if (!completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current?.();
    }
  };

  const slotVisible = afterLead != null && (leadDone || (skipAnimation && activeLines > 0));
  const afterBodyVisible =
    afterBody != null &&
    (skipAnimation ? activeLines >= lines.length : doneLines >= lines.length);

  return (
    <div className={cn(styles.flex_8, className)}>
      <ShiviHeader
        className={startWhen ? styles.opacity_100_10 : styles.opacity_0_11}
      />

      <div className={styles.mt_4_5}>
        {lines.map((line, idx) => {
          if (idx >= activeLines) return null;
          const isHeading = headingLastLine && idx > 0 && idx === lines.length - 1;
          const animate = !(skipAnimation || idx < doneLines);
          const lineNode =
            idx === 0 ? (
              <ShiviLeadTitle
                text={line}
                animate={animate}
                wordDelayMs={LEAD_WORD_DELAY_MS}
                onComplete={() => onLineComplete(idx)}
              />
            ) : (
              <ShiviContentBody
                text={line}
                variant={isHeading ? "heading" : "body"}
                animate={animate}
                wordDelayMs={BODY_WORD_DELAY_MS}
                onComplete={() => onLineComplete(idx)}
              />
            );
          return (
            <Fragment key={idx}>
              {lineNode}
              {idx === 0 && slotVisible ? (
                <div className={[styles.kyc_stagger_6, "kyc-stagger"].filter(Boolean).join(" ")}>{afterLead}</div>
              ) : null}
            </Fragment>
          );
        })}
        {afterBodyVisible ? <div className={[styles.kyc_stagger_7, "kyc-stagger"].filter(Boolean).join(" ")}>{afterBody}</div> : null}
      </div>
    </div>
  );
}
