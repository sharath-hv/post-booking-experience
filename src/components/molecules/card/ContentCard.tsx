import type { ReactNode } from "react";

import { Surface, type SurfaceProps } from "@/components/atoms/surface/Surface";

export type ContentCardProps = {
  children: ReactNode;
  variant?: SurfaceProps["variant"];
  padding?: SurfaceProps["padding"];
  elevated?: boolean;
  className?: string;
};

/** Padded card surface for stacked content. */
export function ContentCard({
  children,
  variant = "solid",
  padding = "md",
  elevated = false,
  className,
}: ContentCardProps) {
  return (
    <Surface variant={variant} padding={padding} elevated={elevated} className={className}>
      {children}
    </Surface>
  );
}
