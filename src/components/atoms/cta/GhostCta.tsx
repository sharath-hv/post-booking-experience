import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/utils";

export type GhostCtaProps = {
  children: ReactNode;
  /** Translucent hover on dark surfaces. */
  onDark?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/** Quiet icon/text hit target — `.cta-ghost`. */
export function GhostCta({
  children,
  onDark = false,
  className,
  type = "button",
  ...props
}: GhostCtaProps) {
  return (
    <button
      type={type}
      {...props}
      className={cn("cta-ghost", onDark && "cta-ghost-on-dark", className)}
    >
      {children}
    </button>
  );
}
