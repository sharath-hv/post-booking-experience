import {
  isLoanApplicationApplicant,
  type LoanApplicationApplicant,
  type LoanApplicationRoute,
} from "@/constants/loan-application-content";
import {
  ackoDriveFinanceActionPath,
  loanApplicationDocumentsPath,
} from "@/helpers/acko-drive-finance-bank";

export { ackoDriveFinanceActionPath, loanApplicationDocumentsPath };

export const LOAN_APPLICATION_ENTRY_ROUTE: LoanApplicationRoute = "loan-details";

export type LoanApplicationPathOptions = {
  applicant?: LoanApplicationApplicant;
};

function withQuery(route: LoanApplicationRoute, bankId: string, options?: LoanApplicationPathOptions) {
  const params = new URLSearchParams();
  params.set("bank", bankId);
  if (options?.applicant && options.applicant !== "primary") {
    params.set("applicant", options.applicant);
  }
  return `/payment/loan-application/${route}?${params.toString()}`;
}

export function loanApplicationPath(
  bankId: string,
  route: LoanApplicationRoute,
  options?: LoanApplicationPathOptions,
) {
  return withQuery(route, bankId, options);
}

export function loanApplicationEntryPath(bankId: string, options?: { fresh?: boolean }) {
  const path = loanApplicationPath(bankId, LOAN_APPLICATION_ENTRY_ROUTE);
  if (options?.fresh) {
    return `${path}&fresh=1`;
  }
  return path;
}

/** Person-shaped steps — run once for primary, again for co-applicant when enabled. */
const PERSON_ROUTE_ORDER: LoanApplicationRoute[] = [
  "personal",
  "address",
  "documents",
  "references",
];

export function parseLoanApplicationApplicant(
  value: string | null | undefined,
): LoanApplicationApplicant {
  if (value && isLoanApplicationApplicant(value)) return value;
  return "primary";
}

export function loanApplicationNextPath(
  bankId: string,
  current: LoanApplicationRoute,
  options?: {
    applicant?: LoanApplicationApplicant;
    includeCoApplicant?: boolean | null;
  },
): string {
  const applicant = options?.applicant ?? "primary";
  const includeCoApplicant = options?.includeCoApplicant === true;

  if (current === "loan-details") {
    return loanApplicationPath(bankId, "personal", { applicant: "primary" });
  }

  const personIndex = PERSON_ROUTE_ORDER.indexOf(current);
  if (personIndex >= 0) {
    if (personIndex < PERSON_ROUTE_ORDER.length - 1) {
      return loanApplicationPath(bankId, PERSON_ROUTE_ORDER[personIndex + 1]!, {
        applicant,
      });
    }
    // End of person pass
    if (applicant === "primary" && includeCoApplicant) {
      return loanApplicationPath(bankId, "personal", { applicant: "co" });
    }
    return loanApplicationSubmittedPath(bankId);
  }

  return loanProcessingPath(bankId);
}

export function loanApplicationPrevPath(
  bankId: string,
  current: LoanApplicationRoute,
  options?: {
    applicant?: LoanApplicationApplicant;
    includeCoApplicant?: boolean | null;
  },
): string | null {
  const applicant = options?.applicant ?? "primary";

  if (current === "loan-details") {
    return ackoDriveFinanceActionPath(bankId);
  }

  const personIndex = PERSON_ROUTE_ORDER.indexOf(current);
  if (personIndex < 0) return null;

  if (personIndex > 0) {
    return loanApplicationPath(bankId, PERSON_ROUTE_ORDER[personIndex - 1]!, {
      applicant,
    });
  }

  // Start of person pass
  if (applicant === "co") {
    return loanApplicationPath(bankId, "references", { applicant: "primary" });
  }

  return loanApplicationPath(bankId, "loan-details");
}

export function loanProcessingPath(bankId: string) {
  return `/payment/loan-processing?bank=${encodeURIComponent(bankId)}`;
}

/** Post–bank OTP — loan under review for 2–3 working days. */
export function loanUnderReviewPath(bankId: string) {
  return `/payment/loan-under-review?bank=${encodeURIComponent(bankId)}`;
}

/** Bank asked for an extra document mid-review — demo branch off under-review. */
export function loanAdditionalDocumentsPath(bankId: string) {
  return `/payment/loan-additional-documents?bank=${encodeURIComponent(bankId)}`;
}

export function loanApplicationSubmittedPath(bankId: string) {
  return `/payment/loan-application/submitted?bank=${encodeURIComponent(bankId)}`;
}
