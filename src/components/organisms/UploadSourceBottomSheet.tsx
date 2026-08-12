"use client";

import Image from "next/image";
import { useCallback } from "react";

import arrowRightIcon from "@/assets/Arrow_right.svg";
import { BottomSheetCloseIcon } from "@/components/atoms/BottomSheetCloseIcon";
import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
import { IconWell } from "@/components/molecules/IconWell";
import {
  getKycUploadSourceOptions,
  type KycUploadSource,
} from "@/constants/kyc-upload-content";
import { cn } from "@/utils/utils";

import styles from "./UploadSourceBottomSheet.module.scss";

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
      <IconWell aria-hidden>
        <span className={styles.relative_2}>
          <Image src={iconSrc} alt="" fill className={styles.object_contain_3} unoptimized sizes="20px" />
        </span>
      </IconWell>
      <span className={styles.min_w_0_4}>{label}</span>
      <span className={styles.relative_5}>
        <Image
          src={arrowRightIcon}
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

export type UploadSourceBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (source: KycUploadSource) => void;
  /** Loan application omits DigiLocker. */
  includeDigilocker?: boolean;
};

/**
 * Upload source picker — Figma Post-booking-experience / node 2503:11058.
 */
export function UploadSourceBottomSheet({
  open,
  onClose,
  onSelect,
  includeDigilocker = true,
}: UploadSourceBottomSheetProps) {
  const sourceOptions = getKycUploadSourceOptions(includeDigilocker);

  const handleSelect = useCallback(
    (source: KycUploadSource) => {
      onSelect(source);
      onClose();
    },
    [onClose, onSelect],
  );

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      showCloseButton={false}
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
    </BottomSheetShell>
  );
}
