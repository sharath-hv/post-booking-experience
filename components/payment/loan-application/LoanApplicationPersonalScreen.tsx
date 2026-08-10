"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

import { LoanApplicationApplicantEyebrow } from "@/components/payment/loan-application/LoanApplicationApplicantEyebrow";
import { LoanApplicationFixedCta } from "@/components/payment/loan-application/LoanApplicationFixedCta";
import { LoanApplicationFormField } from "@/components/payment/loan-application/LoanApplicationFormField";
import {
  LOAN_APPLICATION_FIELD_GAP_CLASS,
  LOAN_APPLICATION_FIELD_STACK_GAP_CLASS,
  LOAN_APPLICATION_MAIN_CLASS,
  LOAN_APPLICATION_SECTION_DIVIDER_CLASS,
  LOAN_APPLICATION_SECTION_GAP_CLASS,
  LOAN_APPLICATION_SECTION_LABEL_CLASS,
  LOAN_APPLICATION_STAGGER_MS,
  LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS,
  loanApplicationStaggerAfterCard,
} from "@/components/payment/loan-application/loan-application-layout";
import { LoanApplicationPageStagger } from "@/components/payment/loan-application/LoanApplicationPageStagger";
import { LoanApplicationRelationBottomSheet } from "@/components/payment/loan-application/LoanApplicationRelationBottomSheet";
import { LoanApplicationSegmentChip } from "@/components/payment/loan-application/LoanApplicationSegmentChip";
import { useLoanApplicationApplicant } from "@/components/payment/loan-application/use-loan-application-applicant";
import { useLoanApplicationBank } from "@/components/payment/loan-application/use-loan-application-bank";
import { useLoanApplicationState } from "@/components/payment/loan-application/use-loan-application-state";
import {
  LOAN_APPLICATION_CO_APPLICANT_RELATION_OPTIONS,
  LOAN_APPLICATION_EMPLOYMENT_OPTIONS,
  type LoanApplicationCoApplicantRelation,
  type LoanApplicationEmploymentType,
} from "@/lib/loan-application-content";
import type { LoanApplicationOfficialAddress } from "@/lib/loan-application-state";
import { loanApplicationNextPath } from "@/lib/loan-application-urls";
import styles from "./LoanApplicationPersonalScreen.module.scss";

const MOTHER_NAME_HINT = "Required by the bank for verification";

function isOfficialAddressComplete(address: LoanApplicationOfficialAddress) {
  return (
    address.pincode.trim().length >= 6 &&
    address.city.trim().length > 0 &&
    address.state.trim().length > 0 &&
    address.address.trim().length > 0
  );
}

