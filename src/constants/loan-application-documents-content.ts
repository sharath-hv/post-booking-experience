import type { LoanApplicationDocumentKind } from "@/helpers/loan-application-documents-state";

export const LOAN_APPLICATION_DOCUMENTS_VERIFIED_BANNER =
  "Aadhaar and PAN already verified.";

export type LoanApplicationDocumentDefinition = {
  kind: LoanApplicationDocumentKind;
  title: string;
  description?: string;
  allowMultiple?: boolean;
};

/** Co-applicant identity collection — primary already verified via KYC. */
export const LOAN_APPLICATION_IDENTITY_DOCUMENTS: LoanApplicationDocumentDefinition[] = [
  {
    kind: "aadhaar",
    title: "Aadhaar card",
    description: "Upload clear images of the front and back of your Aadhaar card",
    allowMultiple: true,
  },
  {
    kind: "pan",
    title: "PAN card",
    description: "Upload a clear image of your PAN",
    allowMultiple: false,
  },
];

export const LOAN_APPLICATION_FINANCIAL_DOCUMENTS: LoanApplicationDocumentDefinition[] = [
  {
    kind: "salarySlip",
    title: "Salary slip - last 3 months",
  },
  {
    kind: "bankStatement",
    title: "Bank statement - last 6 months",
  },
  {
    kind: "addressProof",
    title: "Current address proof",
    description: "You can upload Aadhar, Voter ID, passport or driving license",
  },
  {
    kind: "form16",
    title: "Form 16 - last 2 years",
  },
];
