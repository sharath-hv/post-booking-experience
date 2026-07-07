export const KYC_VERIFICATION_FAILED_UPLOAD_HREF = "/kyc/upload";

export type KycVerificationFailureReason =
  | "pan_not_clear"
  | "aadhaar_not_clear"
  | "image_not_clear" // legacy — resolves to pan_not_clear
  | "name_mismatch"
  | "address_mismatch";

export const KYC_VERIFICATION_FAILED_CTA_WARNING =
  "1 attempt left — fix this now and your price lock and delivery date stay safe";

export type KycVerificationFailedCopy = {
  /** Short label for the on-screen reason switcher. */
  label: string;
  headline: string;
  subline: string;
  /** Info callout below subline; omit when not needed (e.g. address mismatch). */
  infoBox?: string;
  /** When set, rendered medium-weight before `infoBox` (e.g. "Before you retry:"). */
  infoBoxBoldPrefix?: string;
  ctaLabel: string;
};

/**
 * Reasons shown in the concierge tab switcher — excludes the legacy `image_not_clear`
 * which maps to `pan_not_clear` on resolve.
 */
export const KYC_VERIFICATION_FAILURE_REASONS: readonly KycVerificationFailureReason[] = [
  "pan_not_clear",
  "aadhaar_not_clear",
  "name_mismatch",
  "address_mismatch",
] as const;

export const DEFAULT_KYC_VERIFICATION_FAILURE_REASON: KycVerificationFailureReason =
  "pan_not_clear";

export const KYC_VERIFICATION_FAILED_VARIANTS: Record<
  KycVerificationFailureReason,
  KycVerificationFailedCopy
> = {
  pan_not_clear: {
    label: "PAN photo",
    headline: "Your PAN photo wasn't clear enough",
    subline: "The PAN image wasn't clear enough to read.",
    infoBoxBoldPrefix: "Before you retry:",
    infoBox: "use natural light, keep the full card in frame, and avoid shadows or glare.",
    ctaLabel: "Re-upload my PAN",
  },
  aadhaar_not_clear: {
    label: "Aadhaar photo",
    headline: "Your Aadhaar photo wasn't clear enough",
    subline: "The Aadhaar image wasn't clear enough to read.",
    infoBoxBoldPrefix: "Before you retry:",
    infoBox: "use natural light, keep the full card in frame, and avoid shadows or glare.",
    ctaLabel: "Re-upload my Aadhaar",
  },
  /** Legacy — maps to pan_not_clear on resolve. Not shown in switcher. */
  image_not_clear: {
    label: "Photo not clear",
    headline: "We could not verify your documents",
    subline: "Your PAN and Aadhaar images were not clear enough to read.",
    infoBoxBoldPrefix: "Before you retry:",
    infoBox: "use natural light, keep the full document in frame, and avoid shadows or glare.",
    ctaLabel: "Re-upload documents",
  },
  name_mismatch: {
    label: "Name mismatch",
    headline: "The name on your documents does not match",
    subline: "The names on your PAN and Aadhaar need to match for verification to pass.",
    infoBox: "Check that the name is spelled the same way on both your PAN and Aadhaar.",
    ctaLabel: "Re-upload documents",
  },
  address_mismatch: {
    label: "Address",
    headline: "Your Aadhaar address isn't in Bengaluru",
    subline:
      "Your Aadhaar needs an address in Bengaluru — where your car gets registered — for verification to pass.",
    ctaLabel: "Re-upload my Aadhaar",
  },
};

export function isKycVerificationFailureReason(
  value: string | null | undefined,
): value is KycVerificationFailureReason {
  return (
    value === "pan_not_clear" ||
    value === "aadhaar_not_clear" ||
    value === "image_not_clear" ||
    value === "name_mismatch" ||
    value === "address_mismatch"
  );
}

export function resolveKycVerificationFailureReason(
  value: string | null | undefined,
): KycVerificationFailureReason {
  if (!isKycVerificationFailureReason(value)) return DEFAULT_KYC_VERIFICATION_FAILURE_REASON;
  // Legacy: image_not_clear (both unclear) → default to pan_not_clear in concierge view.
  if (value === "image_not_clear") return "pan_not_clear";
  return value;
}

export function getKycVerificationFailedCopy(
  reason: KycVerificationFailureReason,
): KycVerificationFailedCopy {
  return KYC_VERIFICATION_FAILED_VARIANTS[reason];
}

/** @deprecated Use {@link getKycVerificationFailedCopy} with a reason id. */
export const KYC_VERIFICATION_FAILED_HEADLINE =
  KYC_VERIFICATION_FAILED_VARIANTS.image_not_clear.headline;

/** @deprecated Use {@link getKycVerificationFailedCopy} with a reason id. */
export const KYC_VERIFICATION_FAILED_SUBLINE =
  KYC_VERIFICATION_FAILED_VARIANTS.image_not_clear.subline;

/** @deprecated Use {@link getKycVerificationFailedCopy} with a reason id. */
export const KYC_VERIFICATION_FAILED_CTA_LABEL =
  KYC_VERIFICATION_FAILED_VARIANTS.image_not_clear.ctaLabel;