export function LoanApplicationPersonalScreen() {
  const router = useRouter();
  const { bankId } = useLoanApplicationBank();
  const { state, hydrated, updateApplicant } = useLoanApplicationState();
  const { applicant, profile, showApplicantEyebrow, isCoApplicantPass } =
    useLoanApplicationApplicant(state);
  const [fullName, setFullName] = useState(profile.personal.fullName);
  const [relationToPrimary, setRelationToPrimary] = useState<
    LoanApplicationCoApplicantRelation | null
  >(profile.personal.relationToPrimary);
  const [relationSheetOpen, setRelationSheetOpen] = useState(false);
  const [employmentType, setEmploymentType] = useState<LoanApplicationEmploymentType | null>(
    profile.personal.employmentType,
  );
  const [email, setEmail] = useState(profile.personal.email);
  const [motherName, setMotherName] = useState(profile.personal.motherName);
  const [spouseName, setSpouseName] = useState(profile.personal.spouseName);
  const [officialEmail, setOfficialEmail] = useState(profile.personal.work.officialEmail);
  const [employerName, setEmployerName] = useState(profile.personal.work.employerName);
  const [officialAddress, setOfficialAddress] = useState(profile.personal.work.officialAddress);

  useEffect(() => {
    if (!hydrated) return;
    setFullName(profile.personal.fullName);
    setRelationToPrimary(profile.personal.relationToPrimary);
    setEmploymentType(profile.personal.employmentType);
    setEmail(profile.personal.email);
    setMotherName(profile.personal.motherName);
    setSpouseName(profile.personal.spouseName);
    setOfficialEmail(profile.personal.work.officialEmail);
    setEmployerName(profile.personal.work.employerName);
    setOfficialAddress(profile.personal.work.officialAddress);
  }, [hydrated, profile.personal]);

  const relationLabel =
    LOAN_APPLICATION_CO_APPLICANT_RELATION_OPTIONS.find(
      (option) => option.id === relationToPrimary,
    )?.label ?? null;

  const setOfficialField =
    (key: keyof LoanApplicationOfficialAddress) => (value: string) =>
      setOfficialAddress((prev) => ({ ...prev, [key]: value }));

  const coApplicantIdentityComplete =
    !isCoApplicantPass ||
    (fullName.trim().length > 0 && relationToPrimary != null && employmentType != null);

  const canContinue =
    coApplicantIdentityComplete &&
    email.trim().length > 0 &&
    motherName.trim().length > 0 &&
    officialEmail.trim().length > 0 &&
    employerName.trim().length > 0 &&
    isOfficialAddressComplete(officialAddress);

  const onContinue = useCallback(() => {
    if (!canContinue) return;
    updateApplicant(applicant, {
      personal: {
        fullName: isCoApplicantPass ? fullName.trim() : profile.personal.fullName,
        relationToPrimary: isCoApplicantPass
          ? relationToPrimary
          : profile.personal.relationToPrimary,
        employmentType: isCoApplicantPass
          ? employmentType
          : profile.personal.employmentType,
        email: email.trim(),
        motherName: motherName.trim(),
        spouseName: spouseName.trim(),
        work: {
          officialEmail: officialEmail.trim(),
          employerName: employerName.trim(),
          officialAddress: {
            pincode: officialAddress.pincode.trim(),
            city: officialAddress.city.trim(),
            state: officialAddress.state.trim(),
            address: officialAddress.address.trim(),
          },
        },
      },
    });
    router.push(
      loanApplicationNextPath(bankId, "personal", {
        applicant,
        includeCoApplicant: state.includeCoApplicant,
      }),
    );
  }, [
    applicant,
    bankId,
    canContinue,
    email,
    employerName,
    employmentType,
    fullName,
    isCoApplicantPass,
    motherName,
    officialAddress,
    officialEmail,
    profile.personal.employmentType,
    profile.personal.fullName,
    profile.personal.relationToPrimary,
    relationToPrimary,
    router,
    spouseName,
    state.includeCoApplicant,
    updateApplicant,
  ]);

  const field = {
    variant: "placeholder" as const,
  };

  const title = isCoApplicantPass
    ? "Now a bit about your co-applicant."
    : "Now a bit about you. The bank insists.";

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
          {isCoApplicantPass ? (
            <>
              <LoanApplicationFormField
                {...field}
                id="loan-app-co-full-name"
                label="Full name"
                value={fullName}
                onChange={setFullName}
                autoComplete="name"
              />

              <label
                id="loan-app-co-relation-label"
                className={cn(
                  LOAN_APPLICATION_FIELD_STACK_GAP_CLASS,
                  LOAN_APPLICATION_SECTION_LABEL_CLASS,
                  styles.select_header,
                )}
              >
                Relation with primary applicant
              </label>
              <div className={cn(LOAN_APPLICATION_FIELD_GAP_CLASS, styles.select_field)}>
                <button
                  type="button"
                  id="loan-app-co-relation"
                  className={cn(styles.select_wrap, styles.select_wrap_idle)}
                  aria-haspopup="dialog"
                  aria-expanded={relationSheetOpen}
                  aria-labelledby="loan-app-co-relation-label"
                  onClick={() => setRelationSheetOpen(true)}
                >
                  <span
                    className={cn(
                      styles.select_value,
                      relationLabel == null ? styles.select_value_placeholder : "",
                    )}
                  >
                    {relationLabel ?? "Select relation"}
                  </span>
                  <span className={styles.select_chevron} aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <p
                className={cn(
                  LOAN_APPLICATION_FIELD_STACK_GAP_CLASS,
                  LOAN_APPLICATION_SECTION_LABEL_CLASS,
                )}
              >
                Employment type
              </p>
              <div className={cn(LOAN_APPLICATION_FIELD_GAP_CLASS, styles.chip_grid)}>
                {LOAN_APPLICATION_EMPLOYMENT_OPTIONS.map((option) => (
                  <LoanApplicationSegmentChip
                    key={option.id}
                    label={option.label}
                    selected={employmentType === option.id}
                    onClick={() => setEmploymentType(option.id)}
                    size="employment"
                  />
                ))}
              </div>

              <LoanApplicationFormField
                {...field}
                id="loan-app-personal-email"
                label="Personal email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                className={LOAN_APPLICATION_FIELD_STACK_GAP_CLASS}
              />
            </>
          ) : (
            <LoanApplicationFormField
              {...field}
              id="loan-app-personal-email"
              label="Personal email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
          )}

          <LoanApplicationFormField
            {...field}
            id="loan-app-mother"
            label="Mother's name"
            value={motherName}
            onChange={setMotherName}
            autoComplete="off"
            hint={MOTHER_NAME_HINT}
            className={LOAN_APPLICATION_FIELD_STACK_GAP_CLASS}
          />

          <LoanApplicationFormField
            {...field}
            id="loan-app-spouse"
            label="Spouse (if married)"
            value={spouseName}
            onChange={setSpouseName}
            autoComplete="off"
            className={LOAN_APPLICATION_FIELD_STACK_GAP_CLASS}
          />
        </LoanApplicationPageStagger>

        <LoanApplicationPageStagger delayMs={LOAN_APPLICATION_STAGGER_MS.card}>
          <div className={LOAN_APPLICATION_SECTION_DIVIDER_CLASS} role="separator" />

          <p className={cn(LOAN_APPLICATION_SECTION_GAP_CLASS, LOAN_APPLICATION_SECTION_LABEL_CLASS)}>
            Work details
          </p>

          <LoanApplicationFormField
            {...field}
            id="loan-app-official-email"
            label="Official email"
            type="email"
            value={officialEmail}
            onChange={setOfficialEmail}
            autoComplete="email"
            className={LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS}
          />

          <LoanApplicationFormField
            {...field}
            id="loan-app-office"
            label="Office name"
            value={employerName}
            onChange={setEmployerName}
            autoComplete="organization"
            className={LOAN_APPLICATION_FIELD_STACK_GAP_CLASS}
          />

          <p
            className={cn(LOAN_APPLICATION_FIELD_STACK_GAP_CLASS, LOAN_APPLICATION_SECTION_LABEL_CLASS)}
          >
            Official address
          </p>

          <LoanApplicationFormField
            {...field}
            id="loan-app-official-pin"
            label="PIN code"
            value={officialAddress.pincode}
            onChange={setOfficialField("pincode")}
            autoComplete="postal-code"
            className={[LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS, styles.pincode_field].filter(Boolean).join(" ")}
          />

          <div
            className={[LOAN_APPLICATION_FIELD_STACK_GAP_CLASS, styles.city_row].filter(Boolean).join(" ")}
          >
            <LoanApplicationFormField
              {...field}
              id="loan-app-official-city"
              label="City"
              value={officialAddress.city}
              onChange={setOfficialField("city")}
              autoComplete="address-level2"
            />
            <LoanApplicationFormField
              {...field}
              id="loan-app-official-state"
              label="State"
              value={officialAddress.state}
              onChange={setOfficialField("state")}
              autoComplete="address-level1"
            />
          </div>

          <LoanApplicationFormField
            {...field}
            id="loan-app-official-address"
            label="Address"
            value={officialAddress.address}
            onChange={setOfficialField("address")}
            autoComplete="street-address"
            multiline
            className={LOAN_APPLICATION_FIELD_STACK_GAP_CLASS}
          />
        </LoanApplicationPageStagger>
      </main>

      <LoanApplicationFixedCta
        label="Continue"
        onClick={onContinue}
        disabled={!canContinue}
        staggerDelayMs={loanApplicationStaggerAfterCard(2)}
      />

      {isCoApplicantPass ? (
        <LoanApplicationRelationBottomSheet
          open={relationSheetOpen}
          value={relationToPrimary}
          onClose={() => setRelationSheetOpen(false)}
          onSelect={(relation) => {
            setRelationToPrimary(relation);
            setRelationSheetOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
