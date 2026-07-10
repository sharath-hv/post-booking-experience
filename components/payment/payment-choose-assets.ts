import { publicAssetPath } from "@/lib/public-asset-path";

import ackoDriveFinanceIllustration from "@/assets/ACKO Drive finance.svg";
import fullCashIllustration from "@/assets/Full cash.svg";
import selfFinanceIllustration from "@/assets/Self finance.svg";

/**
 * Choose payment screen — illustrations + radio states.
 * Card illustrations are imported from `assets/`; radio and sheet art use `public/assets/`.
 */
const asset = publicAssetPath;

export const PAYMENT_CHOOSE_ASSETS = {
  ackoDriveLogo: asset("ACKO Drive logo.svg"),
  ackoDriveFinance: ackoDriveFinanceIllustration,
  selfFinance: selfFinanceIllustration,
  fullCash: fullCashIllustration,
  radioOn: asset("Radio button on.svg"),
  radioOff: asset("Radio button off.svg"),
  /** Loan summary — bank building (synced from repo `assets/bank.svg`). */
  bank: asset("bank.svg"),
  /** Sanctioned / disbursement amount sheet art (synced from repo `assets/sanctioned amount.svg`). */
  sanctionedAmount: asset("sanctioned amount.svg"),
  /** Bank transfer / loan sanctioned confirmation sheet art. */
  loanApproved: asset("loan approved.svg"),
  /** Down payment / payment summary tile. */
  paymentSummary: asset("Payment summary.svg"),
  /** Self finance action / documents received hero. */
  documentsReceived: asset("Documents_received.svg"),
  /** Proforma card icon. */
  document: asset("Document.svg"),
  /** Proforma card icon (dark stroke). */
  documentBlack: asset("Document_black.svg"),
  /** Price-lock receipt / invoice icon. */
  invoice: asset("Invoice.svg"),
  /** Proforma invoice document icon. */
  proformaInvoice: asset("Proforma Invoice.svg"),
  /** Info / tooltip hint (e.g. on-road price). */
  info: asset("Info.svg"),
} as const;

/** Partner bank marks — 20×20px in UI */
export const PARTNER_BANK_LOGOS = [
  { src: asset("HDFC.svg"), alt: "HDFC Bank" },
  { src: asset("ICICI.svg"), alt: "ICICI Bank" },
  { src: asset("Bank-of-baroda.svg"), alt: "Bank of Baroda" },
  { src: asset("Bank-of-india.svg"), alt: "Bank of India" },
  { src: asset("Canara-bank.svg"), alt: "Canara Bank" },
] as const;

/** Bottom sheet bank list — Figma 1941:12822 (order + copy). */
export const BANK_SHEET_OPTIONS = [
  {
    id: "hdfc",
    name: "HDFC Bank",
    brandText: "HDFC",
    rate: "8.8% p.a.",
    logoSrc: asset("HDFC.svg"),
  },
  {
    id: "baroda",
    name: "Bank of Baroda",
    brandText: "Bank of Baroda",
    rate: "8.1% p.a.",
    logoSrc: asset("Bank-of-baroda.svg"),
  },
  {
    id: "icici",
    name: "ICICI Bank",
    brandText: "ICICI",
    rate: "8.8% p.a.",
    logoSrc: asset("ICICI.svg"),
  },
  {
    id: "boi",
    name: "Bank of India",
    brandText: "Bank of India",
    rate: "8.0% p.a.",
    logoSrc: asset("Bank-of-india.svg"),
  },
  {
    id: "canara",
    name: "Canara Bank",
    brandText: "Canara",
    rate: "8.0% p.a.",
    logoSrc: asset("Canara-bank.svg"),
  },
] as const;
