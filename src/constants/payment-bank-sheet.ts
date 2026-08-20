import { publicAssetPath } from "@/utils/public-asset-path";

const asset = publicAssetPath;

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
