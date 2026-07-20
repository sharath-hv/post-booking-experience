"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  getKycUploadSourceOptions,
  type KycUploadSource,
} from "@/components/kyc/kyc-upload-content";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import { BOTTOM_SHEET_MAX_HEIGHT_CLASS, BOTTOM_SHEET_OVERLAY_Z_CLASS } from "@/components/ui/bottom-sheet-layout";

import chevronRightIcon from "@/assets/Chevron_right.svg";
import styles from "./KycUploadSourceBottomSheet.module.scss";


/** Parity with `ManageBookingBottomSheet` / `ShiviIntroBottomSheet`. */
const SHEET_TRANSITION_MS = 280;

/** Space from title block bottom to first option row (32px). */
const TITLE_TO_LIST_GAP_CLASS = styles.titleToListGap;

type UploadSourceRowProps = {
  label: string;
  iconSrc: string | import("next/image").StaticImageData;
  onClick: () => void;
};

function UploadSourceRow({ label, iconSrc, onClick }: UploadSourceRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.flex_0}
    >
      <span className={styles.flex_1}>
        <span className={styles.relative_2}>
          <Image src={iconSrc} alt="" fill className={styles.object_contain_3} unoptimized sizes="20px" />
        </span>
      </span>
      <span className={styles.min_w_0_4}>{label}</span>
      <span className={styles.relative_5}>
        <Image
          src={chevronRightIcon}
          alt=""
          fill
          className={styles.object_contain_3}
          unoptimized
          sizes="20px"
        />
      </span>
    </button>
  );
}

export type KycUploadSourceBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (source: KycUploadSource) => void;
  /** Loan application omits DigiLocker. */
  includeDigilocker?: boolean;
};

/**
 * Upload source picker — Figma Post-booking-experience / node 2503:11058.
 */
export function KycUploadSourceBottomSheet({
  open,
  onClose,
  onSelect,
  includeDigilocker = true,
}: KycUploadSourceBottomSheetProps) {
  const sourceOptions = getKycUploadSourceOptions(includeDigilocker);
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
    (source: KycUploadSource) => {
      onSelect(source);
      onClose();
    },
    [onClose, onSelect],
  );

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={cn(styles.fixed_0, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
      <button
        type="button"
        className={cn(styles.absolute_1, animateIn ? styles.opacity_100_1 : styles.opacity_0_1)}
        onClick={onClose}
        aria-label="Dismiss"
      />
      <div
        className={cn(styles.absolute_2, BOTTOM_SHEET_MAX_HEIGHT_CLASS, styles.w_full_2, "sheet-elevated", animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kyc-upload-source-title"
      >
        <div
          className={cn(styles.flex_3, TITLE_TO_LIST_GAP_CLASS, styles.px_5_3)}
        >
          <div className={styles.flex_6}>
            <h2
              id="kyc-upload-source-title"
              className={styles.min_w_0_7}
            >
              How do you want to upload?
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={[styles.cta_ghost_8, "cta-ghost"].filter(Boolean).join(" ")}
              aria-label="Close"
            >
              <BottomSheetCloseIcon />
            </button>
          </div>

          <div className={styles.flex_9}>
            {sourceOptions.map((option, index) => (
              <div key={option.id}>
                {index > 0 ? (
                  <hr className={styles.my_5_10} />
                ) : null}
                <UploadSourceRow
                  label={option.label}
                  iconSrc={option.iconSrc}
                  onClick={() => handleSelect(option.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </BottomSheetPortal>
  );
}
