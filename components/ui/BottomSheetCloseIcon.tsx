"use client";

import Image from "next/image";

import closeIcon from "@/assets/Close.svg";
import styles from "./BottomSheetCloseIcon.module.scss";

/**
 * Standard close control for bottom sheet header/absolute close buttons.
 * Always use this (or this asset) so sheets stay visually consistent.
 */
export function BottomSheetCloseIcon() {
  return (
    <Image
      src={closeIcon}
      alt=""
      width={24}
      height={24}
      className={styles.icon}
      unoptimized
      aria-hidden
    />
  );
}
