import Image from "next/image";
import type { ReactNode } from "react";

import { publicAssetPath } from "@/lib/public-asset-path";

const BULLET_ICON = publicAssetPath("tick.svg");

/** Tick bullets — shared by payment / modify confirm bottom sheets. */
export const BOTTOM_SHEET_CONFIRM_BULLET_LIST_CLASS =
  "mt-5 w-full list-none space-y-5";

type BottomSheetConfirmBulletListProps = {
  id?: string;
  points: readonly (string | ReactNode)[];
};

export function BottomSheetConfirmBulletList({ id, points }: BottomSheetConfirmBulletListProps) {
  return (
    <ul id={id} className={BOTTOM_SHEET_CONFIRM_BULLET_LIST_CLASS}>
      {points.map((line, index) => (
        <li key={index} className="flex gap-3">
          <div
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5]"
            aria-hidden
          >
            <Image
              src={BULLET_ICON}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
              unoptimized
              sizes="20px"
            />
          </div>
          <p className="min-w-0 flex-1 self-center text-left text-sm font-normal leading-5 text-[#121212]">
            {line}
          </p>
        </li>
      ))}
    </ul>
  );
}
