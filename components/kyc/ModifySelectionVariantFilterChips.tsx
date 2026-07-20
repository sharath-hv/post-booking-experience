"use client";

import Image from "next/image";

import closeIcon from "@/assets/Close.svg";
import type {
  ModifySelectionVariantFilters,
  ModifySelectionVariantFuel,
  ModifySelectionVariantTransmission,
} from "@/lib/modify-selection-variants-content";
import { cn } from "@/lib/utils";
import styles from "./ModifySelectionVariantFilterChips.module.scss";


type ModifySelectionVariantFilterChipsProps = {
  filters: ModifySelectionVariantFilters;
  onFuelChange: (fuel: ModifySelectionVariantFuel | null) => void;
  onTransmissionChange: (transmission: ModifySelectionVariantTransmission | null) => void;
};

function FilterChip({
  label,
  selected,
  onSelect,
  onClear,
  className,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        styles.inline_flex_5,
        selected
          ? styles.border_121212__6
          : styles.border_e8e8e8__7,
        className,
      )}
    >
      <span>{label}</span>
      {selected && onClear != null ? (
        <span
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            onClear();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onClear();
            }
          }}
          className={styles.relative_0}
          aria-label={`Clear ${label} filter`}
        >
          <Image src={closeIcon} alt="" width={16} height={16} className={styles.size_4_1} unoptimized />
        </span>
      ) : null}
    </button>
  );
}

/**
 * Quick filters — fuel and transmission chips (Figma 2682:9105).
 */
export function ModifySelectionVariantFilterChips({
  filters,
  onFuelChange,
  onTransmissionChange,
}: ModifySelectionVariantFilterChipsProps) {
  const toggleFuel = (fuel: ModifySelectionVariantFuel) => {
    onFuelChange(filters.fuel === fuel ? null : fuel);
  };

  const toggleTransmission = (transmission: ModifySelectionVariantTransmission) => {
    onTransmissionChange(filters.transmission === transmission ? null : transmission);
  };

  return (
    <div
      className={styles.flex_2}
      role="group"
      aria-label="Filter variants"
    >
      <FilterChip
        label="Petrol"
        selected={filters.fuel === "petrol"}
        onSelect={() => toggleFuel("petrol")}
        onClear={() => onFuelChange(null)}
      />
      <FilterChip
        label="Diesel"
        selected={filters.fuel === "diesel"}
        onSelect={() => toggleFuel("diesel")}
        onClear={() => onFuelChange(null)}
      />
      <span className={styles.mx_0_5_3} aria-hidden />
      <FilterChip
        label="Manual"
        selected={filters.transmission === "manual"}
        onSelect={() => toggleTransmission("manual")}
        onClear={() => onTransmissionChange(null)}
      />
      <FilterChip
        label="Automatic"
        selected={filters.transmission === "automatic"}
        onSelect={() => toggleTransmission("automatic")}
        onClear={() => onTransmissionChange(null)}
        className={styles.min_w_77px__4}
      />
    </div>
  );
}
