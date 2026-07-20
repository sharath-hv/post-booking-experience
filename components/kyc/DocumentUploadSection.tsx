"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

import {
  DOCUMENT_UPLOAD_CARD_TITLE_CLASS,
} from "@/components/kyc/kyc-upload-content";

import deleteIcon from "@/assets/Delete.svg";
import done01Icon from "@/assets/done 01.png";
import uploadIcon from "@/assets/upload.svg";
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

function UploadSuccessBadge() {
  return (
    <span className={styles.relative_0}>
      <Image src={done01Icon} alt="" fill className={styles.object_contain_1} unoptimized sizes="24px" />
    </span>
  );
}

function UploadFileButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(DESCRIPTION_TO_UPLOAD_GAP_CLASS, styles.flex_0)}
    >
      <span className={styles.relative_0}>
        <Image src={uploadIcon} alt="" fill className={styles.object_contain_1} unoptimized sizes="24px" />
      </span>
      <span className={styles.text_sm_2}>Upload file</span>
    </button>
  );
}

function UploadedFileRow({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className={styles.relative_3}>
      <UploadSuccessBadge />
      <span className={styles.min_w_0_4}>{name}</span>
      <button
        type="button"
        onClick={onRemove}
        className={[styles.cta_ghost_5, "cta-ghost"].filter(Boolean).join(" ")}
        aria-label={`Remove ${name}`}
      >
        <span className={styles.relative_6}>
          <Image src={deleteIcon} alt="" fill className={styles.object_contain_1} unoptimized sizes="20px" />
        </span>
      </button>
    </div>
  );
}

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
            <UploadedFileRow key={file.id} name={file.name} onRemove={() => onRemove(file.id)} />
          ))}
        </div>
      ) : null}

      {files.length === 0 ? <UploadFileButton onClick={onUploadClick} /> : null}

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
