"use client";

import Lottie from "lottie-react";

import ackoDriveFinanceSuccessLottie from "@/components/kyc/lottie/acko-drive-finance-success.json";
import styles from "./AckoDriveFinanceSuccessLottie.module.scss";

type AckoDriveFinanceSuccessLottieProps = {
  className?: string;
};

/** ACKO Drive finance success animation — shared by confirmed and action screens. */
export function AckoDriveFinanceSuccessLottie({
  className = styles.size,
}: AckoDriveFinanceSuccessLottieProps) {
  return (
    <Lottie
      animationData={ackoDriveFinanceSuccessLottie}
      loop={false}
      className={className}
      aria-label="Success animation"
    />
  );
}
