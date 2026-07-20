"use client";

import Image from "next/image";

import type { BANK_SHEET_OPTIONS } from "@/components/payment/payment-choose-assets";
import styles from "./AckoDriveBankPartnerRow.module.scss";


type BankOption = (typeof BANK_SHEET_OPTIONS)[number];

type AckoDriveBankPartnerRowProps = {
  bank: BankOption;
  /** When set, shows the Change control (e.g. celebration confirmed screen). */
  onChange?: () => void;
};

/** Banking partner row — continues Shivi's body copy on ACKO Drive screens. */
export function AckoDriveBankPartnerRow({ bank, onChange }: AckoDriveBankPartnerRowProps) {
  return (
    <div className={styles.flex_0}>
      <span className={styles.text_base_1}>Banking partner</span>
      <span className={styles.inline_flex_2}>
        <span className={styles.inline_flex_3}>
          <span className={styles.relative_4}>
            <Image
              src={bank.logoSrc}
              alt={bank.name}
              width={20}
              height={20}
              className={styles.object_contain_5}
              unoptimized
              sizes="20px"
            />
          </span>
          <span className={styles.text_base_6}>{bank.brandText}</span>
        </span>
        {onChange != null ? (
          <button
            type="button"
            onClick={onChange}
            className={styles.cursor_pointer_7}
          >
            Change
          </button>
        ) : null}
      </span>
    </div>
  );
}
