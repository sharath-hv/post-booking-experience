"use client";

import { WordByWordLine } from "@/components/molecules/WordByWordLine";
import { cn } from "@/utils/utils";

import typeStyles from "./shivi-type.module.scss";

export type ShiviLeadTitleProps = {
  text: string;
  animate?: boolean;
  wordDelayMs?: number;
  onComplete?: () => void;
  className?: string;
};

/** First spoken line — heading-lg, medium weight. */
export function ShiviLeadTitle({
  text,
  animate = false,
  wordDelayMs = 120,
  onComplete,
  className,
}: ShiviLeadTitleProps) {
  const lineClass = cn(typeStyles.lead, className);
  if (!animate) {
    return <h1 className={lineClass}>{text}</h1>;
  }
  return (
    <WordByWordLine
      text={text}
      as="h1"
      wordDelayMs={wordDelayMs}
      onComplete={onComplete}
      ariaLabel={text}
      className={lineClass}
    />
  );
}
