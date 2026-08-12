import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

/** Confirm-sheet bullet: plain copy or icon + content. */
export type BottomSheetConfirmBulletPoint =
  | string
  | ReactNode
  | {
      icon: StaticImageData | string;
      content: string | ReactNode;
    };
