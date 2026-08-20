import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/utils";

export type TertiaryCtaProps = {
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/** Text/link CTA — `.tertiary-cta`. */
export function TertiaryCta({
  children,
  className,
  type = "button",
  ...props
}: TertiaryCtaProps) {
  return (
    <button type={type} {...props} className={cn("tertiary-cta", className)}>
      {children}
    </button>
  );
}
