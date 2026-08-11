import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";
import styles from "./IconWell.module.scss";

export type IconWellTone = "grey" | "green" | "amber" | "purple";

const TONE_CLASS: Record<IconWellTone, string> = {
  grey: styles.grey,
  green: styles.green,
  amber: styles.amber,
  purple: styles.purple,
};

/** Tone surface class — for rare cases that need the well look without the component. */
export function iconWellToneClass(tone: IconWellTone): string {
  return TONE_CLASS[tone];
}

export type IconWellProps = {
  children?: ReactNode;
  /** Colour variant of the circular surface. */
  tone?: IconWellTone;
  /** Outer diameter in px. Defaults to 44. */
  size?: number;
  /** Render as `span` (inline) or `div`. */
  as?: "span" | "div";
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
};

/**
 * Reusable circular icon container with grey / green / amber / purple surfaces.
 */
export function IconWell({
  children,
  tone = "grey",
  size = 44,
  as: Tag = "span",
  className,
  style,
  "aria-hidden": ariaHidden,
}: IconWellProps) {
  return (
    <Tag
      className={cn(styles.well, TONE_CLASS[tone], className)}
      style={
        size === 44
          ? style
          : ({ ...style, ["--icon-well-size" as string]: `${size}px` } as CSSProperties)
      }
      aria-hidden={ariaHidden}
    >
      {children}
    </Tag>
  );
}
