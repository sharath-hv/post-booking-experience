"use client";

import { Chip } from "@/components/atoms/chip/Chip";
import type {
  ModifySelectionVariantFilters,
  ModifySelectionVariantFuel,
  ModifySelectionVariantTransmission,
} from "@/constants/modify-selection-variants-content";
import styles from "./ModifySelectionVariantFilterChips.module.scss";


type ModifySelectionVariantFilterChipsProps = {
  filters: ModifySelectionVariantFilters;
  onFuelChange: (fuel: ModifySelectionVariantFuel | null) => void;
  onTransmissionChange: (transmission: ModifySelectionVariantTransmission | null) => void;
};

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
      <Chip
        label="Petrol"
        selected={filters.fuel === "petrol"}
        onSelect={() => toggleFuel("petrol")}
        onClear={() => onFuelChange(null)}
      />
      <Chip
        label="Diesel"
        selected={filters.fuel === "diesel"}
        onSelect={() => toggleFuel("diesel")}
        onClear={() => onFuelChange(null)}
      />
      <span className={styles.mx_0_5_3} aria-hidden />
      <Chip
        label="Manual"
        selected={filters.transmission === "manual"}
        onSelect={() => toggleTransmission("manual")}
        onClear={() => onTransmissionChange(null)}
      />
      <Chip
        label="Automatic"
        selected={filters.transmission === "automatic"}
        onSelect={() => toggleTransmission("automatic")}
        onClear={() => onTransmissionChange(null)}
        className={styles.min_w_77px__4}
      />
    </div>
  );
}
