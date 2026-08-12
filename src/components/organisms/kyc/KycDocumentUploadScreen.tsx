"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TopNavHeader } from "@/components/organisms/TopNavHeader";
import { KycPanAadhaarDocumentUploadSections } from "@/components/organisms/kyc/KycPanAadhaarDocumentUploadSections";
import {
  KYC_UPLOAD_HEADLINE,
  KYC_UPLOAD_SUBMIT_LABEL,
} from "@/constants/kyc-upload-content";
import { RevealStagger } from "@/components/molecules/stagger-container";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import styles from "./KycDocumentUploadScreen.module.scss";

import {
  createEmptyKycUploads,
  readKycUploadState,
  writeKycUploadState,
  type KycUploadsState,
} from "@/helpers/kyc-upload-state";

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
    router.push("/identity/documents-received");
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
      <TopNavHeader solid />

      <main className={styles.mx_auto_1}>
        <RevealStagger delay={STAGGER_HEADLINE}>
          <h1 className={styles.text_2xl_2}>
            {KYC_UPLOAD_HEADLINE}
          </h1>
        </RevealStagger>

        <KycPanAadhaarDocumentUploadSections
          uploads={uploads}
          onUploadsChange={setUploads}
          mockUploadCounterRef={mockUploadCounterRef}
          wrapTips={(node) => (
            <RevealStagger delay={STAGGER_INFO_BOX}>{node}</RevealStagger>
          )}
          wrapCard={(kind, card) => (
            <RevealStagger delay={staggerByKind[kind] ?? STAGGER_AADHAAR}>
              {card}
            </RevealStagger>
          )}
        />
      </main>

      <div className={styles.fixed_3}>
        <RevealStagger className={styles.mx_auto_4} delay={STAGGER_CTA}>
          <button
            type="button"
            disabled={!canSubmit}
            className={[styles.primary_cta_5, "primary-cta"].filter(Boolean).join(" ")}
            onClick={handleSubmit}
          >
            {KYC_UPLOAD_SUBMIT_LABEL}
          </button>
        </RevealStagger>
      </div>
    </div>
  );
}
