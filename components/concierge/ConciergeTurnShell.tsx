"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import phoneIcon from "@/assets/Phone.svg";

import { ConciergeReplies, type ConciergeReply } from "@/components/concierge/ConciergeReplies";
import {
  ManageBookingZoomOverlay,
  ZOOM_OVERLAY_MS,
} from "@/components/concierge/ManageBookingZoomOverlay";
import { ShiviCallSheet } from "@/components/concierge/ShiviCallSheet";
import { ShiviDialogue } from "@/components/concierge/ShiviDialogue";
import { TimeSkipChip } from "@/components/concierge/TimeSkipChip";
import { UserEchoChip } from "@/components/concierge/UserEchoChip";
import {
  WorkingNarration,
  type WorkingNarrationDoneTone,
  type WorkingNarrationMode,
} from "@/components/concierge/WorkingNarration";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import { AuroraLightLayer } from "@/components/ui/aurora-light-layer";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import { consumeConciergeEcho } from "@/lib/concierge/echo";
import { instantRevealEnabled } from "@/lib/concierge/instant";
import { readExperienceFlow } from "@/lib/experience-flow";
import { getDeliveryDateShort } from "@/lib/journey-stage";
import { cn } from "@/lib/utils";
import styles from "./ConciergeTurnShell.module.scss";


/** Pause after the echo chip lands before Shivi starts talking. */
const ECHO_TO_DIALOGUE_MS = 550;
/** Pause after dialogue before the artifact / working feed appears. */
const DIALOGUE_TO_CONTENT_MS = 220;

export type ConciergeTurn = {
  /** Conversation date divider — e.g. “Day 2 · Tuesday”. */
  dayStamp?: string;
  /** Rendered between the echo chip and Shivi’s words (e.g. a tab switcher). */
  beforeDialogue?: ReactNode;
  /** Shivi's lines, in speaking order. */
  says: readonly string[];
  /** Lands between her lead line and the rest — the live event she's narrating (e.g. a payment settling). */
  afterLead?: ReactNode;
  /** Continues the last body line — same voice, left-aligned (e.g. banking partner row). */
  afterBody?: ReactNode;
  /** Render her final line as a section heading for the artifact/card below it. */
  headingLastLine?: boolean;
  /** What she hands you — card(s) below her words. */
  artifact?: ReactNode;
  /** Render the working narration above the artifact instead of below it (e.g. a status card ahead of the car card). */
  workingBeforeArtifact?: boolean;
  /** Her visible activity for working turns. */
  working?: {
    lines: readonly string[];
    /** `ongoing` for real-world waits that must not pretend to finish in-session. */
    mode?: WorkingNarrationMode;
    doneLabel?: string;
    doneTone?: WorkingNarrationDoneTone;
    etaLabel?: string;
    /** Ongoing mode — lines before this index render done. */
    doneCount?: number;
    /** Fires once when live working finishes (after the footer unlocks). */
    onAllDone?: () => void;
  };
  /** Your reply affordances (fixed footer). */
  replies?: readonly ConciergeReply[];
  /** Demo time travel to the next turn (fixed footer, below replies). */
  timeSkip?: {
    label: string;
    href?: string;
    /** Same-page advance when the next beat stays on this turn. */
    onSelect?: () => void;
    onBeforeNavigate?: () => void;
  };
  /**
   * Alternate demo branch(es) under the time skip — e.g. failure or
   * “bank needs more docs”. Pass one object or a list.
   */
  altTimeSkip?: { label: string; href: string } | readonly { label: string; href: string }[];
  /** Orange commitment line above the footer (deadlines, expectations). */
  footnote?: ReactNode;
  /** Semibold prefix for the footnote card. */
  footnoteLead?: string;
  /** Render the footnote inline after the turn's content instead of fixed above the CTA. */
  footnoteInline?: boolean;
  /**
   * Who the delivery date is waiting on this turn — drives the date pill's dot.
   * Defaults to `you` when the turn has replies (user action), else `shivi`.
   */
  dateHolder?: "you" | "shivi";
  /** Contextual “talk to her” affordance — quiet button under the replies. */
  callLabel?: string;
  /** Extra quiet control under the replies (e.g. delivery-timeline sheet trigger). */
  footerExtra?: ReactNode;
};

