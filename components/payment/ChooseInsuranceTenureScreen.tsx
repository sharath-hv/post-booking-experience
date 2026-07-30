"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import { modifySelectionSelectableCardClassName } from "@/components/molecules/modify-selection-option-card-ui";
import { InsuranceTenureCompareBottomSheet } from "@/components/payment/InsuranceTenureCompareBottomSheet";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";
import {
  INSURANCE_TENURE_DIFFERENCE_CTA,
  INSURANCE_TENURE_OPTIONS,
  INSURANCE_TENURE_OPTIONS_HEADING,
  INSURANCE_TENURE_SCREEN_TITLE,
  insuranceCompareAtForSelection,
  insurancePremiumForSelection,
  insuranceTenureScreenSubline,
  parseInsuranceAddonIds,
  serializeInsuranceAddonIds,
  type InsuranceTenureId,
  type InsuranceTenureOption,
} from "@/components/payment/insurance-coverage-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/lib/modify-selection-content";
import {
  modifySelectionCardStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/lib/modify-selection-stagger";
import { buildInsurancePremiumCheckoutHref } from "@/lib/paymentUrls";
import { cn } from "@/lib/utils";
import styles from "./ChooseInsuranceTenureScreen.module.scss";

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

function TenureRadioIndicator({ selected }: { selected: boolean }) {
  return (
    <Image
      src={selected ? PAYMENT_CHOOSE_ASSETS.radioOn : PAYMENT_CHOOSE_ASSETS.radioOff}
      alt=""
      width={16}
      height={16}
      className={styles.radioImg}
      unoptimized
      aria-hidden
    />
  );
}

type PricedTenureOption = InsuranceTenureOption & {
  pricedPremiumInr: number;
  pricedCompareAtInr: number;
};

function TenureCard({
  option,
  selected,
  onSelect,
}: {
  option: PricedTenureOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const savings = option.pricedCompareAtInr - option.pricedPremiumInr;
  const isStandard = option.id === "1+3";

  return (
    <button
      type="button"
      id={`insurance-tenure-${option.id}`}
      onClick={onSelect}
      aria-pressed={selected}
      className={modifySelectionSelectableCardClassName(selected, false, styles.cardPad)}
    >
      <div className={styles.cardHeader}>
        <div className={styles.illustration}>
          <Image
            src={option.illustrationSrc}
            alt=""
            fill
            className={styles.illustrationImg}
            unoptimized
            sizes="40px"
          />
        </div>
        <div className={cn(styles.cardCopy, option.badge ? styles.cardCopyWithBadge : "")}>
          {option.badge ? <span className={styles.cardBadge}>{option.badge}</span> : null}
          <p className={styles.cardLabel}>{option.label}</p>
        </div>
        <span className={cn(styles.radio, option.badge ? styles.radioWithBadge : "")}>
          <TenureRadioIndicator selected={selected} />
        </span>
      </div>

      <p className={styles.blurb}>{option.blurb}</p>

      <div className={styles.statsRow}>
        <div className={styles.statCol}>
          <p className={styles.statValue}>
            {option.ownDamageYears} {option.ownDamageYears === 1 ? "year" : "years"}
          </p>
          <p className={styles.statCaption}>Zero depreciation cover</p>
        </div>
        <div className={cn(styles.statCol, styles.statColDivider)}>
          <p className={styles.statValue}>
            {option.thirdPartyYears} {option.thirdPartyYears === 1 ? "year" : "years"}
          </p>
          <p className={styles.statCaption}>Third party cover</p>
        </div>
      </div>

      <div className={styles.priceBlock}>
        {option.upgradeBlurb ? <p className={styles.upgradeBlurb}>{option.upgradeBlurb}</p> : null}
        <p className={styles.priceRow}>
          <span className={styles.price}>{formatInr(option.pricedPremiumInr)}</span>
          {!isStandard ? (
            <>
              <span className={styles.compareAt}>{formatInr(option.pricedCompareAtInr)}</span>
              <span className={styles.savings}>Save {formatInr(savings)}</span>
            </>
          ) : null}
        </p>
      </div>
    </button>
  );
}

/**
 * Tenure selection — static white page matching change-selection / add-ons layout.
 * Prices reflect the add-on set from the previous page; pay goes to mock checkout.
 */
export function ChooseInsuranceTenureScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tenureId, setTenureId] = useState<InsuranceTenureId>("1+3");
  const [compareSheetOpen, setCompareSheetOpen] = useState(false);

  const addonIds = useMemo(
    () => parseInsuranceAddonIds(searchParams.get("addons")),
    [searchParams],
  );
  const addonsQuery = useMemo(
    () => serializeInsuranceAddonIds(addonIds) || null,
    [addonIds],
  );

  const pricedOptions = useMemo(
    (): readonly PricedTenureOption[] =>
      INSURANCE_TENURE_OPTIONS.map((option) => ({
        ...option,
        pricedPremiumInr: insurancePremiumForSelection(option.id, addonIds),
        pricedCompareAtInr: insuranceCompareAtForSelection(option.id, addonIds),
      })),
    [addonIds],
  );

  const selected = useMemo(
    () => pricedOptions.find((o) => o.id === tenureId)!,
    [pricedOptions, tenureId],
  );

  const ctaHref = useMemo(
    () =>
      buildInsurancePremiumCheckoutHref(selected.pricedPremiumInr, {
        bank: searchParams.get("bank"),
        loanAmount: searchParams.get("loan_amount"),
        tenure: tenureId,
        addons: addonsQuery,
        insuranceAmount: selected.pricedPremiumInr,
      }),
    [addonsQuery, searchParams, selected.pricedPremiumInr, tenureId],
  );

  const onPay = useCallback(() => router.push(ctaHref), [router, ctaHref]);

  const subline = useMemo(
    () => insuranceTenureScreenSubline(addonIds.length),
    [addonIds.length],
  );

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <StandaloneScreenHeader />

      <main className={styles.main}>
        <header className={styles.lead}>
          <PageLeadHeading
            title={INSURANCE_TENURE_SCREEN_TITLE}
            subline={subline}
            titleDelayMs={STAGGER_TITLE_MS}
            sublineDelayMs={STAGGER_SUBTEXT_MS}
          />
        </header>

        <section
          className={styles.tenureSection}
          aria-labelledby="insurance-tenure-options-heading"
        >
          <h2 id="insurance-tenure-options-heading" className={styles.srOnly}>
            {INSURANCE_TENURE_OPTIONS_HEADING}
          </h2>

          <div
            className={styles.optionList}
            role="radiogroup"
            aria-label={INSURANCE_TENURE_OPTIONS_HEADING}
          >
            {pricedOptions.map((option, index) => (
              <div
                key={option.id}
                className={cn(styles.optionListItem, "payment-success-stagger")}
                style={{
                  animationDelay: `${modifySelectionCardStaggerDelay(index, STAGGER_FIRST_CARD_MS)}ms`,
                }}
              >
                <TenureCard
                  option={option}
                  selected={option.id === tenureId}
                  onSelect={() => setTenureId(option.id)}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCompareSheetOpen(true)}
            className={cn(
              "tertiary-cta",
              styles.compareLink,
              "payment-success-stagger",
            )}
            style={{
              animationDelay: `${modifySelectionCardStaggerDelay(
                pricedOptions.length,
                STAGGER_FIRST_CARD_MS,
              )}ms`,
            }}
          >
            {INSURANCE_TENURE_DIFFERENCE_CTA}
          </button>
        </section>
      </main>

      <div className={cn(styles.footer, "footer-elevated")}>
        <div className={styles.footerInner}>
          <button type="button" onClick={onPay} className={cn(styles.cta, "primary-cta")}>
            Pay {formatInr(selected.pricedPremiumInr)}
          </button>
        </div>
      </div>

      <InsuranceTenureCompareBottomSheet
        open={compareSheetOpen}
        onClose={() => setCompareSheetOpen(false)}
        selectedAddonIds={addonIds}
      />
    </div>
  );
}
