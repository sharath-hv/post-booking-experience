"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useId } from "react";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { ModalFrame } from "@/components/molecules/modal/ModalFrame";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { BottomSheetConfirmBulletList } from "@/components/molecules/BottomSheetConfirmBulletList";
import type { BottomSheetConfirmBulletPoint } from "@/constants/bottom-sheet-confirm-bullet";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { cn } from "@/utils/utils";

import styles from "./ModifySelectionConfirmBottomSheet.module.scss";

type ModifySelectionConfirmBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  header: string;
  points: readonly BottomSheetConfirmBulletPoint[];
  iconSrc: StaticImageData | string;
  confirmCtaLabel: string;
};

/**
 * Modify booking — confirm before continuing to colour / variant / car flow.
 * Layout + bullet spacing aligned with payment/choose confirm sheets.
 */
export function ModifySelectionConfirmBottomSheet({
  open,
  onClose,
  onConfirm,
  header,
  points,
  iconSrc,
  confirmCtaLabel,
}: ModifySelectionConfirmBottomSheetProps) {
  const titleId = useId();
  const listId = useId();

  const { loading, start, reset } = useCtaNavigation();

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleConfirm = useCallback(() => {
    start(onConfirm);
  }, [onConfirm, start]);

  return (
    <ModalFrame
      open={open}
      onClose={loading ? () => {} : onClose}
      aria-labelledby={titleId}
      aria-describedby={listId}
    >
      <div className={cn(styles.body, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
        <div className={styles.illustration} aria-hidden>
          <Image
            src={iconSrc}
            alt=""
            width={72}
            height={72}
            className={styles.illustrationImg}
            unoptimized
            sizes="72px"
          />
        </div>

        <h2
          id={titleId}
          className={cn(styles.title, bottomSheetTitleWidthWithIllustration)}
        >
          {header}
        </h2>

        <BottomSheetConfirmBulletList id={listId} points={points} />
      </div>

      <div className={cn(styles.footer, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
        <PrimaryCta
          onClick={handleConfirm}
          loading={loading}
          className={styles.cta}
        >
          {confirmCtaLabel}
        </PrimaryCta>
      </div>
    </ModalFrame>
  );
}
