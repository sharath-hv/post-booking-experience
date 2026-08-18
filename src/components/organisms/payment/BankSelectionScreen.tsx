"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ShiviCallSheet } from "@/components/organisms/ShiviCallSheet";
import { GetHelpPillButton } from "@/components/molecules/GetHelpPillButton";
import { TopNavHeader } from "@/components/organisms/TopNavHeader";
import { BankLoanCard } from "@/components/organisms/payment/BankLoanCard";
import { BankLoanDetailBottomSheet } from "@/components/organisms/payment/BankLoanDetailBottomSheet";
import {
  BANK_LOAN_TERMS,
  SHOW_PRE_APPROVED_LOAN_UI,
  bankLoanTermsForId,
} from "@/components/organisms/payment/bank-loan-terms";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { resolveBankIdToken, resolveBankNameToken } from "@/lib/payment/bank-selection-urls";
import styles from "./BankSelectionScreen.module.scss";


/** First card lands right after the heading; each next card follows by this much. */
const FIRST_CARD_DELAY_MS = 220;
const CARD_STEP_MS = 90;

/**
 * Bank selection — standalone full page (migrated from `BankSelectionBottomSheet`),
 * in the modify-selection style rather than a Shivi concierge turn: more room
 * in the first fold to actually compare banks, and a clear visual break from
 * the chat framing while you're still deciding. Once a bank is confirmed in
 * the detail sheet, the journey lands back on a concierge-style turn — the
 * `next` destination each caller supplies is a normal concierge page.
 *
 * One shared route serves every "pick a bank" moment in the journey (initial
 * choice, mid-flow change, post-rejection switch) — see `bank-selection-urls`.
 */
export function BankSelectionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openBankId, setOpenBankId] = useState<string | null>(null);
  const [callSheetOpen, setCallSheetOpen] = useState(false);

  const nextTemplate = searchParams.get("next") ?? "/payment/choose";
  const echoTemplate = searchParams.get("echo");

  const openBank = useMemo(
    () => (openBankId ? bankLoanTermsForId(openBankId) : null),
    [openBankId],
  );

  /** When enabled, pre-approved offers float to the top so the phone-number match is easy to spot. */
  const banks = useMemo(() => {
    if (!SHOW_PRE_APPROVED_LOAN_UI) return BANK_LOAN_TERMS;
    return [...BANK_LOAN_TERMS].sort(
      (a, b) => Number(Boolean(b.preApproved)) - Number(Boolean(a.preApproved)),
    );
  }, []);

  const onConfirm = useCallback(
    (bankId: string) => {
      if (echoTemplate) {
        writeConciergeEcho(resolveBankNameToken(echoTemplate, bankLoanTermsForId(bankId).name));
      }
      router.push(resolveBankIdToken(nextTemplate, bankId));
    },
    [echoTemplate, nextTemplate, router],
  );

  return (
    <div className={styles.min_h_dvh_0}>
      <TopNavHeader
        surface="white"
        solid
        endSlot={<GetHelpPillButton onClick={() => setCallSheetOpen(true)} />}
      />

      <main className={styles.mx_auto_1}>
        <h1 className={[styles.payment_success_stagger_2, "payment-success-stagger"].filter(Boolean).join(" ")}>
          {"Here's who's ready to finance your car"}
        </h1>
        <p
          className={[styles.payment_success_stagger_3, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: "60ms" }}
        >
          {"Take a look at the rates and terms, then let me know who you'd like to go with."}
        </p>

        <div className={styles.mt_8_4}>
          {banks.map((bank, index) => (
            <div
              key={bank.id}
              className={[styles.payment_success_stagger_5, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{ animationDelay: `${FIRST_CARD_DELAY_MS + index * CARD_STEP_MS}ms` }}
            >
              <BankLoanCard bank={bank} onOpen={() => setOpenBankId(bank.id)} />
            </div>
          ))}
        </div>
      </main>

      <BankLoanDetailBottomSheet
        bank={openBank}
        onClose={() => setOpenBankId(null)}
        onConfirm={onConfirm}
      />

      <ShiviCallSheet open={callSheetOpen} onClose={() => setCallSheetOpen(false)} />
    </div>
  );
}
