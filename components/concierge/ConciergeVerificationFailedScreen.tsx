"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { ConciergeDocumentsCard } from "@/components/concierge/ConciergeDocumentsCard";
import { VerificationFailureReasonSwitcher } from "@/components/kyc/VerificationFailureReasonSwitcher";
import {
  resolveKycVerificationFailureReason,
  type KycVerificationFailureReason,
} from "@/components/kyc/kyc-verification-failed-content";
import { JOURNEY_PATHS } from "@/lib/journey-routes";
import {
  createEmptyKycUploads,
  readKycUploadState,
  writeKycUploadState,
  type KycUploadsState,
} from "@/lib/kyc-upload-state";

const FOOTNOTE = "Re-upload within 24 hours or your purchase will be cancelled and your payment refunded.";

type FailureCopy = {
  says: readonly string[];
  /** Which doc(s) to show in the upload card. */
  requiredDocs: readonly ("pan" | "aadhaar")[];
  replyEcho: string;
};

const COPY: Record<Exclude<KycVerificationFailureReason, "image_not_clear">, FailureCopy> = {
  pan_not_clear: {
    says: [
      "Your PAN photo wasn't clear enough for me to read.",
      "Natural light works best. Keep the full card in frame and make sure there's no shadow or glare over the text.",
    ],
    requiredDocs: ["pan"],
    replyEcho: "I've re-uploaded my PAN",
  },
  aadhaar_not_clear: {
    says: [
      "Your Aadhaar photo wasn't clear enough for me to read.",
      "Natural light works best. Keep the full card in frame and make sure there's no shadow or glare over the text.",
    ],
    requiredDocs: ["aadhaar"],
    replyEcho: "I've re-uploaded my Aadhaar",
  },
  name_mismatch: {
    says: [
      "The names on your PAN and Aadhaar don't match.",
      "They need to be spelled identically for verification to go through. Upload fresh copies of both.",
    ],
    requiredDocs: ["pan", "aadhaar"],
    replyEcho: "I've re-uploaded them",
  },
  address_mismatch: {
    says: [
      "Your Aadhaar shows an address outside Bengaluru.",
      "Your car gets registered at your address, so the Aadhaar needs a Bengaluru address. If you've recently moved, update it with UIDAI and upload the new one.",
    ],
    requiredDocs: ["aadhaar"],
    replyEcho: "I've re-uploaded my Aadhaar",
  },
};

/**
 * Concierge-voice KYC verification failure turn.
 *
 * The upload card for the affected document(s) is shown inline as the artifact —
 * no separate upload page. The submit reply is disabled until the required doc(s)
 * are uploaded.
 *
 * Reads `?reason=` from the URL — defaults to `pan_not_clear`.
 * Tab switcher lets QA / demo preview all four cases via `?reason=`.
 */
export function ConciergeVerificationFailedScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mockUploadCounterRef = useRef(0);
  const hasHydratedRef = useRef(false);
  const [uploads, setUploads] = useState<KycUploadsState>(createEmptyKycUploads);

  // Hydrate from the same sessionStorage key as the first upload so existing
  // files are pre-populated (the user may have previously uploaded).
  useEffect(() => {
    const stored = readKycUploadState();
    if (stored) {
      setUploads(stored.uploads);
      mockUploadCounterRef.current = stored.mockUploadCounter;
    }
    hasHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    writeKycUploadState({ uploads, mockUploadCounter: mockUploadCounterRef.current });
  }, [uploads]);

  const reason = useMemo(
    () => resolveKycVerificationFailureReason(searchParams.get("reason")),
    [searchParams],
  );

  const onReasonChange = useCallback(
    (next: KycVerificationFailureReason) => {
      const q = new URLSearchParams(searchParams.toString());
      q.set("reason", next);
      router.replace(`/kyc/verification-failed?${q.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const { says, requiredDocs, replyEcho } =
    COPY[reason as Exclude<KycVerificationFailureReason, "image_not_clear">];

  const canSubmit = requiredDocs.every((doc) => uploads[doc].length > 0);

  const submitHref = `${JOURNEY_PATHS.kyc.documentsReceived}?reason=${encodeURIComponent(reason)}`;

  const replies = useMemo(
    () => [
      {
        label: "Submit documents",
        echo: replyEcho,
        disabled: !canSubmit,
        href: submitHref,
      },
    ],
    [canSubmit, replyEcho, submitHref],
  );

  return (
    <ConciergeTurnShell
      says={says}
      beforeDialogue={
        <VerificationFailureReasonSwitcher value={reason} onChange={onReasonChange} />
      }
      artifact={
        <ConciergeDocumentsCard
          uploads={uploads}
          onUploadsChange={setUploads}
          mockUploadCounterRef={mockUploadCounterRef}
          onlyDocs={requiredDocs}
          variant="glass"
        />
      }
      footnote={FOOTNOTE}
      replies={replies}
      altTimeSkip={{ label: "If retries are exhausted", href: "/kyc/verification-cancelled" }}
      callLabel="Questions? I can call you"
    />
  );
}
