"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import styles from "./QuoteFlowMenuSheet.module.scss";

import {
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
  BOTTOM_SHEET_SCROLL_BODY_CLASS,
  BOTTOM_SHEET_SCROLL_PANEL_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import {
  EXPERIENCE_FLOWS,
  type ExperienceFlow,
  type ExperienceFlowDefinition,
} from "@/lib/experience-flow";

const SHEET_TRANSITION_MS = 280;

type FlowOptionRowProps = {
  flow: ExperienceFlowDefinition;
  selected: boolean;
  onSelect: (flow: ExperienceFlow) => void;
};

function FlowOptionRow({ flow, selected, onSelect }: FlowOptionRowProps) {
  const disabled = !flow.available;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(flow.id)}
      className={cn(styles.flex_0, disabled ? styles.cursor_not_allowed_0 : styles.cursor_pointer_0, selected ? styles.bg_f5f5f5__0 : "")}
      aria-pressed={selected}
    >
      <span
        className={cn(styles.mt_0_5_1, selected ? styles.border_121212__1 : styles.border_c4c4c4__1)}
        aria-hidden
      >
        {selected ? <span className={styles.h_2_0} /> : null}
      </span>
      <span className={styles.min_w_0_1}>
        <span className={styles.flex_2}>
          <span className={styles.text_sm_3}>{flow.label}</span>
          {disabled ? (
            <span className={styles.rounded_full_4}>
              Coming soon
            </span>
          ) : null}
        </span>
        <span className={styles.mt_1_5}>{flow.description}</span>
      </span>
    </button>
  );
}

export type QuoteFlowMenuSheetProps = {
  open: boolean;
  activeFlow: ExperienceFlow;
  onClose: () => void;
  onFlowChange: (flow: ExperienceFlow) => void;
};

/**
 * Switch between product experience flows (Express / Standard / Verification failed / Modify flows).
 */
export function QuoteFlowMenuSheet({
  open,
  activeFlow,
  onClose,
  onFlowChange,
}: QuoteFlowMenuSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setMounted(true);
    setAnimateIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return;
    setAnimateIn(false);
    exitTimeoutRef.current = setTimeout(() => {
      exitTimeoutRef.current = null;
      setMounted(false);
    }, SHEET_TRANSITION_MS);
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  const handleSelect = useCallback(
    (flow: ExperienceFlow) => {
      const definition = EXPERIENCE_FLOWS.find((item) => item.id === flow);
      if (!definition?.available) return;
      onFlowChange(flow);
      onClose();
    },
    [onClose, onFlowChange],
  );

  if (!mounted) return null;

  return (
    <div className={cn(styles.fixed_2, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
      <button
        type="button"
        className={cn(styles.absolute_3, animateIn ? styles.opacity_100_3 : styles.opacity_0_3)}
        onClick={onClose}
        aria-label="Dismiss"
      />
      <div
        className={cn(styles.absolute_4, BOTTOM_SHEET_MAX_HEIGHT_CLASS, styles.w_full_4, BOTTOM_SHEET_SCROLL_PANEL_CLASS, styles.rounded_t_24px__4, "sheet-elevated", animateIn ? styles.translate_y_0_4 : styles.translate_y_full_4)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-flow-menu-title"
      >
        <header className={styles.flex_6}>
          <h2
            id="quote-flow-menu-title"
            className={styles.min_w_0_7}
          >
            Switch flows
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={[styles.cta_ghost_8, "cta-ghost"].filter(Boolean).join(" ")}
            aria-label="Close"
          >
            <BottomSheetCloseIcon />
          </button>
        </header>

        <div className={cn(BOTTOM_SHEET_SCROLL_BODY_CLASS, styles.px_5_5)}>
          <div className={styles.flex_9}>
          {EXPERIENCE_FLOWS.map((flow) => (
            <FlowOptionRow
              key={flow.id}
              flow={flow}
              selected={activeFlow === flow.id}
              onSelect={handleSelect}
            />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
