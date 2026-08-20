"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { Radio } from "@/components/atoms/selection/Radio";
import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import { InsuranceTenureCompareBottomSheet } from "@/components/organisms/payment/InsuranceTenureCompareBottomSheet";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/organisms/payment/payment-choose-assets";
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
} from "@/components/organisms/payment/insurance-coverage-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/constants/modify-selection-content";
import {
  modifySelectionCardStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/helpers/modify-selection-stagger";
import { buildInsurancePremiumCheckoutHref } from "@/helpers/paymentUrls";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { cn } from "@/utils/utils";
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

type PricedTenureOption = InsuranceTenureOption & {
  pricedPremiumInr: number;
  pricedCompareAtInr: number;
};

/**
 * Tenure option card — same hierarchy as payment/choose OptionCard, but
 * bordered / no shadow for the plain white standalone page.
 */
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
  const chip = option.badge;

  return (
    <button
      type="button"
      id={`insurance-tenure-${option.id}`}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(styles.card, selected ? styles.cardSelected : styles.cardIdle)}
    >
      <div className={cn(styles.cardHeader, !chip && styles.cardHeaderCenter)}>
        <div className={styles.illustration}>
          <Image
            src={option.illustrationSrc}
            alt=""
            fill
            className={styles.objectContain}
            unoptimized
            sizes="40px"
          />
        </div>
        {/* With chip: two-line lockup. Without: title (+ radio) vertically centers with the icon. */}
        <div className={styles.cardCopy}>
          {chip ? <span className={styles.cardBadge}>{chip}</span> : null}
          <p className={cn(styles.cardLabel, chip ? styles.cardLabelAfterChip : "")}>
            {option.label}
          </p>
        </div>
        <span className={cn(styles.radio, chip && styles.radioOffset)}>
          <Radio selected={selected} />
        </span>
      </div>

      <p className={styles.blurb}>{option.blurb}</p>

      <div className={styles.statsRow}>
        <div className={styles.statCol}>
          <p className={styles.statValue}>
            {option.ownDamageYears} {option.ownDamageYears === 1 ? "year" : "years"}
          </p>
          <p className={styles.statCaption}>Zero dep cover</p>
        </div>
        <div className={styles.statColDivider}>
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
 * Tenure selection — static white page; option cards match payment/choose OptionCard.
 * Prices reflect the add-on set from the previous page; pay goes to mock checkout.
 */
export function ChooseInsuranceTenureScreen() {
  const router = useRouter();
  const { loading, start } = useCtaNavigation();
  const searchParams = useSearchParams();
  const [tenureId, setTenureId] = useState<InsuranceTenureId>("3+3");
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

  const onPay = useCallback(() => start(() => router.push(ctaHref)), [router, ctaHref, start]);

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
          <PrimaryCta onClick={onPay} loading={loading} className={styles.cta}>
            Pay {formatInr(selected.pricedPremiumInr)}
          </PrimaryCta>
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
