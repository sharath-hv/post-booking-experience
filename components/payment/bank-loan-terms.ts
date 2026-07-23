import { BANK_SHEET_OPTIONS } from "@/components/payment/payment-choose-assets";

/**
 * Bank selection — full page + detail sheet data model.
 * Migration brief: bank selection moves from a bare bottom sheet (name + rate)
 * to a full page of cards, each opening a sheet with plain-language loan terms.
 * CX used to explain foreclosure/part-payment on a call before the customer
 * would commit to a bank; this data replaces that call.
 *
 * Every field below is nullable by design — a bank with only a rate must still
 * render a correct card and a correct (partial) sheet. `dataCompleteness` is
 * the single switch the UI reads to decide what to show; never branch on
 * `id`/`name` in the rendering components.
 */
export type BankDataCompleteness = "full" | "partial" | "rateOnly";

export interface BankLoanTerms {
  id: string;
  name: string;
  logoSrc: string;
  interestRate: { value: number; type: "from" | "flat" };

  rateType: "Fixed" | "Floating" | null;
  /** Plain-language points for the sheet, e.g. ["Fixed rate", "Your EMI stays the same for the full tenure"]. */
  rateTypeCopy: readonly string[] | null;

  foreclosure: {
    /** Months before the loan can be closed early at all. */
    lockInMonths: number | null;
    /** Plain-language bullets — lock-in, tiered charges, waiver conditions, one fact per line. */
    copy: readonly string[] | null;
  } | null;

  partPayment: {
    /** Plain-language bullets — eligibility, frequency, cap, charges, one fact per line. */
    copy: readonly string[] | null;
  } | null;

  /**
   * True when a phone-number lookup found a pre-approved offer at this bank.
   * Drive the card/sheet badge from this flag — never hardcode bank ids in UI.
   */
  preApproved?: boolean;

  dataCompleteness: BankDataCompleteness;
}

const logoById = new Map(BANK_SHEET_OPTIONS.map((b) => [b.id, b.logoSrc] as const));

/** Dummy terms for bank selection — all cards open a detail sheet. Swap with CX/API data when ready. */
export const BANK_LOAN_TERMS: readonly BankLoanTerms[] = [
  {
    id: "hdfc",
    name: "HDFC Bank",
    logoSrc: logoById.get("hdfc")!,
    interestRate: { value: 8.8, type: "from" },
    rateType: "Fixed",
    rateTypeCopy: ["Fixed rate", "Your EMI stays the same for the full tenure"],
    foreclosure: {
      lockInMonths: 6,
      copy: [
        "Not allowed in the first 6 months",
        "After that, a fee applies until month 24, based on how much you still owe",
        "No fee after 2 years if you've opted for loan protection",
      ],
    },
    partPayment: {
      copy: [
        "Allowed twice a year, once you've paid 12 EMIs",
        "Capped so your total prepayment doesn't cross 25% of what you owe",
      ],
    },
    dataCompleteness: "full",
  },
  {
    id: "baroda",
    name: "Bank of Baroda",
    logoSrc: logoById.get("baroda")!,
    interestRate: { value: 8.1, type: "from" },
    rateType: "Floating",
    rateTypeCopy: ["Floating rate", "Your EMI can change when the bank revises its lending rate"],
    foreclosure: {
      lockInMonths: 3,
      copy: [
        "Not allowed in the first 3 months",
        "After that, a fee applies until month 18, based on how much you still owe",
        "No fee after 18 months",
      ],
    },
    partPayment: {
      copy: [
        "Allowed once a year after you've paid 6 EMIs",
        "Capped at 20% of the outstanding principal",
      ],
    },
    dataCompleteness: "full",
  },
  {
    id: "icici",
    name: "ICICI Bank",
    logoSrc: logoById.get("icici")!,
    interestRate: { value: 8.8, type: "from" },
    rateType: "Fixed",
    rateTypeCopy: ["Fixed rate", "Your EMI stays the same for the full tenure"],
    foreclosure: {
      lockInMonths: 1,
      copy: [
        "Not allowed in the first month",
        "After that, a fee applies until month 24, based on how much you still owe",
        "No fee after 2 years",
      ],
    },
    partPayment: {
      copy: [
        "Allowed anytime after your first EMI",
        "No cap on how much or how often",
        "A small fee applies each time",
      ],
    },
    // Demo: phone-number lookup found a pre-approved offer at ICICI only.
    preApproved: true,
    dataCompleteness: "full",
  },
  {
    id: "boi",
    name: "Bank of India",
    logoSrc: logoById.get("boi")!,
    interestRate: { value: 8.0, type: "from" },
    rateType: "Floating",
    rateTypeCopy: ["Floating rate", "Your EMI can change when the bank revises its lending rate"],
    foreclosure: {
      lockInMonths: 12,
      copy: [
        "Not allowed in the first 12 months",
        "After that, a fee applies until month 36, based on how much you still owe",
        "No fee after 3 years",
      ],
    },
    partPayment: {
      copy: [
        "Allowed twice a year after you've paid 12 EMIs",
        "Capped at 25% of the outstanding principal",
      ],
    },
    dataCompleteness: "full",
  },
  {
    id: "canara",
    name: "Canara Bank",
    logoSrc: logoById.get("canara")!,
    interestRate: { value: 8.0, type: "from" },
    rateType: "Fixed",
    rateTypeCopy: ["Fixed rate", "Your EMI stays the same for the full tenure"],
    foreclosure: {
      lockInMonths: 6,
      copy: [
        "Not allowed in the first 6 months",
        "After that, a fee applies until month 24, based on how much you still owe",
        "No fee after 2 years",
      ],
    },
    partPayment: {
      copy: [
        "Allowed anytime after 6 EMIs",
        "Capped at 30% of outstanding principal per year",
        "A small fee applies each time",
      ],
    },
    dataCompleteness: "full",
  },
] as const;

export function bankLoanTermsForId(bankId: string | null | undefined): BankLoanTerms {
  return BANK_LOAN_TERMS.find((b) => b.id === bankId) ?? BANK_LOAN_TERMS[0];
}

export function formatBankRate(bank: Pick<BankLoanTerms, "interestRate">): string {
  return `${bank.interestRate.value}% p.a.`;
}

/** Card one-liner — "No foreclosure for 6 months" / "for 1 month". Null when there's nothing to say yet. */
export function bankLockInSummary(bank: Pick<BankLoanTerms, "foreclosure">): string | null {
  const months = bank.foreclosure?.lockInMonths;
  if (months == null) return null;
  if (months <= 0) return "No lock-in period on foreclosure";
  return `No foreclosure for ${months} ${months === 1 ? "month" : "months"}`;
}
