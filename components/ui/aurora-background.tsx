"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

import { AuroraLightLayer } from "@/components/ui/aurora-light-layer";
import styles from "./aurora-background.module.scss";


export interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

/** Full-viewport light aurora backdrop (no dark theme variant). */
export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        styles.relative_1,
        className
      )}
      {...props}
    >
      <AuroraLightLayer showRadialGradient={showRadialGradient} />
      <div className={styles.relative_0}>{children}</div>
    </div>
  );
}
