"use client";

import Image from "next/image";

import deleteIcon from "@/assets/Delete.svg";
import { IconButton } from "@/components/atoms/cta/IconButton";
import { TickBadge } from "@/components/atoms/status/TickBadge";
import { cn } from "@/utils/utils";

import styles from "./UploadFileRow.module.scss";

export type UploadFileRowProps = {
  name: string;
  onRemove: () => void;
  className?: string;
};

/** Uploaded file chip — tick, filename, delete. */
export function UploadFileRow({ name, onRemove, className }: UploadFileRowProps) {
  return (
    <div className={cn(styles.row, className)}>
      <TickBadge />
      <span className={styles.name}>{name}</span>
      <IconButton
        onClick={onRemove}
        className={styles.delete}
        aria-label={`Remove ${name}`}
      >
        <span className={styles.deleteIcon}>
          <Image src={deleteIcon} alt="" fill className={styles.deleteImage} unoptimized sizes="20px" />
        </span>
      </IconButton>
    </div>
  );
}
