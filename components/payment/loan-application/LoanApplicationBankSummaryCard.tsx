"use client";

import Image from "next/image";

import type { BANK_SHEET_OPTIONS } from "@/components/payment/payment-choose-assets";
import { BOOKING_CONFIRMED_ASSETS } from "@/components/kyc/kyc-booking-confirmed-assets";
import styles from "./LoanApplicationBankSummaryCard.module.scss";


type BankOption = (typeof BANK_SHEET_OPTIONS)[number];

type LoanApplicationBankSummaryCardProps = {
  bank: BankOption;
};

/** Figma 2540:38701 — grey bank + rate card (96px). */
export function LoanApplicationBankSummaryCard({ bank }: LoanApplicationBankSummaryCardProps) {
  return (
    <div className={styles.flex_0}>
      <div className={styles.flex_1}>
        <span className={styles.relative_2}>
          <Image
            src={bank.logoSrc}
            alt=""
            width={20}
            height={20}
            className={styles.object_contain_3}
            unoptimized
            sizes="20px"
          />
        </span>
        <span className={styles.text_xs_4}>{bank.name}</span>
        <span className={styles.relative_5} aria-hidden>
          <Image
            src={BOOKING_CONFIRMED_ASSETS.dotSeparator}
            alt=""
            fill
            className={styles.object_contain_3}
            unoptimized
            sizes="16px"
          />
        </span>
        <span className={styles.text_xs_4}>From {bank.rate}</span>
      </div>
      <p className={styles.text_xs_6}>
        Final rates will be based on CIBIL score and current loan obligations
      </p>
    </div>
  );
}
