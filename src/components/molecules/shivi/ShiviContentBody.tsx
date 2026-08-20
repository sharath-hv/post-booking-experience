"use client";

import { WordByWordLine } from "@/components/molecules/WordByWordLine";
import { cn } from "@/utils/utils";

import typeStyles from "./shivi-type.module.scss";

export type ShiviContentBodyProps = {
  text: string;
  /** `heading` — last line acting as a section title above an artifact. */
  variant?: "body" | "heading";
  animate?: boolean;
  wordDelayMs?: number;
  onComplete?: () => void;
  className?: string;
};

/** Body or heading spoken line. */
export function ShiviContentBody({
  text,
  variant = "body",
  animate = false,
  wordDelayMs = 65,
  onComplete,
  className,
}: ShiviContentBodyProps) {
  const lineClass = cn(variant === "heading" ? typeStyles.heading : typeStyles.body, className);
  if (!animate) {
    return variant === "heading" ? (
      <h2 className={lineClass}>{text}</h2>
    ) : (
      <p className={lineClass}>{text}</p>
    );
  }
  return (
    <WordByWordLine
      text={text}
      as={variant === "heading" ? "h2" : "p"}
      wordDelayMs={wordDelayMs}
      onComplete={onComplete}
      ariaLabel={text}
      className={lineClass}
    />
  );
}
