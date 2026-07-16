"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ShiviCallSheet } from "@/components/concierge/ShiviCallSheet";
import { GetHelpPillButton } from "@/components/kyc/GetHelpPillButton";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import { BankLoanCard } from "@/components/payment/BankLoanCard";
import { BankLoanDetailBottomSheet } from "@/components/payment/BankLoanDetailBottomSheet";
import { BANK_LOAN_TERMS, bankLoanTermsForId } from "@/components/payment/bank-loan-terms";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { resolveBankIdToken, resolveBankNameToken } from "@/lib/payment/bank-selection-urls";

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

  const onConfirm = useCallback(
    (bankId: string) => {
      setOpenBankId(null);
      if (echoTemplate) {
        writeConciergeEcho(resolveBankNameToken(echoTemplate, bankLoanTermsForId(bankId).name));
      }
      router.push(resolveBankIdToken(nextTemplate, bankId));
    },
    [echoTemplate, nextTemplate, router],
  );

  return (
    <div className="min-h-dvh bg-white font-sans">
      <KycTopNavHeader
        surface="white"
        endSlot={<GetHelpPillButton onClick={() => setCallSheetOpen(true)} />}
      />

      <main className="mx-auto flex w-full max-w-[640px] flex-col px-5 pb-12 pt-2">
        <h1 className="payment-success-stagger text-2xl font-semibold leading-8 tracking-[-0.2px] text-[#121212]">
          Here's who's ready to finance your car
        </h1>
        <p
          className="payment-success-stagger mt-2 text-sm leading-5 text-[#4b4b4b]"
          style={{ animationDelay: "60ms" }}
        >
          Take a look at the rates and terms, then let me know who you'd like to go with.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {BANK_LOAN_TERMS.map((bank, index) => (
            <div
              key={bank.id}
              className="payment-success-stagger"
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
