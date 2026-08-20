"use client";

import Image from "next/image";

import uploadIcon from "@/assets/upload.svg";
import { cn } from "@/utils/utils";

import styles from "./UploadTrigger.module.scss";

export type UploadTriggerProps = {
  onClick: () => void;
  label?: string;
  className?: string;
};

/** Dashed empty-state upload control. */
export function UploadTrigger({
  onClick,
  label = "Upload file",
  className,
}: UploadTriggerProps) {
  return (
    <button type="button" onClick={onClick} className={cn(styles.trigger, className)}>
      <span className={styles.icon}>
        <Image src={uploadIcon} alt="" fill className={styles.iconImage} unoptimized sizes="24px" />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
