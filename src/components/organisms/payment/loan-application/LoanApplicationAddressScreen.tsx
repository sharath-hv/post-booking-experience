"use client";

import { cn } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Checkbox } from "@/components/atoms/selection/Checkbox";
import { LoanApplicationApplicantEyebrow } from "@/components/organisms/payment/loan-application/LoanApplicationApplicantEyebrow";
import { LoanApplicationFixedCta } from "@/components/organisms/payment/loan-application/LoanApplicationFixedCta";
import { LoanApplicationFormField } from "@/components/organisms/payment/loan-application/LoanApplicationFormField";
import {
  LOAN_APPLICATION_FIELD_STACK_GAP_CLASS,
  LOAN_APPLICATION_MAIN_CLASS,
  LOAN_APPLICATION_SECTION_DIVIDER_CLASS,
  LOAN_APPLICATION_SECTION_GAP_CLASS,
  LOAN_APPLICATION_SECTION_LABEL_CLASS,
  LOAN_APPLICATION_STAGGER_MS,
  LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS,
  loanApplicationStaggerAfterCard,
} from "@/components/organisms/payment/loan-application/loan-application-layout";
import { LoanApplicationPageStagger } from "@/components/organisms/payment/loan-application/LoanApplicationPageStagger";
import { useLoanApplicationApplicant } from "@/hooks/use-loan-application-applicant";
import { useLoanApplicationBank } from "@/hooks/use-loan-application-bank";
import { useLoanApplicationState } from "@/hooks/use-loan-application-state";
import type { LoanApplicationAddressFields } from "@/helpers/loan-application-state";
import { loanApplicationNextPath } from "@/helpers/loan-application-urls";
import styles from "./LoanApplicationAddressScreen.module.scss";


function isAddressComplete(address: LoanApplicationAddressFields) {
  return (
    address.pincode.trim().length >= 6 &&
    address.city.trim().length > 0 &&
    address.state.trim().length > 0 &&
    address.line1.trim().length > 0
  );
}

type AddressFieldsBlockProps = {
  prefix: string;
  value: LoanApplicationAddressFields;
  onChange: (next: LoanApplicationAddressFields) => void;
  /** Applied to the first field (PIN code) below a section label. */
  firstFieldClassName?: string;
};

function AddressFieldsBlock({
  prefix,
  value,
  onChange,
  firstFieldClassName = "",
}: AddressFieldsBlockProps) {
  const set =
    (key: keyof LoanApplicationAddressFields) => (field: string) =>
      onChange({ ...value, [key]: field });

  const field = {
    variant: "placeholder" as const,
  };

  return (
    <>
      <LoanApplicationFormField
        {...field}
        id={`${prefix}-pincode`}
        label="PIN code"
        value={value.pincode}
        onChange={set("pincode")}
        autoComplete="postal-code"
        className={[firstFieldClassName, styles.pincode_field].filter(Boolean).join(" ")}
      />

      <div className={[LOAN_APPLICATION_FIELD_STACK_GAP_CLASS, styles.city_row].filter(Boolean).join(" ")}>
        <LoanApplicationFormField
          {...field}
          id={`${prefix}-city`}
          label="City"
          value={value.city}
          onChange={set("city")}
          autoComplete="address-level2"
        />
        <LoanApplicationFormField
          {...field}
          id={`${prefix}-state`}
          label="State"
          value={value.state}
          onChange={set("state")}
          autoComplete="address-level1"
        />
      </div>

      <LoanApplicationFormField
        {...field}
        id={`${prefix}-address`}
        label="Address"
        value={value.line1}
        onChange={set("line1")}
        autoComplete="street-address"
        multiline
        className={LOAN_APPLICATION_FIELD_STACK_GAP_CLASS}
      />
    </>
  );
}

