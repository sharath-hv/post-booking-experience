import Image from "next/image";

import done01Icon from "@/assets/Done.svg";
import { cn } from "@/utils/utils";

import styles from "./TickBadge.module.scss";

export type TickBadgeProps = {
  className?: string;
};

/** 24px uploaded-file success mark. */
export function TickBadge({ className }: TickBadgeProps) {
  return (
    <span className={cn(styles.badge, className)} aria-hidden>
      <Image src={done01Icon} alt="" fill className={styles.image} unoptimized sizes="24px" />
    </span>
  );
}
