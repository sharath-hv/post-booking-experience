export type LoanApplicationDocumentKind =
  | "aadhaar"
  | "pan"
  | "salarySlip"
  | "bankStatement"
  | "addressProof"
  | "form16";

export type LoanApplicationDocumentUploadSource = "camera" | "gallery" | "file";

export type LoanApplicationUploadedFile = {
  id: string;
  name: string;
  source: LoanApplicationDocumentUploadSource;
};

export type LoanApplicationDocumentsState = Record<
  LoanApplicationDocumentKind,
  LoanApplicationUploadedFile[]
>;

export const LOAN_APPLICATION_DOCUMENT_KINDS: LoanApplicationDocumentKind[] = [
  "aadhaar",
  "pan",
  "salarySlip",
  "bankStatement",
  "addressProof",
  "form16",
];

/** Financial docs required for every applicant pass (identity is optional / co-applicant). */
export const LOAN_APPLICATION_FINANCIAL_DOCUMENT_KINDS: LoanApplicationDocumentKind[] = [
  "salarySlip",
  "bankStatement",
  "addressProof",
  "form16",
];

const UPLOAD_SOURCES: LoanApplicationDocumentUploadSource[] = ["camera", "gallery", "file"];

export function createEmptyLoanApplicationDocuments(): LoanApplicationDocumentsState {
  return {
    aadhaar: [],
    pan: [],
    salarySlip: [],
    bankStatement: [],
    addressProof: [],
    form16: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUploadSource(value: unknown): value is LoanApplicationDocumentUploadSource {
  return typeof value === "string" && UPLOAD_SOURCES.includes(value as LoanApplicationDocumentUploadSource);
}

function isUploadedFile(value: unknown): value is LoanApplicationUploadedFile {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isUploadSource(value.source)
  );
}

export function isLoanApplicationDocumentsState(
  value: unknown,
): value is LoanApplicationDocumentsState {
  if (!isRecord(value)) return false;
  return LOAN_APPLICATION_DOCUMENT_KINDS.every(
    (kind) => Array.isArray(value[kind]) && value[kind].every(isUploadedFile),
  );
}

export function areLoanApplicationDocumentsComplete(
  documents: LoanApplicationDocumentsState,
  options?: { requireIdentityDocuments?: boolean },
): boolean {
  const kinds = options?.requireIdentityDocuments
    ? LOAN_APPLICATION_DOCUMENT_KINDS
    : LOAN_APPLICATION_FINANCIAL_DOCUMENT_KINDS;
  return kinds.every((kind) => documents[kind].length > 0);
}
