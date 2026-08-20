import Image from "next/image";

import checkboxSelected from "@/assets/Checkbox selected.svg";
import checkboxUnselected from "@/assets/Checkbox unselected.svg";
import { cn } from "@/utils/utils";

import styles from "./Checkbox.module.scss";

export type CheckboxProps = {
  checked: boolean;
  /** 16px fill glyph (default) or 20px intrinsic size. */
  size?: 16 | 20;
  className?: string;
};

/** On/off checkbox glyph. Presentational — parent owns the label/control. */
export function Checkbox({ checked, size = 16, className }: CheckboxProps) {
  const src = checked ? checkboxSelected : checkboxUnselected;

  if (size === 20) {
    return (
      <Image
        src={src}
        alt=""
        width={20}
        height={20}
        unoptimized
        aria-hidden
        className={cn(styles.glyph20, className)}
      />
    );
  }

  return (
    <span className={cn(styles.glyph16, className)} aria-hidden>
      <Image src={src} alt="" fill className={styles.image} unoptimized sizes="16px" />
    </span>
  );
}
