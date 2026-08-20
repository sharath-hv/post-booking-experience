"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { CelebrationPageTransition } from "@/components/molecules/page-transition";
import { DownPaymentInstalmentSuccess } from "@/components/organisms/payment/DownPaymentInstalmentSuccess";
import { FULL_PAYMENT_INSURANCE_INR } from "@/constants/loan-amount-demo-constants";
import { buildCarDeliveryInsurancePrepHref } from "@/helpers/paymentUrls";
import { parsePositiveIntQuery } from "@/readers/payment";

import styles from "./InsurancePremiumSuccessScreen.module.scss";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

export function InsurancePremiumSuccessScreen() {
  const searchParams = useSearchParams();

  const { subline, nextHref } = useMemo(() => {
    const paid =
      parsePositiveIntQuery(searchParams.get("paid")) ?? FULL_PAYMENT_INSURANCE_INR;
    return {
      subline: `We've received ${formatInr(paid)} for your car insurance.`,
      nextHref: buildCarDeliveryInsurancePrepHref({
        bank: searchParams.get("bank"),
        loanAmount: searchParams.get("loan_amount"),
        tenure: searchParams.get("tenure"),
        addons: searchParams.get("addons"),
      }),
    };
  }, [searchParams]);

  return (
    <CelebrationPageTransition>
      <DownPaymentInstalmentSuccess
        subline={subline}
        nextHref={nextHref}
        backgroundClassName={styles.bgWhite}
      />
    </CelebrationPageTransition>
  );
}
