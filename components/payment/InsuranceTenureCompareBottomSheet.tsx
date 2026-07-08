"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import {
  INSURANCE_TENURE_COMPARE_BENEFITS,
  INSURANCE_TENURE_COMPARE_ROWS,
  INSURANCE_TENURE_COMPARE_SHEET_TITLE,
  INSURANCE_TENURE_COMPARE_WHAT_YOU_GET,
  type InsuranceCoverageItem,
} from "@/components/payment/insurance-coverage-content";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";

/** Enter/exit slide duration — keep in sync with `InsuranceCoverageBottomSheet` */
const SHEET_TRANSITION_MS = 280;

function CompareYearCell({ years }: { years: number }) {
  return (
    <div className="flex h-9 flex-col justify-center text-center">
      <p className="text-[#040222]">
        <span className="text-base font-medium leading-6 tabular-nums">{years}</span>
        <span className="text-xs leading-[18px]"> year</span>
      </p>
    </div>
  );
}

function CompareBenefitRow({ iconSrc, title, description }: InsuranceCoverageItem) {
  return (
    <div className="flex gap-3">
      <div className="relative size-14 shrink-0" aria-hidden>
        <Image
          src={iconSrc}
          alt=""
          width={56}
          height={56}
          className="size-14 object-contain"
          unoptimized
          sizes="56px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-5 text-[#121212]">{title}</p>
        <p className="mt-2 text-xs font-normal leading-[18px] text-[#4b4b4b]">{description}</p>
      </div>
    </div>
  );
}

function CompareTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8e8e8]">
      {/* Use relative positioning so the Extended column gradient can be an absolute overlay */}
      <div className="relative grid grid-cols-[minmax(0,1.2fr)_100px_100px]">
        {/* Extended column full-height purple gradient overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[100px] bg-[linear-gradient(to_bottom,#f4eefe,rgba(244,238,254,0))]"
        />

        {/* Header row */}
        <div className="border-b border-[#e8e8e8] py-3 pl-4">
          <p className="text-sm font-medium leading-5 text-[#121212]">
            Coverage
            <br />
            type
          </p>
        </div>
        <div className="border-b border-l border-[#e8e8e8] p-3">
          <p className="text-center text-sm font-medium leading-5 text-[#121212]">
            Standard
            <br />
            cover
          </p>
        </div>
        <div className="relative border-b border-l border-[#e8e8e8] p-3">
          <p className="text-center text-sm font-semibold leading-5 bg-[linear-gradient(105deg,#251c40_0%,#5920c5_100%)] bg-clip-text text-transparent">
            Extended
            <br />
            Cover
          </p>
        </div>

        {/* Data rows */}
        {INSURANCE_TENURE_COMPARE_ROWS.map((row) => (
          <Fragment key={row.id}>
            <div className="flex flex-col justify-center py-3 pl-4 text-xs leading-[18px] text-[#040222]">
              {row.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="border-l border-[#e8e8e8] px-4 py-3">
              <CompareYearCell years={row.standardYears} />
            </div>
            <div className="relative border-l border-[#e8e8e8] px-4 py-3">
              <CompareYearCell years={row.extendedYears} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export type InsuranceTenureCompareBottomSheetProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Standard vs extended tenure compare sheet —
 * [Figma 322:5666](https://www.figma.com/design/FEPATa8H2Eflz7FZm5LKuL/3-3-insurance-upsell?node-id=322-5666).
 */
export function InsuranceTenureCompareBottomSheet({
  open,
  onClose,
}: InsuranceTenureCompareBottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setMounted(true);
    setAnimateIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return;
    setAnimateIn(false);
    exitTimeoutRef.current = setTimeout(() => {
      exitTimeoutRef.current = null;
      setMounted(false);
    }, SHEET_TRANSITION_MS);
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  const onBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={`fixed inset-0 ${BOTTOM_SHEET_OVERLAY_Z_CLASS}`}>
        <button
          type="button"
          className={`absolute inset-0 bg-black/90 transition-opacity duration-[280ms] ease-out motion-reduce:opacity-100 motion-reduce:transition-none ${
            animateIn ? "opacity-100" : "opacity-0"
          }`}
          onClick={onBackdropClick}
          aria-label="Dismiss"
        />
        <div
          className={`absolute bottom-0 left-1/2 z-10 flex ${BOTTOM_SHEET_MAX_HEIGHT_CLASS} w-full max-w-[640px] -translate-x-1/2 flex-col overflow-hidden rounded-t-[20px] bg-white sheet-elevated transition-transform duration-[280ms] ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${
            animateIn ? "translate-y-0" : "translate-y-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="insurance-tenure-compare-sheet-title"
        >
          <div className="relative flex min-h-0 flex-1 flex-col">
            <header className="relative z-10 shrink-0 bg-white px-5 pb-0 pt-6">
              <div className="flex items-start justify-between gap-4">
                <h2
                  id="insurance-tenure-compare-sheet-title"
                  className="min-w-0 flex-1 text-left text-xl font-semibold leading-7 tracking-[-0.1px] text-[#121212]"
                >
                  {INSURANCE_TENURE_COMPARE_SHEET_TITLE}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="cta-ghost -mr-1 -mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg text-[#121212] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/20 focus-visible:ring-offset-2"
                  aria-label="Close"
                >
                  <BottomSheetCloseIcon />
                </button>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-full h-6 bg-[linear-gradient(to_bottom,#ffffff,rgba(255,255,255,0))]"
              />
            </header>

            <div
              className={`min-h-0 flex-1 overflow-y-auto px-5 pt-6 ${BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS}`}
            >
              <div className="flex flex-col gap-8">
                <CompareTable />

                <div className="flex flex-col gap-5">
                  <p className="text-sm font-medium leading-5 text-[#757575]">
                    {INSURANCE_TENURE_COMPARE_WHAT_YOU_GET}
                  </p>
                  <div className="flex flex-col gap-4">
                    {INSURANCE_TENURE_COMPARE_BENEFITS.map((item) => (
                      <CompareBenefitRow key={item.title} {...item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`relative shrink-0 bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] ${BOTTOM_SHEET_CTA_STRIP_TOP_CLASS}`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-full h-6 bg-[linear-gradient(to_top,#ffffff,rgba(255,255,255,0))]"
              />
              <button type="button" onClick={onClose} className="primary-cta w-full">
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
