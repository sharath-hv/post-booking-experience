/**
 * The bank-selection page is a single shared route (`/payment/choose-bank`)
 * used from three places in the journey (initial pick, mid-flow bank change,
 * post-rejection switch). Each caller wants a different destination and echo
 * line once a bank is confirmed, so the destination is carried as a template
 * string with a placeholder the page fills in after the user picks a bank.
 * Back navigation is the page's default `router.back()` — every caller
 * arrives here via `router.push`, so back always lands where they came from.
 */
const BANK_ID_TOKEN = "__BANK_ID__";
const BANK_NAME_TOKEN = "__BANK_NAME__";

export function bankIdToken(): string {
  return BANK_ID_TOKEN;
}

export function bankNameToken(): string {
  return BANK_NAME_TOKEN;
}

/** Fill a `next` URL template — value is URL-encoded. */
export function resolveBankIdToken(template: string, bankId: string): string {
  return template.split(BANK_ID_TOKEN).join(encodeURIComponent(bankId));
}

/** Fill an `echo` text template — plain text, no URL encoding. */
export function resolveBankNameToken(template: string, bankName: string): string {
  return template.split(BANK_NAME_TOKEN).join(bankName);
}

type BankSelectionPathOptions = {
  /** Where to go once a bank is confirmed — include {@link bankIdToken} where the chosen id belongs. */
  next: string;
  /** Concierge echo line to write before navigating to `next`. Omit to confirm silently. */
  echo?: string;
};

export function bankSelectionPath({ next, echo }: BankSelectionPathOptions): string {
  const params = new URLSearchParams();
  params.set("next", next);
  if (echo) params.set("echo", echo);
  return `/payment/choose-bank?${params.toString()}`;
}
