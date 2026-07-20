"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import deleteIcon from "@/assets/Delete.svg";
import done01Icon from "@/assets/done 01.png";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import docStyles from "@/components/concierge/ConciergeDocumentsCard.module.scss";
import { KycUploadSourceBottomSheet } from "@/components/kyc/KycUploadSourceBottomSheet";
import { KYC_MOCK_UPLOAD_NAMES, type KycUploadSource } from "@/components/kyc/kyc-upload-content";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";
import { loanProcessingPath } from "@/lib/loan-application-urls";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import { cn } from "@/lib/utils";

type UploadedFile = { id: string; name: string };

/**
 * Mid-review document request — bank needs one more file before they can
 * finish. Submit returns the user to the “application is with the bank” turn.
 */
export function LoanAdditionalDocumentsScreen() {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bank");
  const bank = useMemo(() => bankForQueryParam(bankId), [bankId]);
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
        id: `extra-doc-${source}-${uploadIndex}-${Date.now()}`,
        name: KYC_MOCK_UPLOAD_NAMES[uploadIndex % KYC_MOCK_UPLOAD_NAMES.length]!,
      },
    ]);
  }, []);

  const returnHref = useMemo(
    () => (bankId ? loanProcessingPath(bankId) : "/payment/loan-processing"),
    [bankId],
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
          `${bank.name} needs one more document before they can finish reviewing.`,
          "Upload it below and I'll send it across right away — then we're back to waiting on their call.",
        ]}
        artifact={
          <div className={cn(OVERLAY_GLASS_CARD_CLASS, "card-elevated")}>
            <div className={docStyles.px_4_6}>
              <div className={docStyles.flex_7}>
                <div className={docStyles.min_w_0_8}>
                  <div className={docStyles.flex_9}>
                    <p className={docStyles.text_sm_10}>Form 16 — last 2 years</p>
                  </div>
                  <p className={docStyles.mt_0_5_11}>Both assessment years, clear scans or photos</p>
                </div>
                {!hasFiles ? (
                  <button
                    type="button"
                    onClick={() => setSourceSheetOpen(true)}
                    className={[docStyles.cta_ghost_12, "cta-ghost"].filter(Boolean).join(" ")}
                  >
                    Upload
                  </button>
                ) : null}
              </div>
              {hasFiles ? (
                <div className={docStyles.mt_2_5_13}>
                  {files.map((file) => (
                    <div key={file.id} className={docStyles.relative_2}>
                      <span className={docStyles.relative_0}>
                        <Image
                          src={done01Icon}
                          alt=""
                          fill
                          className={docStyles.object_contain_1}
                          unoptimized
                          sizes="24px"
                        />
                      </span>
                      <span className={docStyles.min_w_0_3}>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
                        className={[docStyles.cta_ghost_4, "cta-ghost"].filter(Boolean).join(" ")}
                        aria-label={`Remove ${file.name}`}
                      >
                        <span className={docStyles.relative_5}>
                          <Image
                            src={deleteIcon}
                            alt=""
                            fill
                            className={docStyles.object_contain_1}
                            unoptimized
                            sizes="20px"
                          />
                        </span>
                      </button>
                    </div>
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
        callLabel="Questions? I can call you"
        manageShowVehicleIdentification
      />
      <KycUploadSourceBottomSheet
        open={sourceSheetOpen}
        onClose={() => setSourceSheetOpen(false)}
        onSelect={handleMockUpload}
        includeDigilocker={false}
      />
    </>
  );
}
