import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import { cn } from "@/utils/utils";

import styles from "./Avatar.module.scss";

export type AvatarProps = {
  src: StaticImageData | string;
  alt?: string;
  /** Outer diameter in px. Defaults to 32 (Shivi header). */
  size?: number;
  priority?: boolean;
  className?: string;
};

/** Circular cropped image well. */
export function Avatar({
  src,
  alt = "",
  size = 32,
  priority = false,
  className,
}: AvatarProps) {
  return (
    <span
      className={cn(styles.well, className)}
      style={
        size === 32
          ? undefined
          : ({ width: size, height: size } as CSSProperties)
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={styles.cover}
        unoptimized
        sizes={`${size}px`}
        priority={priority}
      />
    </span>
  );
}
