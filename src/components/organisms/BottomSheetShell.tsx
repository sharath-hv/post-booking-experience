"use client";

import type { ReactNode } from "react";

import { BottomSheetCloseIcon } from "@/components/atoms/sheet/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/atoms/sheet/BottomSheetPortal";
import {
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { cn } from "@/utils/utils";

import styles from "./BottomSheetShell.module.scss";
import { useBottomSheetPresence } from "@/hooks/use-bottom-sheet-presence";

export { BOTTOM_SHEET_TRANSITION_MS, useBottomSheetPresence } from "@/hooks/use-bottom-sheet-presence";

export type BottomSheetShellProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Applied to the white dialog panel. */
  panelClassName?: string;
  /** Cap panel at 90dvh. Default true. */
  constrainHeight?: boolean;
  /**
   * Absolute top-right close control.
   * Set false when the sheet renders its own close in a header row.
   */
  showCloseButton?: boolean;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

/**
 * Shared bottom-sheet chrome: body portal, dim scrim, slide-up panel, optional close.
 * Feature sheets supply body + CTA content as children.
 */
export function BottomSheetShell({
  open,
  onClose,
  children,
  panelClassName,
  constrainHeight = true,
  showCloseButton = true,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: BottomSheetShellProps) {
  const { mounted, animateIn } = useBottomSheetPresence(open);

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={cn(styles.overlay, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
        <button
          type="button"
          className={cn(styles.scrim, animateIn ? styles.scrimVisible : styles.scrimHidden)}
          onClick={onClose}
          aria-label="Dismiss"
        />
        <div
          className={cn(
            styles.panel,
            constrainHeight && BOTTOM_SHEET_MAX_HEIGHT_CLASS,
            "sheet-elevated",
            animateIn ? styles.panelShown : styles.panelHidden,
            panelClassName,
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <div className={styles.panelInner}>
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                className={cn(styles.closeAbsolute, "cta-ghost")}
                aria-label="Close"
              >
                <BottomSheetCloseIcon />
              </button>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
