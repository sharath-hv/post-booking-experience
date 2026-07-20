import Image from "next/image";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { publicAssetPath } from "@/lib/public-asset-path";
import styles from "./BottomSheetConfirmBulletList.module.scss";


const BULLET_ICON = publicAssetPath("tick.svg");

/** Tick bullets — shared by payment / modify confirm bottom sheets. */
export const BOTTOM_SHEET_CONFIRM_BULLET_LIST_CLASS = styles.bottomSheetConfirmBulletList;

export type BottomSheetConfirmBulletPoint =
  | string
  | ReactNode
  | { content: string | ReactNode; icon: StaticImageData | string };

type BottomSheetConfirmBulletListProps = {
  id?: string;
  points: readonly BottomSheetConfirmBulletPoint[];
};

function resolveBulletPoint(point: BottomSheetConfirmBulletPoint): {
  content: string | ReactNode;
  icon: StaticImageData | string;
} {
  if (typeof point === "object" && point !== null && "icon" in point && "content" in point) {
    return { content: point.content, icon: point.icon };
  }
  return { content: point, icon: BULLET_ICON };
}

export function BottomSheetConfirmBulletList({ id, points }: BottomSheetConfirmBulletListProps) {
  return (
    <ul id={id} className={BOTTOM_SHEET_CONFIRM_BULLET_LIST_CLASS}>
      {points.map((point, index) => {
        const { content, icon } = resolveBulletPoint(point);
        return (
          <li key={index} className={styles.flex_0}>
            <div
              className={styles.relative_1}
              aria-hidden
            >
              <Image
                src={icon}
                alt=""
                width={20}
                height={20}
                className={styles.h_5_2}
                unoptimized
                sizes="20px"
              />
            </div>
            <p className={styles.min_w_0_3}>
              {content}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
