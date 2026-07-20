"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";
import {
  BANK_DISBURSEMENT_INR,
  DEFAULT_TENURE_MONTHS,
} from "@/components/payment/loan-amount-demo-constants";
import { BANK_SHEET_OPTIONS } from "@/components/payment/payment-choose-assets";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { estimateMonthlyEmiInr, parseAnnualRateFromLabel } from "@/lib/loan-emi";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import { bankIdToken, bankNameToken, bankSelectionPath } from "@/lib/payment/bank-selection-urls";
import styles from "./LoanRejectedScreen.module.scss";


function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/** Best-rate partner bank that isn't the one that declined. */
function pickAlternativeBank(rejectedId: string) {
  const candidates = BANK_SHEET_OPTIONS.filter((bank) => bank.id !== rejectedId);
  return [...candidates].sort(
    (a, b) => parseAnnualRateFromLabel(a.rate) - parseAnnualRateFromLabel(b.rate),
  )[0];
}

/**
 * Bank declined — the journey's most likely real-world failure, handled the
 * way every other car-buying experience doesn't: dignity first, a concrete
 * pre-approved alternative, zero rework, and the car never at risk.
 */
export function LoanRejectedScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rejected = useMemo(
    () => bankForQueryParam(searchParams.get("bank")),
    [searchParams],
  );
  const alt = useMemo(() => pickAlternativeBank(rejected.id), [rejected.id]);
  const altEmi = useMemo(
    () =>
      estimateMonthlyEmiInr(
        BANK_DISBURSEMENT_INR,
        DEFAULT_TENURE_MONTHS,
        parseAnnualRateFromLabel(alt.rate),
      ),
    [alt.rate],
  );

  const switchToBank = useCallback(
    (bankId: string, bankName: string) => {
      writeConciergeEcho(`Switch me to ${bankName}`);
      router.push(`/payment/loan-processing?bank=${encodeURIComponent(bankId)}`);
    },
    [router],
  );

  const chooseAnotherBankHref = useMemo(
    () =>
      bankSelectionPath({
        next: `/payment/loan-processing?bank=${bankIdToken()}`,
        echo: `Switch me to ${bankNameToken()}`,
      }),
    [],
  );

  return (
    <ConciergeTurnShell
      says={[
        `${rejected.name} wasn't able to approve this loan.`,
        `That's on their lending criteria, not on you. ${alt.name} has already pre-approved you at ${alt.rate} for the same amount, and your one free switch covers this move. Nothing restarts, your application carries over and only the bank changes.`,
      ]}
      artifact={
        <div className={OVERLAY_GLASS_CARD_CLASS}>
          <div className={styles.flex_0}>
            <span className={styles.relative_1}>
              <Image
                src={alt.logoSrc}
                alt=""
                fill
                className={styles.object_contain_2}
                unoptimized
                sizes="36px"
              />
            </span>
            <div className={styles.min_w_0_3}>
              <p className={styles.text_base_4}>{alt.name}</p>
              <p className={styles.text_xs_5}>Same loan, better rate</p>
            </div>
            <span className={styles.shrink_0_6}>
              Pre-approved
            </span>
          </div>
          <div className={styles.border_t_7}>
            <div className={styles.flex_8}>
              <div className={styles.flex_9}>
                <span className={styles.text_sm_10}>Interest rate</span>
                <span className={styles.text_sm_11}>{alt.rate}</span>
              </div>
              <div className={styles.flex_9}>
                <span className={styles.text_sm_10}>EMI from</span>
                <span className={styles.text_sm_12}>
                  {formatInr(altEmi)}/mo
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      replies={[
        {
          label: `Switch to ${alt.name} (free)`,
          onClick: () => switchToBank(alt.id, alt.name),
          echo: null,
        },
        {
          label: "Show me all bank options",
          kind: "soft",
          href: chooseAnotherBankHref,
          echo: null,
        },
      ]}
      callLabel="Rather talk it through? I can call you"
    />
  );
}
