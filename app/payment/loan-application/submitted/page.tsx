import { Suspense } from "react";

import { LoanApplicationSubmittedSuccessScreen } from "@/components/payment/loan-application/LoanApplicationSubmittedSuccessScreen";
import styles from "./page.module.scss";


export default function LoanApplicationSubmittedPage() {
  return (
    <Suspense fallback={<div className={styles.min_h_dvh_0} aria-hidden />}>
      <LoanApplicationSubmittedSuccessScreen />
    </Suspense>
  );
}
