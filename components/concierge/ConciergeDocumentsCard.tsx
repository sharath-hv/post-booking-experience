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
import { cn } from "@/lib/utils";

import deleteIcon from "@/assets/Delete.svg";
import done01Icon from "@/assets/done 01.png";

type ConciergeDocumentsCardProps = {
  uploads: KycUploadsState;
  onUploadsChange: (next: KycUploadsState) => void;
  /** Persists mock filename index with parent session state. */
  mockUploadCounterRef: React.MutableRefObject<number>;
  /** Restrict to specific doc kinds — for re-upload flows where only one doc needs fixing. */
  onlyDocs?: readonly KycDocumentKind[];
};

function UploadSuccessBadge() {
  return (
    <span className="relative h-6 w-6 shrink-0">
      <Image src={done01Icon} alt="" fill className="object-contain" unoptimized sizes="24px" />
    </span>
  );
}

function FileChip({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="relative flex h-12 items-center gap-2 rounded-lg border border-dashed border-[#e8e8e8] bg-[#f5f5f5] px-3">
      <UploadSuccessBadge />
      <span className="min-w-0 flex-1 truncate text-sm leading-5 text-[#121212]">{name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="cta-ghost flex size-5 shrink-0 items-center justify-center rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/20 focus-visible:ring-offset-2"
        aria-label={`Remove ${name}`}
      >
        <span className="relative h-5 w-5">
          <Image src={deleteIcon} alt="" fill className="object-contain" unoptimized sizes="20px" />
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
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold leading-5 text-[#121212]">{title}</p>
          </div>
          <p className="mt-0.5 text-xs leading-[18px] text-[#757575]">{hint}</p>
        </div>
        {!hasFiles ? (
          <button
            type="button"
            onClick={onUpload}
            className="cta-ghost flex h-9 shrink-0 items-center justify-center rounded-[10px] border border-[#121212] px-4 text-sm font-medium leading-5 text-[#121212]"
          >
            {uploadLabel}
          </button>
        ) : null}
      </div>
      {hasFiles ? (
        <div className="mt-2.5 flex flex-col gap-3">
          {files.map((file) => (
            <FileChip key={file.id} name={file.name} onRemove={() => onRemove(file.id)} />
          ))}
          {allowMultiple ? (
            <button
              type="button"
              onClick={onUpload}
              className="self-start text-[13px] font-medium leading-[18px] text-[#1b73e8]"
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
}: ConciergeDocumentsCardProps) {
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
          the name should match on both documents, and the Aadhaar address should be in Bengaluru (where your car gets registered).
        </ShimmerInfoCard>
      ) : null}

      <div className={cn("overflow-hidden rounded-2xl bg-white card-elevated", onlyDocs == null ? "mt-4" : undefined)}>
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
        {showBothRows ? <hr className="mx-4 border-0 border-t border-dashed border-[#ececec]" /> : null}
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
        <div className="mt-3 px-1">
          <p className="flex items-start gap-2 text-xs leading-[18px] text-[#757575]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-0.5 shrink-0">
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
