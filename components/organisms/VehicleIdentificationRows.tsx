"use client";

import styles from "./VehicleIdentificationRows.module.scss";

type VehicleIdentificationRowsProps = {
  engineNo: string;
  chassisNo: string;
};

function VehicleIdentificationLine({ label, value }: { label: string; value: string }) {
  return (
    <p className={styles.text_xs_0}>
      <span className={styles.font_normal_1}>{label}:</span>{" "}
      <span className={styles.font_medium_5}>{value}</span>
    </p>
  );
}

/**
 * Divider + engine / chassis rows (shared by celebration card and manage-booking sheet).
 */
export function VehicleIdentificationRows({
  engineNo,
  chassisNo,
}: VehicleIdentificationRowsProps) {
  return (
    <>
      <div className={styles.mt_3_6} role="separator" aria-hidden />
      <div className={styles.mt_3_7}>
        <VehicleIdentificationLine label="Engine no" value={engineNo} />
        <VehicleIdentificationLine label="Chassis no" value={chassisNo} />
      </div>
    </>
  );
}
