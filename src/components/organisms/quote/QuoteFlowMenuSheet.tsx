"use client";

import { useCallback } from "react";

import { GhostCta } from "@/components/atoms/cta/GhostCta";
import { BottomSheetCloseIcon } from "@/components/atoms/sheet/BottomSheetCloseIcon";
import { ModalFrame } from "@/components/molecules/modal/ModalFrame";
import {
  BOTTOM_SHEET_SCROLL_BODY_CLASS,
  BOTTOM_SHEET_SCROLL_PANEL_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import {
  EXPERIENCE_FLOWS,
  type ExperienceFlow,
  type ExperienceFlowDefinition,
} from "@/helpers/experience-flow";
import { cn } from "@/utils/utils";

import styles from "./QuoteFlowMenuSheet.module.scss";

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
  const handleSelect = useCallback(
    (flow: ExperienceFlow) => {
      const definition = EXPERIENCE_FLOWS.find((item) => item.id === flow);
      if (!definition?.available) return;
      onFlowChange(flow);
      onClose();
    },
    [onClose, onFlowChange],
  );

  return (
    <ModalFrame
      open={open}
      onClose={onClose}
      showCloseButton={false}
      panelClassName={BOTTOM_SHEET_SCROLL_PANEL_CLASS}
      aria-labelledby="quote-flow-menu-title"
    >
      <header className={styles.flex_6}>
        <h2
          id="quote-flow-menu-title"
          className={styles.min_w_0_7}
        >
          Switch flows
        </h2>
        <GhostCta
          onClick={onClose}
          className={styles.cta_ghost_8}
          aria-label="Close"
        >
          <BottomSheetCloseIcon />
        </GhostCta>
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
    </ModalFrame>
  );
}
