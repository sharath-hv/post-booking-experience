"use client";

import Image from "next/image";
import { useCallback } from "react";

import copyIcon from "@/assets/copy.svg";
import styles from "./VehicleIdentificationRows.module.scss";


type VehicleIdentificationRowsProps = {
  engineNo: string;
  chassisNo: string;
  /** When true, shows copy icons 8px after each number. */
  showCopyButtons?: boolean;
};

function VehicleIdentificationCopyLine({
  label,
  value,
  showCopyButton,
}: {
  label: string;
  value: string;
  showCopyButton: boolean;
}) {
  const onCopy = useCallback(() => {
    void navigator.clipboard?.writeText(value).catch(() => {});
  }, [value]);

  return (
    <p className={styles.text_xs_0}>
      <span className={styles.font_normal_1}>{label}:</span>{" "}
      {showCopyButton ? (
        <span className={styles.inline_flex_2}>
          {value}
          <button
            type="button"
            onClick={onCopy}
            aria-label={`Copy ${label}`}
            className={styles.flex_3}
          >
            <Image src={copyIcon} alt="" width={16} height={16} className={styles.size_4_4} unoptimized />
          </button>
        </span>
      ) : (
        <span className={styles.font_medium_5}>{value}</span>
      )}
    </p>
  );
}

/**
 * Divider + engine / chassis rows (shared by celebration card and manage-booking sheet).
 */
export function VehicleIdentificationRows({
  engineNo,
  chassisNo,
  showCopyButtons = false,
}: VehicleIdentificationRowsProps) {
  return (
    <>
      <div className={styles.mt_3_6} role="separator" aria-hidden />
      <div className={styles.mt_3_7}>
        <VehicleIdentificationCopyLine
          label="Engine no"
          value={engineNo}
          showCopyButton={showCopyButtons}
        />
        <VehicleIdentificationCopyLine
          label="Chassis no"
          value={chassisNo}
          showCopyButton={showCopyButtons}
        />
      </div>
    </>
  );
}
