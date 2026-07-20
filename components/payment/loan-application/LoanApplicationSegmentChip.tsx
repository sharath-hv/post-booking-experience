"use client";

import styles from "./LoanApplicationSegmentChip.module.scss";

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
  const heightClass = size === "employment" ? styles.h_employment : styles.h_tenure;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        styles.chip,
        heightClass,
        selected ? styles.selected : styles.unselected,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </button>
  );
}
