import type { ReactNode } from "react";

import { cn } from "@/utils/utils";

import styles from "./Badge.module.scss";

export type BadgeProps = {
  children: ReactNode;
  className?: string;
};

/** Compact pill tag — e.g. “Fixed rate”. */
export function Badge({ children, className }: BadgeProps) {
  return <span className={cn(styles.tag, className)}>{children}</span>;
}
