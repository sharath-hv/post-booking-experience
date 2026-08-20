"use client";

import Image from "next/image";
import { useCallback } from "react";

import shiviAvatar from "@/assets/Shivi image.png";
import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { ShiviIntroCoachmark } from "@/components/organisms/kyc/ShiviIntroCoachmark";
import { BottomSheetPortal } from "@/components/atoms/sheet/BottomSheetPortal";
import {
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { useBottomSheetPresence } from "@/hooks/use-bottom-sheet-presence";
import { cn } from "@/utils/utils";

import styles from "./ShiviIntroBottomSheet.module.scss";

const USER_NAME = "Sharath";

export type ShiviIntroBottomSheetProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Shivi RM intro — [Figma 2479:7600](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2479-7600).
 *
 * Uses `useBottomSheetPresence` (not `BottomSheetShell`) because the coachmark
 * must sit as a sibling of the panel inside the overlay, and the scrim is
 * non-dismissible (no close control — only the CTA).
 */
export function ShiviIntroBottomSheet({ open, onClose }: ShiviIntroBottomSheetProps) {
  const { mounted, animateIn } = useBottomSheetPresence(open);

  const onGotIt = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={cn(styles.fixed_0, BOTTOM_SHEET_OVERLAY_Z_CLASS, styles.flex_0_0)}>
        <div
          className={cn(styles.absolute_1, animateIn ? styles.opacity_100_1 : styles.opacity_0_1)}
          aria-hidden
        />
        {animateIn ? <ShiviIntroCoachmark /> : null}
        <div
          className={cn(styles.relative_2, "sheet-elevated", animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shivi-intro-sheet-title"
        >
          <div className={styles.flex_0}>
            <div className={styles.relative_1}>
              <Image
                src={shiviAvatar}
                alt=""
                fill
                className={styles.object_cover_2}
                unoptimized
                sizes="64px"
                priority
              />
            </div>

            <h2
              id="shivi-intro-sheet-title"
              className={styles.mt_6_3}
            >
              Hi {USER_NAME},
            </h2>
            <p className={styles.mt_2_4}>
              Meet Shivi, your relationship manager. She will guide you through every step and is
              always available if you need help.
            </p>

            <PrimaryCta
              className={styles.primary_cta_5}
              onClick={onGotIt}
            >
              Got it
            </PrimaryCta>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