export function LoanApplicationAddressScreen() {
  const router = useRouter();
  const { bankId } = useLoanApplicationBank();
  const { state, hydrated, updateApplicant } = useLoanApplicationState();
  const { applicant, profile, showApplicantEyebrow, isCoApplicantPass } =
    useLoanApplicationApplicant(state);
  const [permanent, setPermanent] = useState(profile.address.permanent);
  const [current, setCurrent] = useState(profile.address.current);
  const [sameAsPermanent, setSameAsPermanent] = useState(
    profile.address.currentSameAsPermanent,
  );

  useEffect(() => {
    if (!hydrated) return;
    setPermanent(profile.address.permanent);
    setCurrent(profile.address.current);
    setSameAsPermanent(profile.address.currentSameAsPermanent);
  }, [hydrated, profile.address]);

  useEffect(() => {
    if (sameAsPermanent) setCurrent(permanent);
  }, [sameAsPermanent, permanent]);

  const effectiveCurrent = sameAsPermanent ? permanent : current;
  const canContinue = isAddressComplete(permanent) && isAddressComplete(effectiveCurrent);

  const onContinue = useCallback(() => {
    if (!canContinue) return;
    updateApplicant(applicant, {
      address: {
        permanent,
        current: effectiveCurrent,
        currentSameAsPermanent: sameAsPermanent,
      },
    });
    router.push(
      loanApplicationNextPath(bankId, "address", {
        applicant,
        includeCoApplicant: state.includeCoApplicant,
      }),
    );
  }, [
    applicant,
    bankId,
    canContinue,
    effectiveCurrent,
    permanent,
    router,
    sameAsPermanent,
    state.includeCoApplicant,
    updateApplicant,
  ]);

  const title = isCoApplicantPass
    ? "Where does your co-applicant live?"
    : "Where do you live? The bank wants it on file.";

  return (
    <>
      <main className={LOAN_APPLICATION_MAIN_CLASS}>
        <LoanApplicationPageStagger delayMs={LOAN_APPLICATION_STAGGER_MS.title}>
          <LoanApplicationApplicantEyebrow
            applicant={applicant}
            show={showApplicantEyebrow}
            title={title}
          />
        </LoanApplicationPageStagger>

        <LoanApplicationPageStagger
          delayMs={LOAN_APPLICATION_STAGGER_MS.subtitle}
          className={LOAN_APPLICATION_SECTION_GAP_CLASS}
        >
          <p className={LOAN_APPLICATION_SECTION_LABEL_CLASS}>Permanent address</p>
          <AddressFieldsBlock
            prefix="perm"
            value={permanent}
            onChange={setPermanent}
            firstFieldClassName={LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS}
          />
        </LoanApplicationPageStagger>

        <LoanApplicationPageStagger delayMs={loanApplicationStaggerAfterCard(1)}>
          <div className={LOAN_APPLICATION_SECTION_DIVIDER_CLASS} role="separator" />

          <p className={cn(LOAN_APPLICATION_SECTION_GAP_CLASS, LOAN_APPLICATION_SECTION_LABEL_CLASS)}>
            Current address
          </p>

          <label
            className={cn(LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS, styles.flex_1)}
          >
            <input
              type="checkbox"
              checked={sameAsPermanent}
              onChange={(e) => setSameAsPermanent(e.target.checked)}
              className={styles.sr_only_0}
            />
            <Checkbox checked={sameAsPermanent} size={20} />
            <span className={styles.text_sm_1}>
              Same as permanent address
            </span>
          </label>

          {!sameAsPermanent ? (
            <AddressFieldsBlock
              prefix="curr"
              value={current}
              onChange={setCurrent}
              firstFieldClassName={LOAN_APPLICATION_FIELD_STACK_GAP_CLASS}
            />
          ) : null}
        </LoanApplicationPageStagger>
      </main>

      <LoanApplicationFixedCta
        label="Continue"
        onClick={onContinue}
        disabled={!canContinue}
        staggerDelayMs={loanApplicationStaggerAfterCard(2)}
      />
    </>
  );
}
