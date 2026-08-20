import Image from "next/image";

import radioOffIcon from "@/assets/Radio button off.svg";
import radioOnIcon from "@/assets/Radio button on.svg";
import { cn } from "@/utils/utils";

import styles from "./Radio.module.scss";

export type RadioProps = {
  selected: boolean;
  className?: string;
};

/** 16px on/off radio glyph. Presentational — parent owns the selectable control. */
export function Radio({ selected, className }: RadioProps) {
  return (
    <span className={cn(styles.glyph, className)} aria-hidden>
      <Image
        src={selected ? radioOnIcon : radioOffIcon}
        alt=""
        fill
        className={styles.image}
        unoptimized
        sizes="16px"
      />
    </span>
  );
}
