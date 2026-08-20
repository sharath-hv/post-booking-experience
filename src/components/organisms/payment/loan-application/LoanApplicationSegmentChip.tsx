"use client";

import { Chip } from "@/components/atoms/chip/Chip";

type LoanApplicationSegmentChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  /** Employment chips are 48px; tenure chips are 40px. */
  size?: "employment" | "tenure";
  className?: string;
};

export function LoanApplicationSegmentChip({
  label,
  selected,
  onClick,
  size = "employment",
  className = "",
}: LoanApplicationSegmentChipProps) {
  return (
    <Chip
      variant="segment"
      size={size}
      label={label}
      selected={selected}
      onSelect={onClick}
      className={className}
    />
  );
}
