import Image from "next/image";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import tickIcon from "@/assets/tick.svg";
import { SoftIconPad } from "@/components/molecules/SoftIconPad";
import type { BottomSheetConfirmBulletPoint } from "@/constants/bottom-sheet-confirm-bullet";
import styles from "./BottomSheetConfirmBulletList.module.scss";

const BULLET_ICON = tickIcon;

/** Tick bullets — shared by payment / modify confirm bottom sheets. */
export const BOTTOM_SHEET_CONFIRM_BULLET_LIST_CLASS = styles.bottomSheetConfirmBulletList;

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

/**
 * Confirm-sheet bullet rows — SoftIconPad + body copy.
 * Spacing matches payment/choose how-it-works embedded.
 */
export function BottomSheetConfirmBulletList({ id, points }: BottomSheetConfirmBulletListProps) {
  return (
    <ul id={id} className={BOTTOM_SHEET_CONFIRM_BULLET_LIST_CLASS}>
      {points.map((point, index) => {
        const { content, icon } = resolveBulletPoint(point);
        return (
          <li key={index} className={styles.row}>
            <SoftIconPad aria-hidden>
              <Image
                src={icon}
                alt=""
                width={20}
                height={20}
                className={styles.icon}
                unoptimized
                sizes="20px"
              />
            </SoftIconPad>
            <p className={styles.body}>{content}</p>
          </li>
        );
      })}
    </ul>
  );
}
