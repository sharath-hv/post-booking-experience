import { Suspense } from "react";

import { AckoDriveFinanceActionScreen } from "@/components/payment/AckoDriveFinanceActionScreen";
import styles from "./page.module.scss";


/**
 * ACKO Drive finance — loan application action step after banking partner confirmation.
 */
export default function AckoDriveFinanceActionPage() {
  return (
    <Suspense fallback={<div className={styles.min_h_dvh_0} aria-hidden />}>
      <AckoDriveFinanceActionScreen />
    </Suspense>
  );
}
