import styles from "./VehicleIdentificationRows.module.scss";

type VehicleIdentificationRowsProps = {
  engineNo: string;
  chassisNo: string;
  /** Present only after RTO registration. */
  registrationNo?: string;
};

function VehicleIdentificationLine({ label, value }: { label: string; value: string }) {
  return (
    <p className={styles.text_xs_0}>
      <span className={styles.font_normal_1}>{label}:</span>
      <span className={styles.font_medium_5}>{value}</span>
    </p>
  );
}

/**
 * Divider + optional car no / engine / chassis rows (celebration + manage-booking).
 */
export function VehicleIdentificationRows({
  engineNo,
  chassisNo,
  registrationNo,
}: VehicleIdentificationRowsProps) {
  const carNo =
    registrationNo != null && registrationNo.length > 0 ? registrationNo : undefined;

  return (
    <>
      <div className={styles.mt_3_6} role="separator" aria-hidden />
      <div className={styles.mt_3_7}>
        {carNo != null ? (
          <VehicleIdentificationLine label="Car registration no" value={carNo} />
        ) : null}
        <VehicleIdentificationLine label="Engine no" value={engineNo} />
        <VehicleIdentificationLine label="Chassis no" value={chassisNo} />
      </div>
    </>
  );
}
