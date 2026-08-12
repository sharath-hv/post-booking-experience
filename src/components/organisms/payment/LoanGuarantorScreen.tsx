"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { GetHelpPillButton } from "@/components/molecules/GetHelpPillButton";
import { ShiviCallSheet } from "@/components/organisms/ShiviCallSheet";
import { TopNavHeader } from "@/components/organisms/TopNavHeader";
import { LoanApplicationFixedCta } from "@/components/organisms/payment/loan-application/LoanApplicationFixedCta";
import { LoanApplicationFormField } from "@/components/organisms/payment/loan-application/LoanApplicationFormField";
import {
  LOAN_APPLICATION_FIELD_STACK_GAP_CLASS,
  LOAN_APPLICATION_MAIN_CLASS,
  LOAN_APPLICATION_PAGE_TITLE_CLASS,
  LOAN_APPLICATION_STAGGER_MS,
  LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS,
} from "@/components/organisms/payment/loan-application/loan-application-layout";
import { LoanApplicationPageStagger } from "@/components/organisms/payment/loan-application/LoanApplicationPageStagger";
import { bankForQueryParam } from "@/components/organisms/payment/acko-drive-finance-bank";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { loanUnderReviewPath } from "@/helpers/loan-application-urls";
import { cn } from "@/utils/utils";
import styles from "./LoanGuarantorScreen.module.scss";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function isEmailLike(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPanLike(value: string) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(value.trim());
}

/**
 * Guarantor details after a conditional bank approval path.
 * Primary applicant data stays as-is; we only collect the guarantor here.
 */
export function LoanGuarantorScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bank = useMemo(
    () => bankForQueryParam(searchParams.get("bank")),
    [searchParams],
  );
  const [callSheetOpen, setCallSheetOpen] = useState(false);

  const [fullName, setFullName] = useState("Rohan Mehta");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("rohan.mehta@gmail.com");
  const [pan, setPan] = useState("ABCDE1234F");
  const [aadhaar, setAadhaar] = useState("123412341234");

  const canSubmit =
    fullName.trim().length > 1 &&
    digitsOnly(phone).length === 10 &&
    isEmailLike(email) &&
    isPanLike(pan) &&
    digitsOnly(aadhaar).length === 12;

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  const onSubmit = useCallback(() => {
    if (!canSubmit) return;
    writeConciergeEcho("I've shared the guarantor details");
    router.push(loanUnderReviewPath(bank.id));
  }, [bank.id, canSubmit, router]);

  return (
    <div className={styles.shell}>
      <div className={styles.inner}>
        <TopNavHeader
          onBack={onBack}
          endSlot={
            <GetHelpPillButton onClick={() => setCallSheetOpen(true)} />
          }
        />

        <main className={cn(LOAN_APPLICATION_MAIN_CLASS, styles.main)}>
          <LoanApplicationPageStagger delayMs={LOAN_APPLICATION_STAGGER_MS.title}>
            <h1 className={LOAN_APPLICATION_PAGE_TITLE_CLASS}>
              Guarantor details for {bank.name}
            </h1>
          </LoanApplicationPageStagger>

          <LoanApplicationPageStagger
            delayMs={LOAN_APPLICATION_STAGGER_MS.subtitle}
            className={cn(
              LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS,
              styles.subtitle,
            )}
          >
            <p>
              Share someone who can stand guarantee for this loan. {bank.name}{" "}
              will use these details to reassess your application.
            </p>
          </LoanApplicationPageStagger>

          <LoanApplicationPageStagger
            delayMs={LOAN_APPLICATION_STAGGER_MS.card}
            className={cn(
              LOAN_APPLICATION_FIELD_STACK_GAP_CLASS,
              styles.fields,
            )}
          >
            <LoanApplicationFormField
              id="guarantor-full-name"
              label="Full name"
              value={fullName}
              onChange={setFullName}
              autoComplete="name"
            />
            <LoanApplicationFormField
              id="guarantor-phone"
              label="Phone number"
              type="tel"
              value={phone}
              onChange={(value) => setPhone(digitsOnly(value).slice(0, 10))}
              autoComplete="tel"
            />
            <LoanApplicationFormField
              id="guarantor-email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
            <LoanApplicationFormField
              id="guarantor-pan"
              label="PAN"
              value={pan}
              onChange={(value) => setPan(value.toUpperCase().slice(0, 10))}
              autoComplete="off"
            />
            <LoanApplicationFormField
              id="guarantor-aadhaar"
              label="Aadhaar"
              type="tel"
              value={aadhaar}
              onChange={(value) => setAadhaar(digitsOnly(value).slice(0, 12))}
              autoComplete="off"
            />
          </LoanApplicationPageStagger>
        </main>

        <LoanApplicationFixedCta
          label="Submit guarantor details"
          onClick={onSubmit}
          disabled={!canSubmit}
          staggerDelayMs={LOAN_APPLICATION_STAGGER_MS.cta}
        />
      </div>

      <ShiviCallSheet
        open={callSheetOpen}
        onClose={() => setCallSheetOpen(false)}
      />
    </div>
  );
}