export type ConciergeTurnShellProps = ConciergeTurn & {
  /** Fires once when the post-dialogue content reveals — e.g. to settle a live lead card. */
  onContentShown?: () => void;
  /** Hide the back chevron on moments that shouldn't rewind (e.g. arrival). */
  hideBack?: boolean;
  /** Nav menu opening the manage sheet (change selection / cancel entry points). */
  showMenu?: boolean;
  /** Manage sheet — show engine/chassis rows post-allocation. */
  manageShowVehicleIdentification?: boolean;
  children?: ReactNode;
};

/**
 * Recede transition shared by the page layers when the manage overlay is up.
 * `scale` and `filter` must be named in the transition list explicitly.
 */
const RECEDE_TRANSITION =
  styles.transition_scale_filter__0;
/**
 * Layer-promotion hint, applied ONLY while the manage layer is up. Left on
 * permanently, `will-change: filter` keeps the whole page in a rasterized
 * composited layer — iOS Safari quantizes the subtle card shadows there.
 */
const RECEDE_WILL_CHANGE = styles.will_change_scale_filter_1;
const RECEDE_ACTIVE = styles.pointer_events_none_2;

/**
 * Presentation state for the manage layer. The overlay mounts first (its
 * layout and image decode happen while everything is still), then one frame
 * later both layers start animating on the same clock — mounting and
 * animating in the same frame is what made the transition stutter.
 */
function useManageLayer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Two frames so the overlay's first paint lands before the animation
      // starts; the timeout covers hidden/throttled tabs where rAF stalls.
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setShown(true));
      });
      const fallback = setTimeout(() => setShown(true), 80);
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        clearTimeout(fallback);
      };
    }
    setShown(false);
    // Unmount only after the exit transition truly finishes — removing the
    // element while opacity still has a tail reads as a pop.
    const timeout = setTimeout(() => setMounted(false), ZOOM_OVERLAY_MS + 150);
    return () => clearTimeout(timeout);
  }, [open]);

  return { open, setOpen, mounted, shown };
}

/** Amber = waiting on you; green = on track. Same rule as the manage-layer chip. */
function resolveTurnDateHolder(
  dateHolder: "you" | "shivi" | undefined,
  replies: readonly unknown[] | undefined,
): "you" | "shivi" {
  return dateHolder ?? (replies?.length ? "you" : "shivi");
}

/**
 * The living delivery date — always visible, always honest about who holds it:
 * amber dot when the turn waits on the user, green when Shivi's working.
 * Tap opens the purchase-state layer where the full story lives.
 */
