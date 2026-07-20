"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { InsuranceTenureCompareBottomSheet } from "@/components/payment/InsuranceTenureCompareBottomSheet";
import {
  INSURANCE_TENURE_DIFFERENCE_CTA,
  INSURANCE_TENURE_OPTIONS,
  type InsuranceTenureId,
  type InsuranceTenureOption,
} from "@/components/payment/insurance-coverage-content";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";
import { buildInsurancePremiumCheckoutHref } from "@/lib/paymentUrls";
import styles from "./ChooseInsuranceTenureScreen.module.scss";


function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function RadioIndicator({ selected }: { selected: boolean }) {
  const src = selected ? PAYMENT_CHOOSE_ASSETS.radioOn : PAYMENT_CHOOSE_ASSETS.radioOff;

  return (
    <span className={styles.relative_0} aria-hidden>
      <Image src={src} alt="" fill className={styles.object_contain_1} unoptimized sizes="16px" />
    </span>
  );
}

function TenureCard({
  option,
  selected,
  onSelect,
}: {
  option: InsuranceTenureOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const savings = option.compareAtInr - option.premiumInr;
  const isStandard = option.id === "1+3";

  return (
    <button
      type="button"
      id={`insurance-tenure-${option.id}`}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(styles.w_full_0, "card-elevated", selected ? styles.border_selected_0 : styles.border_transparent_0)}
    >
      <div className={styles.flex_2}>
        <div className={styles.relative_3}>
          <Image
            src={option.illustrationSrc}
            alt=""
            fill
            className={styles.object_contain_1}
            unoptimized
            sizes="40px"
          />
        </div>
        <div className={styles.min_w_0_4}>
          <span className={styles.inline_flex_5}>
            {option.badge}
          </span>
          <p className={styles.mt_1_6}>{option.label}</p>
        </div>
        <span className={styles.mt_1_7}>
          <RadioIndicator selected={selected} />
        </span>
      </div>

      <p className={styles.mt_2_5_8}>{option.blurb}</p>

      <div className={styles.mt_3_9}>
        <div className={styles.min_w_0_10}>
          <p className={styles.text_sm_11}>
            {option.ownDamageYears} {option.ownDamageYears === 1 ? "year" : "years"}
          </p>
          <p className={styles.mt_0_5_12}>Zero depreciation cover</p>
        </div>
        <div className={styles.min_w_0_13}>
          <p className={styles.text_sm_11}>
            {option.thirdPartyYears} {option.thirdPartyYears === 1 ? "year" : "years"}
          </p>
          <p className={styles.mt_0_5_12}>Third party cover</p>
        </div>
      </div>

      <div className={styles.mt_3_14}>
        {option.upgradeBlurb ? (
          <p className={styles.mb_3_15}>{option.upgradeBlurb}</p>
        ) : null}
        <p className={styles.flex_16}>
          <span className={styles.text_base_17}>
            {formatInr(option.premiumInr)}
          </span>
          {!isStandard ? (
            <>
              <span className={styles.text_sm_18}>
                {formatInr(option.compareAtInr)}
              </span>
              <span className={styles.text_xs_19}>
                Save {formatInr(savings)}
              </span>
            </>
          ) : null}
        </p>
      </div>
    </button>
  );
}

/**
 * Tenure selection step — user picks 1+3 (standard) or 3+3 (extended)
 * before paying the insurance premium.
 */
export function ChooseInsuranceTenureScreen() {
  const searchParams = useSearchParams();
  const [tenureId, setTenureId] = useState<InsuranceTenureId>("1+3");
  const [compareSheetOpen, setCompareSheetOpen] = useState(false);

  const selected = useMemo(
    () => INSURANCE_TENURE_OPTIONS.find((o) => o.id === tenureId)!,
    [tenureId],
  );

  const ctaHref = useMemo(
    () =>
      buildInsurancePremiumCheckoutHref(selected.premiumInr, {
        bank: searchParams.get("bank"),
        loanAmount: searchParams.get("loan_amount"),
        tenure: tenureId,
      }),
    [searchParams, tenureId, selected.premiumInr],
  );

  const says = useMemo(
    () => [
      "One last choice before you pay: how long do you want this locked in?",
      "Extended cover locks in your premium for 3 years. No renewals, no rate hikes. Most people who go extended are glad they did.",
    ],
    [],
  );

  return (
    <>
      <ConciergeTurnShell
        says={says}
        artifact={
          <div className={styles.flex_20}>
            {INSURANCE_TENURE_OPTIONS.map((option) => (
              <TenureCard
                key={option.id}
                option={option}
                selected={option.id === tenureId}
                onSelect={() => setTenureId(option.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => setCompareSheetOpen(true)}
              className={[styles.tertiary_cta_21, "tertiary-cta"].filter(Boolean).join(" ")}
            >
              {INSURANCE_TENURE_DIFFERENCE_CTA}
            </button>
          </div>
        }
        replies={[
          {
            label: `Pay ${formatInr(selected.premiumInr)}`,
            href: ctaHref,
            kind: "primary",
            echo: null,
          },
        ]}
        callLabel="Coverage questions? I can call you"
        showMenu
      />

      <InsuranceTenureCompareBottomSheet
        open={compareSheetOpen}
        onClose={() => setCompareSheetOpen(false)}
      />
    </>
  );
}
