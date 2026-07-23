"use client";

import Image from "next/image";

import arrowRightIcon from "@/assets/Arrow_right.svg";
import styles from "./BankLoanCard.module.scss";

import {
  bankLockInSummary,
  formatBankRate,
  type BankLoanTerms,
} from "@/components/payment/bank-loan-terms";

/** Neutral badge for both rate types — a color read (e.g. green) would signal "better", which isn't true of either. */
function RateTypeTag({ rateType }: { rateType: "Fixed" | "Floating" }) {
  return (
    <span className={styles.inline_flex_0}>
      {rateType === "Fixed" ? "Fixed rate" : "Floating rate"}
    </span>
  );
}

type BankLoanCardProps = {
  bank: BankLoanTerms;
  onOpen: () => void;
};

/**
 * Bank selection full page — collapsed card (Figma follow-up to 1941:12822).
 * Know: which banks are available, enough to shortlist 2-3.
 * Do: tap in for full terms.
 */
export function BankLoanCard({ bank, onOpen }: BankLoanCardProps) {
  const lockInSummary = bankLockInSummary(bank);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={bank.preApproved ? styles.w_full_1_preApproved : styles.w_full_1}
      aria-label={bank.preApproved ? `${bank.name}, pre-approved` : undefined}
    >
      {bank.preApproved ? (
        <div className={styles.preApprovedBanner}>Pre-approved loan available for you</div>
      ) : null}

      <div className={styles.content}>
        <div className={styles.flex_2}>
          <div className={styles.relative_3}>
            <Image
              src={bank.logoSrc}
              alt=""
              fill
              className={styles.object_contain_4}
              unoptimized
              sizes="40px"
            />
          </div>
          <div className={styles.min_w_0_5}>
            <div className={styles.flex_6}>
              <p className={styles.text_base_7}>{bank.name}</p>
              {bank.rateType ? <RateTypeTag rateType={bank.rateType} /> : null}
            </div>
            <p className={styles.mt_0_5_8}>
              Interest rate from{" "}
              <span className={styles.font_medium_9}>{formatBankRate(bank)}</span>
            </p>
          </div>
        </div>

        {lockInSummary ? (
          <div className={styles.mt_3_10}>
            <p className={styles.text_xs_11}>{lockInSummary}</p>
            <span className={styles.relative_12} aria-hidden>
              <Image
                src={arrowRightIcon}
                alt=""
                fill
                className={styles.object_contain_13}
                unoptimized
                sizes="20px"
              />
            </span>
          </div>
        ) : null}
      </div>
    </button>
  );
}
