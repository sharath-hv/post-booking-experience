"use client";

import {
  INSURANCE_ADDON_ADD_LABEL,
  INSURANCE_ADDON_ADDED_LABEL,
  type InsuranceAddonId,
  type InsuranceAddonOption,
} from "@/components/organisms/payment/insurance-coverage-content";
import { ToggleAdd } from "@/components/atoms/selection/ToggleAdd";
import { cn } from "@/utils/utils";
import styles from "./InsuranceAddonPicker.module.scss";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

export type InsuranceAddonCardProps = {
  addon: InsuranceAddonOption;
  selected: boolean;
  onToggle: (id: InsuranceAddonId) => void;
};

/**
 * Optional add-on card — Figma 2961:9254.
 * Selected state matches change-selection cards (lavender border + wash);
 * Add / Added stays the control (no radio).
 */
export function InsuranceAddonCard({ addon, selected, onToggle }: InsuranceAddonCardProps) {
  return (
    <article
      id={`insurance-addon-${addon.id}`}
      className={cn(styles.card, selected && styles.cardSelected)}
      aria-label={`${addon.title}, ${formatInr(addon.premiumInr)}`}
    >
      <div className={styles.body}>
        <p className={styles.headline}>{addon.headline}</p>
        <p className={styles.detail}>{addon.detail}</p>
      </div>

      <div className={styles.footer}>
        <p className={styles.productRow}>
          <span className={styles.productName}>
            {addon.title} {addon.priceConnector}
          </span>
          <span className={styles.price}>{formatInr(addon.premiumInr)}</span>
        </p>
        <ToggleAdd
          selected={selected}
          idleLabel={INSURANCE_ADDON_ADD_LABEL}
          selectedLabel={INSURANCE_ADDON_ADDED_LABEL}
          onClick={() => onToggle(addon.id)}
        />
      </div>
    </article>
  );
}
