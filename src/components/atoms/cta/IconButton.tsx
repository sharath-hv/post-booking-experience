import type { ButtonHTMLAttributes, ReactNode } from "react";

import { GhostCta } from "@/components/atoms/cta/GhostCta";

export type IconButtonProps = {
  children: ReactNode;
  "aria-label": string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">;

/** Ghost CTA sized for a single icon. Requires an accessible name. */
export function IconButton({ children, ...props }: IconButtonProps) {
  return <GhostCta {...props}>{children}</GhostCta>;
}
