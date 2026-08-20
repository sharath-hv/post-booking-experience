"use client";

import Image from "next/image";
import type { KeyboardEvent, MouseEvent } from "react";

import closeIcon from "@/assets/Close.svg";
import { cn } from "@/utils/utils";

import styles from "./Chip.module.scss";

export type ChipProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
  /** Filter chips — clear control when selected. */
  onClear?: () => void;
  /** `filter` = 28px pill. `segment` = loan-application employment/tenure. */
  variant?: "filter" | "segment";
  /** Segment height. Ignored for filter. */
  size?: "employment" | "tenure";
  className?: string;
};

/** Selectable chip. Filter (pill) or segment (form) variants match existing screens. */
export function Chip({
  label,
  selected,
  onSelect,
  onClear,
  variant = "filter",
  size = "employment",
  className,
}: ChipProps) {
  if (variant === "segment") {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          styles.segment,
          size === "employment" ? styles.hEmployment : styles.hTenure,
          selected ? styles.segmentSelected : styles.segmentIdle,
          className,
        )}
      >
        {label}
      </button>
    );
  }

  const onDismissClick = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
    onClear?.();
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        styles.chip,
        selected ? styles.chipSelected : styles.chipIdle,
        className,
      )}
    >
      <span>{label}</span>
      {selected && onClear != null ? (
        <span
          role="button"
          tabIndex={0}
          onClick={onDismissClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onDismissClick(event);
            }
          }}
          className={styles.dismiss}
          aria-label={`Clear ${label} filter`}
        >
          <Image src={closeIcon} alt="" width={16} height={16} className={styles.dismissIcon} unoptimized />
        </span>
      ) : null}
    </button>
  );
}