function DeliveryDatePill({
  holder,
  onClick,
}: {
  holder: "you" | "shivi";
  onClick: () => void;
}) {
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    setDate(getDeliveryDateShort(readExperienceFlow()));
  }, []);

  if (!date) return null;

  const statusPhrase = holder === "you" ? "Waiting on you" : "On track";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Car arrives ${date}. ${statusPhrase}. View purchase status.`}
      className={[styles.concierge_echo_in_0, "concierge-echo-in"].filter(Boolean).join(" ")}
    >
      <span aria-hidden className={styles.relative_1}>
        {holder === "you" ? (
          <span
            className={styles.absolute_2}
            aria-hidden
          />
        ) : null}
        <span
          className={cn(
            styles.relative_21,
            holder === "you" ? styles.bg_d99a23__23 : styles.bg_0fa457__24
          )}
        />
      </span>
      <span className={styles.text_757575__3}>Arrives</span>
      <span className={styles._ml_0_5_4}>{date}</span>
    </button>
  );
}

/**
 * Menu pill — opens the manage layer and morphs hamburger → × with a
 * label crossfade ("Menu" ↔ "Close") using the same spring easing as the
 * rest of the concierge shell.
 */
function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={open ? "Close" : "Menu"}
      aria-expanded={open}
      onClick={onClick}
      className={styles.pointer_events_auto_5}
    >
      {/* Icon container — hamburger and × are stacked and crossfade */}
      <span className={styles.relative_6} aria-hidden>
        {/* Hamburger lines — rotates away when open */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={cn(
            styles.absolute_3,
            open ? styles.rotate_90_0 : styles.rotate_0_1
          )}
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        {/* Close × — unwinds from −90° when open */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            styles.absolute_4,
            open ? styles.rotate_0_2 : styles._rotate_90_3
          )}
        >
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </svg>
      </span>

      {/* Label — "Menu" slides up out, "Close" slides up in */}
      <span className={styles.relative_7}>
        <span
          className={cn(
            styles.block_5,
            open ? styles.menuLabelHidden : styles.menuLabelVisible
          )}
        >
          Menu
        </span>
        <span
          className={cn(
            styles.absolute_6,
            open ? styles.menuLabelVisible : styles.menuLabelExit
          )}
        >
          Close
        </span>
      </span>
    </button>
  );
}

/**
 * One turn of the concierge conversation — the page grammar:
 * your last words land (echo) → Shivi speaks → she hands you something
 * (artifact) or visibly works → you reply / time passes.
 */
export function ConciergeTurnShell({
  dayStamp,
  beforeDialogue,
  says,
  afterLead,
  afterBody,
  headingLastLine,
  artifact,
  workingBeforeArtifact = false,
  working,
  replies,
  timeSkip,
  altTimeSkip,
  footnote,
  footnoteLead,
  footnoteInline = false,
  dateHolder,
  callLabel,
  footerExtra,
  onContentShown,
  hideBack = false,
  showMenu = true,
  manageShowVehicleIdentification,
  children,
}: ConciergeTurnShellProps) {
  const [echo, setEcho] = useState<string | null>(null);
  const manage = useManageLayer();
  const [callSheetOpen, setCallSheetOpen] = useState(false);
  const [dialogueStarted, setDialogueStarted] = useState(false);
  const [dialogueDone, setDialogueDone] = useState(false);
  const [contentShown, setContentShown] = useState(false);
  const [ready, setReady] = useState(false);

  /** Consume the echo once on mount, then begin the turn. */
  useEffect(() => {
    const pending = consumeConciergeEcho();
    setEcho(pending);
    if (pending == null || instantRevealEnabled()) {
      setDialogueStarted(true);
      return;
    }
    const id = window.setTimeout(() => setDialogueStarted(true), ECHO_TO_DIALOGUE_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!dialogueDone) return;
    if (instantRevealEnabled()) {
      setContentShown(true);
      return;
    }
    const id = window.setTimeout(() => setContentShown(true), DIALOGUE_TO_CONTENT_MS);
    return () => window.clearTimeout(id);
  }, [dialogueDone]);

  /** Footer becomes available when the turn has nothing left to reveal. */
  useEffect(() => {
    if (!contentShown) return;
    if (working) return; // WorkingNarration flips `ready` via onAllDone
    setReady(true);
  }, [contentShown, working]);

  const onContentShownRef = useRef(onContentShown);
  onContentShownRef.current = onContentShown;
  useEffect(() => {
    if (!contentShown) return;
    onContentShownRef.current?.();
  }, [contentShown]);

  const altTimeSkips = altTimeSkip
    ? Array.isArray(altTimeSkip)
      ? altTimeSkip
      : [altTimeSkip]
    : [];

  const hasFooter = Boolean(
    replies?.length || timeSkip || altTimeSkips.length || footnote || callLabel || footerExtra,
  );

  const turnDateHolder = resolveTurnDateHolder(dateHolder, replies);

  /** Room for the fixed footer — taller when footnote + CTA + call link stack. */
  const mainBottomPad = !hasFooter
    ? styles.pb_16_7
    : footnote && !footnoteInline && replies?.length && callLabel
      ? styles.pbDeepFooter
      : styles.pb_calc_12rem_env_safe_a_8;

  return (
    <div className={styles.relative_8}>
      <AuroraLightLayer />

      {/* Floats above both layers; morphs expand → close while the manage layer is up. */}
      {showMenu ? (
        <div className={styles.pointer_events_none_9}>
          <div className={styles.mx_auto_10}>
            <DeliveryDatePill
              holder={turnDateHolder}
              onClick={() => manage.setOpen(true)}
            />
            <MenuButton open={manage.open} onClick={() => manage.setOpen((v) => !v)} />
          </div>
        </div>
      ) : null}

      {/* Page layer — recedes into depth while the manage layer is up. */}
      <div
        className={cn(
          RECEDE_TRANSITION,
          manage.mounted && RECEDE_WILL_CHANGE,
          manage.shown && RECEDE_ACTIVE
        )}
        aria-hidden={manage.open || undefined}
        inert={manage.open || undefined}
      >
      <KycTopNavHeader
        transparent
        className={hideBack ? styles._div_first_of_type_butto_9 : undefined}
      />

      <main
        className={cn(
          styles.relative_25,
          mainBottomPad
        )}
      >
        {dayStamp ? (
          <div className={styles.mb_5_11} aria-hidden>
            <span className={styles.h_px_12} />
            <span className={styles.text_11px__13}>
              {dayStamp}
            </span>
            <span className={styles.h_px_12} />
          </div>
        ) : null}

        {echo ? <UserEchoChip text={echo} className={styles.mb_6_14} /> : null}

        {beforeDialogue ? <div className={styles.mb_6_14}>{beforeDialogue}</div> : null}

        <ShiviDialogue
          lines={says}
          afterLead={afterLead}
          afterBody={afterBody}
          headingLastLine={headingLastLine}
          startWhen={dialogueStarted}
          onComplete={() => setDialogueDone(true)}
        />

        {(() => {
          const artifactBlock =
            contentShown && (artifact || children) ? (
              <div
                className={cn(
                  styles.kyc_stagger_26, "kyc-stagger",
                  headingLastLine ? styles.mt_4_27 : workingBeforeArtifact ? styles.mt_5_28 : styles.mt_8_29
                )}
              >
                {artifact}
                {children}
              </div>
            ) : null;

          const workingBlock =
            working || (footnote && footnoteInline && ready) ? (
              <div className={styles.mt_8_15}>
                {working ? (
                  <WorkingNarration
                    lines={working.lines}
                    mode={working.mode}
                    doneLabel={working.doneLabel}
                    doneTone={working.doneTone}
                    etaLabel={working.etaLabel}
                    ongoingDoneCount={working.doneCount}
                    startWhen={contentShown}
                    onAllDone={() => {
                      setReady(true);
                      working.onAllDone?.();
                    }}
                  />
                ) : null}
                {footnote && footnoteInline && ready ? (
                  <div className={[styles.kyc_stagger_16, "kyc-stagger"].filter(Boolean).join(" ")}>
                    {typeof footnote === "string" ? (
                      <ShimmerInfoCard icon="info" lead={footnoteLead}>
                        {footnote}
                      </ShimmerInfoCard>
                    ) : (
                      footnote
                    )}
                  </div>
                ) : null}
              </div>
            ) : null;

          return workingBeforeArtifact ? (
            <>
              {workingBlock}
              {artifactBlock}
            </>
          ) : (
            <>
              {artifactBlock}
              {workingBlock}
            </>
          );
        })()}
      </main>
      </div>

      {hasFooter ? (
        <div
          className={cn(
            styles.fixed_30,
            RECEDE_TRANSITION,
            manage.mounted && RECEDE_WILL_CHANGE,
            ready ? styles.opacity_100_31 : styles.pointer_events_none_32,
            manage.shown && RECEDE_ACTIVE
          )}
        >
          <div className={styles.mx_auto_17}>
            {footnote && !footnoteInline ? (
              <div className={styles.mb_3_18}>
                {typeof footnote === "string" ? (
                  <ShimmerInfoCard icon="info" lead={footnoteLead}>
                    {footnote}
                  </ShimmerInfoCard>
                ) : (
                  footnote
                )}
              </div>
            ) : null}
            {replies?.length ? <ConciergeReplies replies={replies} /> : null}
            {callLabel ? (
              <button
                type="button"
                onClick={() => setCallSheetOpen(true)}
                className={cn(
                  styles.flex_33,
                  replies?.length ? styles.mt_3_34 : undefined
                )}
              >
                <Image src={phoneIcon} alt="" width={20} height={20} className={styles.shrink_0_19} unoptimized aria-hidden />
                {callLabel}
              </button>
            ) : null}
            {footerExtra ? (
              <div className={cn(styles.flex_35, replies?.length || callLabel ? styles.mt_2_20 : undefined)}>
                {footerExtra}
              </div>
            ) : null}
            {timeSkip ? (
              <TimeSkipChip
                label={timeSkip.label}
                href={timeSkip.href}
                onSelect={timeSkip.onSelect}
                onBeforeNavigate={timeSkip.onBeforeNavigate}
                className={replies?.length || callLabel ? styles.mt_4_10 : undefined}
              />
            ) : null}
            {altTimeSkips.map((skip) => (
              <TimeSkipChip
                key={`${skip.label}-${skip.href}`}
                label={skip.label}
                href={skip.href}
                className={styles.mt_2_20}
              />
            ))}
          </div>
        </div>
      ) : null}

      {showMenu ? (
        <ManageBookingZoomOverlay
          mounted={manage.mounted}
          shown={manage.shown}
          onClose={() => manage.setOpen(false)}
          showVehicleIdentification={manageShowVehicleIdentification}
          dateHolder={turnDateHolder}
        />
      ) : null}
      {callLabel ? (
        <ShiviCallSheet open={callSheetOpen} onClose={() => setCallSheetOpen(false)} />
      ) : null}
    </div>
  );
}
