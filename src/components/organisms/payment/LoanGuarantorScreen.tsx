"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";

import { DocumentUploadDocumentCards } from "@/components/organisms/DocumentUploadDocumentCards";
import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import { UploadSourceBottomSheet } from "@/components/organisms/UploadSourceBottomSheet";
import { LoanApplicationFormField } from "@/components/organisms/payment/loan-application/LoanApplicationFormField";
import { bankForQueryParam } from "@/components/organisms/payment/acko-drive-finance-bank";
import { KYC_MOCK_UPLOAD_NAMES, type KycUploadSource } from "@/constants/kyc-upload-content";
import { LOAN_APPLICATION_IDENTITY_DOCUMENTS } from "@/constants/loan-application-documents-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/constants/modify-selection-content";
import {
  createEmptyLoanApplicationDocuments,
  type LoanApplicationDocumentKind,
  type LoanApplicationDocumentsState,
  type LoanApplicationDocumentUploadSource,
  type LoanApplicationUploadedFile,
} from "@/helpers/loan-application-documents-state";
import {
  modifySelectionCardStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/helpers/modify-selection-stagger";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { loanUnderReviewPath } from "@/helpers/loan-application-urls";
import { cn } from "@/utils/utils";
import styles from "./LoanGuarantorScreen.module.scss";

const {
  title: STAGGER_TITLE_MS,
  subtext: STAGGER_SUBTEXT_MS,
  firstCard: STAGGER_FIRST_FIELD_MS,
} = MODIFY_SELECTION_STAGGER_MS;

const IDENTITY_CARD_DEFINITIONS = LOAN_APPLICATION_IDENTITY_DOCUMENTS.map((doc) => ({
  kind: doc.kind,
  title: doc.title,
  description: doc.description,
  allowMultiple: doc.allowMultiple ?? true,
}));

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function isEmailLike(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function nextMockFilename(uploadIndex: number): string {
  return KYC_MOCK_UPLOAD_NAMES[uploadIndex % KYC_MOCK_UPLOAD_NAMES.length];
}

/**
 * Guarantor details after a conditional bank approval path.
 * Primary applicant data stays as-is; we only collect the guarantor here.
 * Page chrome matches change-selection; identity uploads match loan application.
 */
export function LoanGuarantorScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bank = useMemo(
    () => bankForQueryParam(searchParams.get("bank")),
    [searchParams],
  );

  const [fullName, setFullName] = useState("Rohan Mehta");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("rohan.mehta@gmail.com");
  const [uploads, setUploads] = useState<LoanApplicationDocumentsState>(
    createEmptyLoanApplicationDocuments,
  );
  const mockUploadCounterRef = useRef(0);
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<LoanApplicationDocumentKind | null>(
    null,
  );

  const identityUploadsComplete =
    uploads.aadhaar.length > 0 && uploads.pan.length > 0;

  const canSubmit =
    fullName.trim().length > 1 &&
    digitsOnly(phone).length === 10 &&
    isEmailLike(email) &&
    identityUploadsComplete;

  const onSubmit = useCallback(() => {
    if (!canSubmit) return;
    writeConciergeEcho("I've shared the guarantor details");
    router.push(loanUnderReviewPath(bank.id));
  }, [bank.id, canSubmit, router]);

  const openSourceSheet = useCallback((kind: LoanApplicationDocumentKind) => {
    setActiveDocument(kind);
    setSourceSheetOpen(true);
  }, []);

  const appendUpload = useCallback(
    (kind: LoanApplicationDocumentKind, source: LoanApplicationDocumentUploadSource) => {
      const uploadIndex = mockUploadCounterRef.current;
      mockUploadCounterRef.current += 1;
      const newFile: LoanApplicationUploadedFile = {
        id: `${kind}-${source}-${uploadIndex}-${Date.now()}`,
        name: nextMockFilename(uploadIndex),
        source,
      };
      setUploads((current) => ({
        ...current,
        [kind]: kind === "pan" ? [newFile] : [...current[kind], newFile],
      }));
    },
    [],
  );

  const handleMockUpload = useCallback(
    (source: KycUploadSource) => {
      if (activeDocument == null || source === "digilocker") return;
      appendUpload(activeDocument, source);
    },
    [activeDocument, appendUpload],
  );

  const handleRemove = useCallback((kind: string, fileId: string) => {
    if (kind !== "aadhaar" && kind !== "pan") return;
    setUploads((current) => ({
      ...current,
      [kind]: current[kind].filter((file) => file.id !== fileId),
    }));
  }, []);

  const subline = `Share someone who can stand guarantee for this loan. ${bank.name} will use these details to reassess your application.`;

  const fields = [
    {
      id: "guarantor-full-name",
      label: "Full name",
      value: fullName,
      onChange: setFullName,
      autoComplete: "name" as const,
    },
    {
      id: "guarantor-phone",
      label: "Phone number",
      type: "tel" as const,
      value: phone,
      onChange: (value: string) => setPhone(digitsOnly(value).slice(0, 10)),
      autoComplete: "tel" as const,
    },
    {
      id: "guarantor-email",
      label: "Email",
      type: "email" as const,
      value: email,
      onChange: setEmail,
      autoComplete: "email" as const,
    },
  ];

  const uploadStaggerBase = modifySelectionCardStaggerDelay(
    fields.length,
    STAGGER_FIRST_FIELD_MS,
  );

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <StandaloneScreenHeader />

      <main className={styles.main}>
        <PageLeadHeading
          title={`Guarantor details for ${bank.name}`}
          subline={subline}
          titleDelayMs={STAGGER_TITLE_MS}
          sublineDelayMs={STAGGER_SUBTEXT_MS}
        />

        <div className={styles.fields}>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={cn(styles.fieldItem, "payment-success-stagger")}
              style={{
                animationDelay: `${modifySelectionCardStaggerDelay(index, STAGGER_FIRST_FIELD_MS)}ms`,
              }}
            >
              <LoanApplicationFormField
                id={field.id}
                label={field.label}
                type={field.type}
                value={field.value}
                onChange={field.onChange}
                autoComplete={field.autoComplete}
              />
            </div>
          ))}
        </div>

        <section
          className={styles.uploads}
          aria-label="Guarantor identity documents"
        >
          <DocumentUploadDocumentCards
            documents={IDENTITY_CARD_DEFINITIONS}
            getFiles={(kind) => uploads[kind as LoanApplicationDocumentKind] ?? []}
            onUploadClick={(kind) => openSourceSheet(kind as LoanApplicationDocumentKind)}
            onRemove={handleRemove}
            wrapCard={(kind, card) => {
              const index = LOAN_APPLICATION_IDENTITY_DOCUMENTS.findIndex(
                (doc) => doc.kind === kind,
              );
              return (
                <div
                  className={cn(styles.fieldItem, "payment-success-stagger")}
                  style={{
                    animationDelay: `${uploadStaggerBase + index * MODIFY_SELECTION_STAGGER_MS.cardStep}ms`,
                  }}
                >
                  {card}
                </div>
              );
            }}
          />
        </section>
      </main>

      <div className={cn(styles.footer, "footer-elevated")}>
        <div className={styles.footerInner}>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className={cn(styles.cta, "primary-cta")}
          >
            Submit guarantor details
          </button>
        </div>
      </div>

      <UploadSourceBottomSheet
        open={sourceSheetOpen}
        onClose={() => setSourceSheetOpen(false)}
        onSelect={handleMockUpload}
        includeDigilocker={false}
      />
    </div>
  );
}
