"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import { InsuranceAddonCard } from "@/components/payment/InsuranceAddonPicker";
import {
  INSURANCE_ADDONS_AVAILABLE_HEADING,
  INSURANCE_ADDONS_CONTINUE_CTA,
  INSURANCE_ADDONS_SECTION_HEADING,
  INSURANCE_ADDONS_SECTION_SUBLINE,
  INSURANCE_ADDONS_TOTAL_LABEL,
  INSURANCE_OPTIONAL_ADDONS,
  insurancePremiumForSelection,
  parseInsuranceAddonIds,
  serializeInsuranceAddonIds,
  type InsuranceAddonId,
} from "@/components/payment/insurance-coverage-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/lib/modify-selection-content";
import {
  modifySelectionCardStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/lib/modify-selection-stagger";
import { buildChooseInsuranceTenureHref } from "@/lib/paymentUrls";
import { cn } from "@/lib/utils";
import styles from "./InsuranceAddonSelectionScreen.module.scss";

const {
  title: STAGGER_TITLE_MS,
  subtext: STAGGER_SUBTEXT_MS,
  firstCard: STAGGER_FIRST_CARD_MS,
} = MODIFY_SELECTION_STAGGER_MS;

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/**
 * Add-on selection — static white page matching change-selection layout:
 * shared shell/header/heading, flat bordered cards, fixed footer with total + CTA.
 * Tenure is chosen next; preview pricing uses standard 1+3.
 */
export function InsuranceAddonSelectionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAddonIds, setSelectedAddonIds] = useState<InsuranceAddonId[]>(() =>
    parseInsuranceAddonIds(searchParams.get("addons")),
  );

  const premiumInr = useMemo(
    () => insurancePremiumForSelection("1+3", selectedAddonIds),
    [selectedAddonIds],
  );

  const onToggleAddon = useCallback((id: InsuranceAddonId) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const nextHref = useMemo(
    () =>
      buildChooseInsuranceTenureHref({
        bank: searchParams.get("bank"),
        loanAmount: searchParams.get("loan_amount"),
        addons: serializeInsuranceAddonIds(selectedAddonIds) || null,
        insuranceAmount: premiumInr,
      }),
    [premiumInr, searchParams, selectedAddonIds],
  );

  const onContinue = useCallback(() => router.push(nextHref), [router, nextHref]);

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <StandaloneScreenHeader />

      <main className={styles.main}>
        <header className={styles.lead}>
          <PageLeadHeading
            title={INSURANCE_ADDONS_SECTION_HEADING}
            subline={INSURANCE_ADDONS_SECTION_SUBLINE}
            titleDelayMs={STAGGER_TITLE_MS}
            sublineDelayMs={STAGGER_SUBTEXT_MS}
          />
        </header>

        <section
          className={styles.addons}
          aria-labelledby="insurance-addons-available-heading"
        >
          <h2 id="insurance-addons-available-heading" className={styles.srOnly}>
            {INSURANCE_ADDONS_AVAILABLE_HEADING}
          </h2>

          <div
            className={styles.addonList}
            role="group"
            aria-label={INSURANCE_ADDONS_AVAILABLE_HEADING}
          >
            {INSURANCE_OPTIONAL_ADDONS.map((addon, index) => (
              <div
                key={addon.id}
                className={cn(styles.addonListItem, "payment-success-stagger")}
                style={{
                  animationDelay: `${modifySelectionCardStaggerDelay(index, STAGGER_FIRST_CARD_MS)}ms`,
                }}
              >
                <InsuranceAddonCard
                  addon={addon}
                  selected={selectedAddonIds.includes(addon.id)}
                  onToggle={onToggleAddon}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className={cn(styles.footer, "footer-elevated")}>
        <div className={styles.footerInner}>
          <div className={styles.totalBlock}>
            <span className={styles.totalLabel}>{INSURANCE_ADDONS_TOTAL_LABEL}</span>
            <span className={styles.totalValue}>{formatInr(premiumInr)}</span>
          </div>
          <button type="button" onClick={onContinue} className={cn(styles.cta, "primary-cta")}>
            {INSURANCE_ADDONS_CONTINUE_CTA}
          </button>
        </div>
      </div>
    </div>
  );
}
