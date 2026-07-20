"use client";

import Image from "next/image";

import arrowRightIcon from "@/assets/Arrow_right.svg";
import type { ModifySelectionCarModelOption } from "@/lib/modify-selection-car-models-content";
import styles from "./ModifySelectionCarModelRow.module.scss";


type ModifySelectionCarModelRowProps = {
  model: ModifySelectionCarModelOption;
  onSelect: () => void;
};

/**
 * Model list row — Figma 2686:11003 (48px thumb, name, chevron).
 */
export function ModifySelectionCarModelRow({ model, onSelect }: ModifySelectionCarModelRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={styles.flex_0}
    >
      <div className={styles.flex_1}>
        <div className={styles.relative_2}>
          <Image
            src={model.thumbnailSrc}
            alt=""
            fill
            className={styles.object_contain_3}
            unoptimized
            sizes="40px"
          />
        </div>
      </div>
      <p className={styles.min_w_0_4}>{model.name}</p>
      <span className={styles.relative_5} aria-hidden>
        <Image
          src={arrowRightIcon}
          alt=""
          width={20}
          height={20}
          className={styles.size_5_6}
          unoptimized
          sizes="20px"
        />
      </span>
    </button>
  );
}
