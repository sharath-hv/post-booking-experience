"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { KycUploadSourceBottomSheet } from "@/components/kyc/KycUploadSourceBottomSheet";
import {
  type KycDocumentKind,
  type KycUploadSource,
} from "@/components/kyc/kyc-upload-content";
import {
  appendKycMockUpload,
} from "@/lib/kyc-mock-upload";
import type { KycUploadsState } from "@/lib/kyc-upload-state";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import { cn } from "@/lib/utils";

import deleteIcon from "@/assets/Delete.svg";
import done01Icon from "@/assets/done 01.png";
import styles from "./ConciergeDocumentsCard.module.scss";


type ConciergeDocumentsCardProps = {
  uploads: KycUploadsState;
  onUploadsChange: (next: KycUploadsState) => void;
  /** Persists mock filename index with parent session state. */
  mockUploadCounterRef: React.MutableRefObject<number>;
  /** Restrict to specific doc kinds — for re-upload flows where only one doc needs fixing. */
  onlyDocs?: readonly KycDocumentKind[];
  /** `glass` — frosted gradient surface used on the manage-booking overlay. */
  variant?: "default" | "glass";
};

function UploadSuccessBadge() {
  return (
    <span className={styles.relative_0}>
      <Image src={done01Icon} alt="" fill className={styles.object_contain_1} unoptimized sizes="24px" />
    </span>
  );
}

function FileChip({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className={styles.relative_2}>
      <UploadSuccessBadge />
      <span className={styles.min_w_0_3}>{name}</span>
      <button
        type="button"
        onClick={onRemove}
        className={[styles.cta_ghost_4, "cta-ghost"].filter(Boolean).join(" ")}
        aria-label={`Remove ${name}`}
      >
        <span className={styles.relative_5}>
          <Image src={deleteIcon} alt="" fill className={styles.object_contain_1} unoptimized sizes="20px" />
        </span>
      </button>
    </div>
  );
}

type DocumentRowProps = {
  title: string;
  hint: string;
  files: { id: string; name: string }[];
  allowMultiple?: boolean;
  uploadLabel?: string;
  onUpload: () => void;
  onRemove: (fileId: string) => void;
};

function DocumentRow({ title, hint, files, allowMultiple, uploadLabel = "Upload", onUpload, onRemove }: DocumentRowProps) {
  const hasFiles = files.length > 0;
  return (
    <div className={styles.px_4_6}>
      <div className={styles.flex_7}>
        <div className={styles.min_w_0_8}>
          <div className={styles.flex_9}>
            <p className={styles.text_sm_10}>{title}</p>
          </div>
          <p className={styles.mt_0_5_11}>{hint}</p>
        </div>
        {!hasFiles ? (
          <button
            type="button"
            onClick={onUpload}
            className={[styles.cta_ghost_12, "cta-ghost"].filter(Boolean).join(" ")}
          >
            {uploadLabel}
          </button>
        ) : null}
      </div>
      {hasFiles ? (
        <div className={styles.mt_2_5_13}>
          {files.map((file) => (
            <FileChip key={file.id} name={file.name} onRemove={() => onRemove(file.id)} />
          ))}
          {allowMultiple ? (
            <button
              type="button"
              onClick={onUpload}
              className={styles.self_start_14}
            >
              + Add another photo
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The documents handover as one card — manual upload rows with caveats and
 * privacy as quiet captions below.
 */
export function ConciergeDocumentsCard({
  uploads,
  onUploadsChange,
  mockUploadCounterRef,
  onlyDocs,
  variant = "default",
}: ConciergeDocumentsCardProps) {
  const isGlass = variant === "glass";
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<KycDocumentKind | null>(null);

  const openSourceSheet = useCallback((kind: KycDocumentKind) => {
    setActiveDocument(kind);
    setSourceSheetOpen(true);
  }, []);

  const handleMockUpload = useCallback(
    (source: KycUploadSource) => {
      if (activeDocument == null) return;
      onUploadsChange(
        appendKycMockUpload(uploads, activeDocument, source, mockUploadCounterRef),
      );
    },
    [activeDocument, mockUploadCounterRef, onUploadsChange, uploads],
  );

  const handleRemove = useCallback(
    (kind: KycDocumentKind, fileId: string) => {
      onUploadsChange({
        ...uploads,
        [kind]: uploads[kind].filter((file) => file.id !== fileId),
      });
    },
    [onUploadsChange, uploads],
  );

  const showAadhaar = onlyDocs == null || onlyDocs.includes("aadhaar");
  const showPan = onlyDocs == null || onlyDocs.includes("pan");
  const showBothRows = showAadhaar && showPan;

  return (
    <>
      {/* Pre-action caveat — only for the initial upload (both docs, no prior context).
          Re-upload turns already have Shivi's explanation above, so suppress it. */}
      {onlyDocs == null ? (
        <ShimmerInfoCard icon="info" lead="Quick check:">
          the name should match on both documents, and the Aadhaar address should be in Bengaluru, where your car gets registered.
        </ShimmerInfoCard>
      ) : null}

      <div
        className={cn(
          isGlass ? OVERLAY_GLASS_CARD_CLASS : styles.overflow_hidden_19, "card-elevated",
          onlyDocs == null ? styles.mt_4_20 : undefined,
        )}
      >
        {showAadhaar ? (
          <DocumentRow
            title="Aadhaar card"
            hint="Front and back, clear photos"
            files={uploads.aadhaar}
            allowMultiple
            uploadLabel={onlyDocs != null ? "Re-upload" : "Upload"}
            onUpload={() => openSourceSheet("aadhaar")}
            onRemove={(fileId) => handleRemove("aadhaar", fileId)}
          />
        ) : null}
        {showBothRows ? <hr className={styles.mx_4_15} /> : null}
        {showPan ? (
          <DocumentRow
            title="PAN card"
            hint="One clear photo"
            files={uploads.pan}
            uploadLabel={onlyDocs != null ? "Re-upload" : "Upload"}
            onUpload={() => openSourceSheet("pan")}
            onRemove={(fileId) => handleRemove("pan", fileId)}
          />
        ) : null}
      </div>

      {onlyDocs == null ? (
        <div className={styles.mt_3_16}>
          <p className={styles.flex_17}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className={styles.mt_0_5_18}>
              <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Encrypted, and used only for this purchase. Nobody else sees them.
          </p>
        </div>
      ) : null}

      <KycUploadSourceBottomSheet
        open={sourceSheetOpen}
        onClose={() => setSourceSheetOpen(false)}
        onSelect={handleMockUpload}
        includeDigilocker={false}
      />
    </>
  );
}
