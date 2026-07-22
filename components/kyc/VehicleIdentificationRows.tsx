"use client";

import Image from "next/image";
import { useCallback, type MouseEvent } from "react";

import copyIcon from "@/assets/copy.svg";
import { showAppToast } from "@/lib/app-toast";
import styles from "./VehicleIdentificationRows.module.scss";

type VehicleIdentificationRowsProps = {
  engineNo: string;
  chassisNo: string;
  /** When true, shows copy icons 8px after each number. */
  showCopyButtons?: boolean;
};

async function copyToClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* fall through */
  }

  try {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(input);
    return ok;
  } catch {
    return false;
  }
}

function VehicleIdentificationCopyLine({
  label,
  value,
  toastLabel,
  showCopyButton,
}: {
  label: string;
  value: string;
  toastLabel: string;
  showCopyButton: boolean;
}) {
  const onCopy = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      void copyToClipboard(value).then((ok) => {
        if (ok) showAppToast(`${toastLabel} copied`);
      });
    },
    [toastLabel, value],
  );

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
          toastLabel="Engine number"
          value={engineNo}
          showCopyButton={showCopyButtons}
        />
        <VehicleIdentificationCopyLine
          label="Chassis no"
          toastLabel="Chassis number"
          value={chassisNo}
          showCopyButton={showCopyButtons}
        />
      </div>
    </>
  );
}
