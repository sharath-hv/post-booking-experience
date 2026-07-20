"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import { KycPanAadhaarDocumentUploadSections } from "@/components/kyc/KycPanAadhaarDocumentUploadSections";
import {
  KYC_UPLOAD_HEADLINE,
  KYC_UPLOAD_SUBMIT_LABEL,
} from "@/components/kyc/kyc-upload-content";
import { PaymentSuccessStagger } from "@/components/ui/stagger-container";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import styles from "./KycDocumentUploadScreen.module.scss";

import {
  createEmptyKycUploads,
  readKycUploadState,
  writeKycUploadState,
  type KycUploadsState,
} from "@/lib/kyc-upload-state";

const STAGGER_HEADLINE = 0.08;
const STAGGER_INFO_BOX = 0.16;
const STAGGER_AADHAAR = 0.24;
const STAGGER_PAN = 0.32;
const STAGGER_CTA = 0.4;

/**
 * KYC document upload — Figma nodes 2501:8136 (default), 2502:8901 / 2506:17851 (uploaded).
 */
export function KycDocumentUploadScreen() {
  const router = useRouter();
  const mockUploadCounterRef = useRef(0);
  const hasHydratedUploadsRef = useRef(false);
  const [uploads, setUploads] = useState<KycUploadsState>(createEmptyKycUploads);

  useEffect(() => {
    const stored = readKycUploadState();
    if (stored) {
      setUploads(stored.uploads);
      mockUploadCounterRef.current = stored.mockUploadCounter;
    }
    hasHydratedUploadsRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedUploadsRef.current) return;
    writeKycUploadState({
      uploads,
      mockUploadCounter: mockUploadCounterRef.current,
    });
  }, [uploads]);

  const canSubmit = uploads.aadhaar.length > 0 && uploads.pan.length > 0;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    writeConciergeEcho("Documents sent");
    router.push("/kyc/documents-received");
  }, [canSubmit, router]);

  const staggerByKind = useMemo(
    () =>
      ({
        aadhaar: STAGGER_AADHAAR,
        pan: STAGGER_PAN,
      }) as Record<string, number>,
    [],
  );

  return (
    <div className={styles.min_h_dvh_0}>
      <KycTopNavHeader />

      <main className={styles.mx_auto_1}>
        <PaymentSuccessStagger delay={STAGGER_HEADLINE}>
          <h1 className={styles.text_2xl_2}>
            {KYC_UPLOAD_HEADLINE}
          </h1>
        </PaymentSuccessStagger>

        <KycPanAadhaarDocumentUploadSections
          uploads={uploads}
          onUploadsChange={setUploads}
          mockUploadCounterRef={mockUploadCounterRef}
          wrapTips={(node) => (
            <PaymentSuccessStagger delay={STAGGER_INFO_BOX}>{node}</PaymentSuccessStagger>
          )}
          wrapCard={(kind, card) => (
            <PaymentSuccessStagger delay={staggerByKind[kind] ?? STAGGER_AADHAAR}>
              {card}
            </PaymentSuccessStagger>
          )}
        />
      </main>

      <div className={styles.fixed_3}>
        <PaymentSuccessStagger className={styles.mx_auto_4} delay={STAGGER_CTA}>
          <button
            type="button"
            disabled={!canSubmit}
            className={[styles.primary_cta_5, "primary-cta"].filter(Boolean).join(" ")}
            onClick={handleSubmit}
          >
            {KYC_UPLOAD_SUBMIT_LABEL}
          </button>
        </PaymentSuccessStagger>
      </div>
    </div>
  );
}
