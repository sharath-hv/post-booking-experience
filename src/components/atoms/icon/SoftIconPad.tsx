import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/utils/utils";
import styles from "./SoftIconPad.module.scss";

export type SoftIconPadProps = {
  children?: ReactNode;
  /** Outer diameter in px. Defaults to 36. */
  size?: number;
  /** Render as `span` (inline) or `div`. */
  as?: "span" | "div";
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
};

/**
 * Plain grey circular icon pad for confirm / how-it-works bottom-sheet rows.
 * Do **not** use for menu, receipt, or card wells — those use {@link IconWell}.
 */
export function SoftIconPad({
  children,
  size = 36,
  as: Tag = "span",
  className,
  style,
  "aria-hidden": ariaHidden,
}: SoftIconPadProps) {
  return (
    <Tag
      className={cn(styles.pad, className)}
      style={
        size === 36
          ? style
          : ({ ...style, ["--soft-icon-pad-size" as string]: `${size}px` } as CSSProperties)
      }
      aria-hidden={ariaHidden}
    >
      {children}
    </Tag>
  );
}
