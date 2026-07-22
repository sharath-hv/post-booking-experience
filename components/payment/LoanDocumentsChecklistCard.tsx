"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import bankIcon from "@/assets/bank.svg";
import cameraIcon from "@/assets/Camera.svg";
import documentIcon from "@/assets/Document_black.svg";
import fileIcon from "@/assets/file.svg";
import homeIcon from "@/assets/Home.svg";
import identityIcon from "@/assets/Identity.svg";
import invoiceIcon from "@/assets/Invoice.svg";
import { OVERLAY_GLASS_SURFACE_CLASS } from "@/lib/overlay-glass-card";
import { cn } from "@/lib/utils";
import styles from "./LoanDocumentsChecklistCard.module.scss";

type EmploymentTab = "salaried" | "self_employed";

type DocItem = { icon: StaticImageData; label: string; reason: string };

/** [Figma — Keep these documents handy](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=1951-13375) */
const SALARIED_DOCUMENTS: readonly DocItem[] = [
  { icon: identityIcon, label: "Aadhaar + PAN", reason: "For identity verification" },
  { icon: invoiceIcon, label: "3 months' salary slips", reason: "To verify your income" },
  { icon: bankIcon, label: "6 months' bank statement", reason: "To verify your banking activity" },
  { icon: documentIcon, label: "Form 16 · last 2 years", reason: "To verify your tax details" },
  { icon: homeIcon, label: "Current address proof", reason: "Any one valid document" },
  { icon: cameraIcon, label: "Passport-size photo", reason: "Recent colour photo" },
] as const;

const SELF_EMPLOYED_DOCUMENTS: readonly DocItem[] = [
  { icon: identityIcon, label: "Aadhaar + PAN", reason: "For identity verification" },
  { icon: documentIcon, label: "ITR · last 2 years", reason: "To verify your tax details" },
  { icon: bankIcon, label: "6 months' bank statement", reason: "To verify your banking activity" },
  {
    icon: fileIcon,
    label: "GST / business proof",
    reason: "Registration, GST, or shop act license",
  },
  { icon: homeIcon, label: "Current address proof", reason: "Any one valid document" },
  { icon: cameraIcon, label: "Passport-size photo", reason: "Recent colour photo" },
] as const;

function DocRow({ icon, label, reason }: DocItem) {
  return (
    <li className={styles.docRow}>
      <span className={styles.docIcon} aria-hidden>
        <Image
          src={icon}
          alt=""
          width={20}
          height={20}
          className={styles.docIconAsset}
          unoptimized
        />
      </span>
      <div className={styles.docCopy}>
        <p className={styles.docLabel}>{label}</p>
        <p className={styles.docReason}>{reason}</p>
      </div>
    </li>
  );
}

export type LoanDocumentsChecklistCardProps = {
  /** `glass` — frosted surface matching arrival PlanList / AmountReceivedCard. */
  variant?: "default" | "glass";
};

/**
 * The loan document checklist, upfront — no “see checklist” click.
 * Header → employment tabs → document list → friction-melting footer.
 */
export function LoanDocumentsChecklistCard({
  variant = "default",
}: LoanDocumentsChecklistCardProps) {
  const [tab, setTab] = useState<EmploymentTab>("salaried");
  const items = tab === "salaried" ? SALARIED_DOCUMENTS : SELF_EMPLOYED_DOCUMENTS;
  const isGlass = variant === "glass";

  return (
    <div
      className={cn(
        isGlass ? OVERLAY_GLASS_SURFACE_CLASS : styles.card,
        !isGlass && "card-elevated",
        isGlass && styles.cardGlass,
      )}
    >
      <div className={styles.tabs} role="tablist" aria-label="Employment type">
        {(
          [
            { id: "salaried", label: "Salaried" },
            { id: "self_employed", label: "Self-employed" },
          ] as const
        ).map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={tab === option.id}
            aria-controls="loan-documents-checklist"
            onClick={() => setTab(option.id)}
            className={cn(styles.tab, tab === option.id ? styles.tabActive : styles.tabIdle)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ul id="loan-documents-checklist" className={styles.list}>
        {items.map((item) => (
          <DocRow key={item.label} {...item} />
        ))}
      </ul>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          <span className={styles.footerLead}>Missing one?</span> Start anyway. You can add it
          while I keep the rest moving.
        </p>
      </div>
    </div>
  );
}
