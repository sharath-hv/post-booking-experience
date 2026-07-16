"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmploymentTab = "salaried" | "self_employed";

type DocIcon = "id" | "slip" | "bank" | "file" | "home" | "photo" | "business";

type DocItem = { icon: DocIcon; label: string };

/** [Figma — Keep these documents handy](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=1951-13375) */
const SALARIED_DOCUMENTS: readonly DocItem[] = [
  { icon: "id", label: "Aadhaar + PAN" },
  { icon: "slip", label: "3 months' salary slips" },
  { icon: "bank", label: "6 months' bank statement" },
  { icon: "file", label: "Form 16 · last 2 years" },
  { icon: "home", label: "Current address proof" },
  { icon: "photo", label: "Passport-size photo" },
] as const;

const SELF_EMPLOYED_DOCUMENTS: readonly DocItem[] = [
  { icon: "id", label: "Aadhaar + PAN" },
  { icon: "file", label: "ITR · last 2 years" },
  { icon: "bank", label: "6 months' bank statement" },
  { icon: "business", label: "GST / business proof" },
  { icon: "home", label: "Current address proof" },
  { icon: "photo", label: "Passport-size photo" },
] as const;

const ICONS: Record<DocIcon, ReactNode> = {
  id: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="8.4" cy="11" r="1.9" />
      <path d="M5.6 16.2c.5-1.5 1.6-2.3 2.8-2.3s2.3.8 2.8 2.3" />
      <path d="M14 9.5h4.5M14 13h4.5" />
    </>
  ),
  slip: (
    <>
      <path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" />
      <path d="M9.5 8.5h5M9.5 12h5" />
    </>
  ),
  bank: (
    <>
      <path d="M3.5 9.5 12 4l8.5 5.5" />
      <path d="M5.5 10v7M10 10v7M14 10v7M18.5 10v7" />
      <path d="M4 19.5h16" />
    </>
  ),
  file: (
    <>
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 12h6M9 15.5h6" />
    </>
  ),
  home: (
    <>
      <path d="M4 11.5 12 4.5l8 7" />
      <path d="M6 10v9.5h12V10" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  photo: (
    <>
      <rect x="3.5" y="6" width="17" height="13.5" rx="2.5" />
      <path d="M8.5 6 10 3.8h4L15.5 6" />
      <circle cx="12" cy="12.5" r="3.2" />
    </>
  ),
  business: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" />
      <path d="M9 7.5V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8v1.7" />
      <path d="M3.5 12.5h17" />
    </>
  ),
};

function DocTile({ icon, label }: DocItem) {
  return (
    <li className="flex items-center gap-2.5 rounded-xl border border-[#ececec] bg-white px-3 py-2.5">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-[#4b4b4b]"
        aria-hidden
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ICONS[icon]}
        </svg>
      </span>
      <span className="min-w-0 text-xs font-medium leading-4 text-[#121212]">{label}</span>
    </li>
  );
}

/**
 * The loan document checklist, upfront — no “see checklist” click. One card:
 * employment toggle, six scannable tiles, and a friction-melting footer.
 */
export function LoanDocumentsChecklistCard() {
  const [tab, setTab] = useState<EmploymentTab>("salaried");
  const items = tab === "salaried" ? SALARIED_DOCUMENTS : SELF_EMPLOYED_DOCUMENTS;

  return (
    <div className="overflow-hidden rounded-2xl bg-white card-elevated text-left">
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div className="min-w-0">
          <p className="text-base font-medium leading-6 text-[#121212]">Keep these ready</p>
          <p className="mt-0.5 text-xs leading-[18px] text-[#757575]">
            Photos or PDFs. Nothing needs printing.
          </p>
        </div>
      </div>

      <div
        className="mx-4 mt-3 flex rounded-full bg-[#f5f5f5] p-1"
        role="tablist"
        aria-label="Employment type"
      >
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
            className={cn(
              "h-8 flex-1 rounded-full text-sm font-medium leading-4 transition-colors",
              tab === option.id
                ? "bg-white text-[#121212] shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                : "text-[#757575] hover:text-[#4b4b4b]"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ul id="loan-documents-checklist" className="grid list-none grid-cols-2 gap-2 p-4">
        {items.map((item) => (
          <DocTile key={item.label} {...item} />
        ))}
      </ul>

      <div className="border-t border-[#e8e8e8] bg-[#fafafa] px-4 py-2.5">
        <p className="text-xs leading-[18px] text-[#757575]">
          Missing one? Start anyway. You can add it while I keep the rest moving.
        </p>
      </div>
    </div>
  );
}
