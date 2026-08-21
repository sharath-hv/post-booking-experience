"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { GhostCta } from "@/components/atoms/cta/GhostCta";
import { UploadFileRow } from "@/components/molecules/upload/UploadFileRow";

import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import docStyles from "@/components/organisms/document-upload-card-layout.module.scss";
import { UploadSourceBottomSheet } from "@/components/organisms/UploadSourceBottomSheet";
import { useFullPaymentJourney } from "@/hooks/use-full-payment-journey";
import { KYC_MOCK_UPLOAD_NAMES, type KycUploadSource } from "@/constants/kyc-upload-content";
import { OVERLAY_GLASS_CARD_CLASS } from "@/helpers/overlay-glass-card";
import { cn } from "@/utils/utils";

type UploadedFile = { id: string; name: string };

/**
 * Mid-RTO document request — registration needs one more file before they
 * can finish. Submit returns the user to the RTO wait turn.
 */
export function CarDeliveryRtoAdditionalDocumentsScreen() {
  const { withBank } = useFullPaymentJourney();
  const mockUploadCounterRef = useRef(0);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);

  const handleMockUpload = useCallback((source: KycUploadSource) => {
    if (source === "digilocker") return;
    const uploadIndex = mockUploadCounterRef.current;
    mockUploadCounterRef.current += 1;
    setFiles((prev) => [
      ...prev,
      {
        id: `rto-doc-${source}-${uploadIndex}-${Date.now()}`,
        name: KYC_MOCK_UPLOAD_NAMES[uploadIndex % KYC_MOCK_UPLOAD_NAMES.length]!,
      },
    ]);
  }, []);

  const returnHref = useMemo(
    () => withBank("/delivery/rto"),
    [withBank],
  );

  const replies = useMemo(
    () => [
      {
        label: "Submit document",
        echo: "I've uploaded the document",
        disabled: files.length === 0,
        href: returnHref,
      },
    ],
    [files.length, returnHref],
  );

  const hasFiles = files.length > 0;

  return (
    <>
      <ConciergeTurnShell
        says={[
          "The RTO needs one more document before they can finish registration.",
          "Upload it below and I'll send it across right away — then we're back to waiting on their update.",
        ]}
        artifact={
          <div className={cn(OVERLAY_GLASS_CARD_CLASS, "card-elevated")}>
            <div className={docStyles.px_4_6}>
              <div className={docStyles.flex_7}>
                <div className={docStyles.min_w_0_8}>
                  <div className={docStyles.flex_9}>
                    <p className={docStyles.text_sm_10}>Current address proof</p>
                  </div>
                  <p className={docStyles.mt_0_5_11}>
                    Clear scan or photo of a recent utility bill or Aadhaar
                  </p>
                </div>
                {!hasFiles ? (
                  <GhostCta
                    onClick={() => setSourceSheetOpen(true)}
                    className={docStyles.cta_ghost_12}
                  >
                    Upload
                  </GhostCta>
                ) : null}
              </div>
              {hasFiles ? (
                <div className={docStyles.mt_2_5_13}>
                  {files.map((file) => (
                    <UploadFileRow
                      key={file.id}
                      name={file.name}
                      onRemove={() => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setSourceSheetOpen(true)}
                    className={docStyles.self_start_14}
                  >
                    + Add another photo
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        }
        replies={replies}
        callLabel="Need help?"
        manageShowVehicleIdentification
      />
      <UploadSourceBottomSheet
        open={sourceSheetOpen}
        onClose={() => setSourceSheetOpen(false)}
        onSelect={handleMockUpload}
        includeDigilocker={false}
      />
    </>
  );
}
