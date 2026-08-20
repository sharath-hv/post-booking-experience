"use client";

import { cn } from "@/utils/utils";

import {
  DOCUMENT_UPLOAD_CARD_TITLE_CLASS,
} from "@/constants/kyc-upload-content";

import { UploadFileControl } from "@/components/molecules/upload/UploadFileControl";
import { UploadFileRow } from "@/components/molecules/upload/UploadFileRow";
import styles from "./DocumentUploadSection.module.scss";


/** Figma 2506:17851 — gap from description to first upload row. */
const DESCRIPTION_TO_UPLOAD_GAP_CLASS = styles.descriptionToUploadGap;

/** Figma 2506:17851 — gap from last upload row to “Add more”. */
const UPLOAD_TO_ADD_MORE_GAP_CLASS = styles.uploadToAddMoreGap;

export type DocumentUploadFile = {
  id: string;
  name: string;
};

export type DocumentUploadSectionProps = {
  title: string;
  description?: string;
  allowMultiple?: boolean;
  files: DocumentUploadFile[];
  onUploadClick: () => void;
  onAddMoreClick?: () => void;
  onRemove: (fileId: string) => void;
};

export function DocumentUploadSection({
  title,
  description,
  allowMultiple = false,
  files,
  onUploadClick,
  onAddMoreClick,
  onRemove,
}: DocumentUploadSectionProps) {
  const handleAddMore = onAddMoreClick ?? onUploadClick;

  return (
    <section className={styles.rounded_2xl_7}>
      <p className={DOCUMENT_UPLOAD_CARD_TITLE_CLASS}>{title}</p>
      {description ? (
        <p className={styles.mt_1_8}>{description}</p>
      ) : null}

      {files.length > 0 ? (
        <div className={cn(DESCRIPTION_TO_UPLOAD_GAP_CLASS, styles.flex_1)}>
          {files.map((file) => (
            <UploadFileRow key={file.id} name={file.name} onRemove={() => onRemove(file.id)} />
          ))}
        </div>
      ) : null}

      {files.length === 0 ? (
        <UploadFileControl
          mode="empty"
          onUpload={onUploadClick}
          className={DESCRIPTION_TO_UPLOAD_GAP_CLASS}
        />
      ) : null}

      {allowMultiple && files.length > 0 ? (
        <button
          type="button"
          onClick={handleAddMore}
          className={cn(UPLOAD_TO_ADD_MORE_GAP_CLASS, styles.self_start_2)}
        >
          + Add more
        </button>
      ) : null}
    </section>
  );
}
