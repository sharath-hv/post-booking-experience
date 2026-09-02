"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { Radio } from "@/components/atoms/selection/Radio";
import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import { InsuranceTenureCompareBottomSheet } from "@/components/organisms/payment/InsuranceTenureCompareBottomSheet";
import {
  INSURANCE_TENURE_DIFFERENCE_CTA,
  INSURANCE_TENURE_OPTIONS,
  INSURANCE_TENURE_OPTIONS_HEADING,
  insuranceCompareAtForSelection,
  insurancePremiumForSelection,
  type InsuranceTenureId,
  type InsuranceTenureOption,
} from "@/components/organisms/payment/insurance-coverage-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/constants/modify-selection-content";
import {
  MODIFY_SELECTION_ACCESSORIES_PATH,
  MODIFY_SELECTION_DEFAULT_INSURANCE_TENURE,
  MODIFY_SELECTION_INSURANCE_CONTINUE_CTA,
  MODIFY_SELECTION_INSURANCE_SCREEN_SUBLINE,
  MODIFY_SELECTION_INSURANCE_SCREEN_TITLE,
} from "@/constants/modify-selection-coverage-content";
import {
  ensureModifySelectionCoveragePending,
  writeModifySelectionCoveragePending,
} from "@/helpers/modify-selection-coverage-pending";
import {
  modifySelectionCardStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/helpers/modify-selection-stagger";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { cn } from "@/utils/utils";
import tenureStyles from "@/components/organisms/payment/ChooseInsuranceTenureScreen.module.scss";

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
      id={`modify-insurance-tenure-${option.id}`}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        tenureStyles.card,
        selected ? tenureStyles.cardSelected : tenureStyles.cardIdle,
      )}
    >
      <div className={cn(tenureStyles.cardHeader, !chip && tenureStyles.cardHeaderCenter)}>
        <div className={tenureStyles.illustration}>
          <Image
            src={option.illustrationSrc}
            alt=""
            fill
            className={tenureStyles.objectContain}
            unoptimized
            sizes="40px"
          />
        </div>
        <div className={tenureStyles.cardCopy}>
          {chip ? <span className={tenureStyles.cardBadge}>{chip}</span> : null}
          <p
            className={cn(
              tenureStyles.cardLabel,
              chip ? tenureStyles.cardLabelAfterChip : "",
            )}
          >
            {option.label}
          </p>
        </div>
        <span className={cn(tenureStyles.radio, chip && tenureStyles.radioOffset)}>
          <Radio selected={selected} />
        </span>
      </div>

      <p className={tenureStyles.blurb}>{option.blurb}</p>

      <div className={tenureStyles.statsRow}>
        <div className={tenureStyles.statCol}>
          <p className={tenureStyles.statValue}>
            {option.ownDamageYears} {option.ownDamageYears === 1 ? "year" : "years"}
          </p>
          <p className={tenureStyles.statCaption}>Zero dep cover</p>
        </div>
        <div className={tenureStyles.statColDivider}>
          <p className={tenureStyles.statValue}>
            {option.thirdPartyYears} {option.thirdPartyYears === 1 ? "year" : "years"}
          </p>
          <p className={tenureStyles.statCaption}>Third party cover</p>
        </div>
      </div>

      <div className={tenureStyles.priceBlock}>
        {option.upgradeBlurb ? (
          <p className={tenureStyles.upgradeBlurb}>{option.upgradeBlurb}</p>
        ) : null}
        <p className={tenureStyles.priceRow}>
          <span className={tenureStyles.price}>{formatInr(option.pricedPremiumInr)}</span>
          {!isStandard ? (
            <>
              <span className={tenureStyles.compareAt}>
                {formatInr(option.pricedCompareAtInr)}
              </span>
              <span className={tenureStyles.savings}>Save {formatInr(savings)}</span>
            </>
          ) : null}
        </p>
      </div>
    </button>
  );
}

/**
 * Modify-selection insurance tenure — after colour/delivery, before the accessory kit.
 */
export function ModifySelectionInsuranceTenureScreen() {
  const router = useRouter();
  const { loading, start } = useCtaNavigation();
  const [compareSheetOpen, setCompareSheetOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [tenureId, setTenureId] = useState<InsuranceTenureId>(
    MODIFY_SELECTION_DEFAULT_INSURANCE_TENURE,
  );

  useEffect(() => {
    const coverage = ensureModifySelectionCoveragePending();
    if (coverage == null) {
      router.replace("/booking/modify");
      return;
    }
    setTenureId(coverage.insuranceTenure);
    setReady(true);
  }, [router]);

  const pricedOptions = useMemo(
    (): readonly PricedTenureOption[] =>
      INSURANCE_TENURE_OPTIONS.map((option) => ({
        ...option,
        pricedPremiumInr: insurancePremiumForSelection(option.id),
        pricedCompareAtInr: insuranceCompareAtForSelection(option.id),
      })),
    [],
  );

  const onContinue = useCallback(() => {
    const coverage = ensureModifySelectionCoveragePending();
    if (coverage == null) {
      router.replace("/booking/modify");
      return;
    }
    writeModifySelectionCoveragePending({
      ...coverage,
      insuranceTenure: tenureId,
      returnToConfirm: false,
    });
    const nextPath = coverage.returnToConfirm
      ? coverage.confirmPath
      : MODIFY_SELECTION_ACCESSORIES_PATH;
    start(() => router.push(nextPath));
  }, [router, start, tenureId]);

  if (!ready) {
    return null;
  }

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <StandaloneScreenHeader />

      <main className={tenureStyles.main}>
        <header className={tenureStyles.lead}>
          <PageLeadHeading
            title={MODIFY_SELECTION_INSURANCE_SCREEN_TITLE}
            subline={MODIFY_SELECTION_INSURANCE_SCREEN_SUBLINE}
            titleDelayMs={STAGGER_TITLE_MS}
            sublineDelayMs={STAGGER_SUBTEXT_MS}
          />
        </header>

        <section
          className={tenureStyles.tenureSection}
          aria-labelledby="modify-insurance-tenure-heading"
        >
          <h2 id="modify-insurance-tenure-heading" className={tenureStyles.srOnly}>
            {INSURANCE_TENURE_OPTIONS_HEADING}
          </h2>

          <div
            className={tenureStyles.optionList}
            role="radiogroup"
            aria-label={INSURANCE_TENURE_OPTIONS_HEADING}
          >
            {pricedOptions.map((option, index) => (
              <div
                key={option.id}
                className={cn(tenureStyles.optionListItem, "payment-success-stagger")}
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
              tenureStyles.compareLink,
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

      <div className={cn(tenureStyles.footer, "footer-elevated")}>
        <div className={tenureStyles.footerInner}>
          <PrimaryCta onClick={onContinue} loading={loading} className={tenureStyles.cta}>
            {MODIFY_SELECTION_INSURANCE_CONTINUE_CTA}
          </PrimaryCta>
        </div>
      </div>

      <InsuranceTenureCompareBottomSheet
        open={compareSheetOpen}
        onClose={() => setCompareSheetOpen(false)}
      />
    </div>
  );
}
