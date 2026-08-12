/**
 * Post-rejection analysis outcomes: what ACKO can still do after a bank decline.
 * Demo / QA preview via `?outcome=` on `/payment/loan-rejected`.
 */

export const LOAN_REJECTED_OUTCOME_QUERY_KEY = "outcome";

export type LoanRejectedOutcome =
  | "non_doable"
  | "same_bank_co_applicant"
  | "same_bank_guarantor"
  | "alt_bank"
  | "alt_bank_co_applicant";

export const LOAN_REJECTED_OUTCOMES: readonly LoanRejectedOutcome[] = [
  "non_doable",
  "same_bank_co_applicant",
  "same_bank_guarantor",
  "alt_bank",
  "alt_bank_co_applicant",
] as const;

/** Closest to the previous single-path rejected screen. */
export const DEFAULT_LOAN_REJECTED_OUTCOME: LoanRejectedOutcome = "alt_bank";

export type LoanRejectedOutcomeDefinition = {
  id: LoanRejectedOutcome;
  /** Short label for the demo tab switcher. */
  label: string;
};

export const LOAN_REJECTED_OUTCOME_DEFINITIONS: Record<
  LoanRejectedOutcome,
  LoanRejectedOutcomeDefinition
> = {
  non_doable: { id: "non_doable", label: "No loan" },
  same_bank_co_applicant: { id: "same_bank_co_applicant", label: "Co-app" },
  same_bank_guarantor: { id: "same_bank_guarantor", label: "Guarantor" },
  alt_bank: { id: "alt_bank", label: "New bank" },
  alt_bank_co_applicant: { id: "alt_bank_co_applicant", label: "Bank+co" },
};

export function isLoanRejectedOutcome(value: string): value is LoanRejectedOutcome {
  return (LOAN_REJECTED_OUTCOMES as readonly string[]).includes(value);
}

export function resolveLoanRejectedOutcome(
  value: string | null | undefined,
): LoanRejectedOutcome {
  if (value && isLoanRejectedOutcome(value)) return value;
  return DEFAULT_LOAN_REJECTED_OUTCOME;
}

export type LoanRejectedCopyContext = {
  rejectedBankName: string;
  altBankName: string;
  altBankRate: string;
};

export type LoanRejectedTurnCopy = {
  says: readonly string[];
};

export function loanRejectedTurnCopy(
  outcome: LoanRejectedOutcome,
  ctx: LoanRejectedCopyContext,
): LoanRejectedTurnCopy {
  const { rejectedBankName, altBankName, altBankRate } = ctx;

  switch (outcome) {
    case "non_doable":
      return {
        says: [
          `${rejectedBankName} wasn't able to approve this loan.`,
          "After a careful look, we can't place it with another lender either. Here's what you can still do.",
        ],
      };

    case "same_bank_co_applicant":
      return {
        says: [
          `${rejectedBankName} needs a co‑applicant before they can move ahead.`,
          "Your details are already in. We only need the co‑applicant's application next.",
        ],
      };

    case "same_bank_guarantor":
      return {
        says: [
          `${rejectedBankName} can still do this if we add a guarantor.`,
          "That's usually enough to get the loan moving again — cancel only if you'd rather stop.",
        ],
      };

    case "alt_bank":
      return {
        says: [
          `${rejectedBankName} wasn't able to approve this loan.`,
          `Lending criteria vary from bank to bank. ${altBankName} can take the same amount at ${altBankRate}, and your application carries over.`,
        ],
      };

    case "alt_bank_co_applicant":
      return {
        says: [
          `${rejectedBankName} wasn't able to approve this loan.`,
          `${altBankName} can take it forward if we add a co‑applicant. Your details stay as they are.`,
        ],
      };
  }
}

export function loanGuarantorPath(bankId: string) {
  return `/payment/loan-guarantor?bank=${encodeURIComponent(bankId)}`;
}
