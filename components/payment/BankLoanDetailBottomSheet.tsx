"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  formatBankRate,
  type BankLoanTerms,
} from "@/components/payment/bank-loan-terms";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";

/** Enter/exit slide duration — parity with the rest of the payment sheet family. */
const SHEET_TRANSITION_MS = 280;

function DetailSection({
  title,
  body,
  showDivider = false,
}: {
  title: string;
  body: string;
  showDivider?: boolean;
}) {
  return (
    <div className={showDivider ? "border-t border-dashed border-[#e8e8e8] pt-4" : undefined}>
      <p className="text-base font-medium leading-6 text-[#121212]">{title}</p>
      <p className="mt-1.5 text-sm leading-5 text-[#4b4b4b]">{body}</p>
    </div>
  );
}

type BankLoanDetailBottomSheetProps = {
  bank: BankLoanTerms | null;
  onClose: () => void;
  onConfirm: (bankId: string) => void;
};

/**
 * Bank detail — full loan terms, one bank at a time. Replaces the CX call
 * that used to walk customers through foreclosure and part-payment before
 * they'd commit. Only renders sections the bank actually has data for.
 */
export function BankLoanDetailBottomSheet({
  bank,
  onClose,
  onConfirm,
}: BankLoanDetailBottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [renderedBank, setRenderedBank] = useState<BankLoanTerms | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = bank != null;

  useEffect(() => {
    if (!open) return;
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setRenderedBank(bank);
    setMounted(true);
    setAnimateIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open, bank]);

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

  const handleConfirm = useCallback(() => {
    if (renderedBank) onConfirm(renderedBank.id);
  }, [onConfirm, renderedBank]);

  if (!mounted || !renderedBank) return null;

  return (
    <div className={`fixed inset-0 ${BOTTOM_SHEET_OVERLAY_Z_CLASS}`}>
      <button
        type="button"
        className={`absolute inset-0 bg-black/90 transition-opacity duration-[280ms] ease-out motion-reduce:opacity-100 motion-reduce:transition-none ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-label="Dismiss"
      />
      <div
        className={`absolute bottom-0 left-1/2 z-10 flex ${BOTTOM_SHEET_MAX_HEIGHT_CLASS} w-full max-w-[640px] -translate-x-1/2 flex-col overflow-hidden rounded-t-[20px] bg-white sheet-elevated transition-transform duration-[280ms] ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${
          animateIn ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-detail-sheet-title"
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            className={`min-h-0 flex-1 overflow-y-auto px-5 pt-6 ${BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#f5f5f5]">
                  <Image
                    src={renderedBank.logoSrc}
                    alt=""
                    fill
                    className="object-contain p-1.5"
                    unoptimized
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    id="bank-detail-sheet-title"
                    className="truncate text-xl font-semibold leading-7 text-[#121212]"
                  >
                    {renderedBank.name}
                  </h2>
                  <p className="mt-0.5 text-xs leading-[18px] text-[#757575]">
                    From {formatBankRate(renderedBank)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="cta-ghost -mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#121212] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/20 focus-visible:ring-offset-2"
                aria-label="Close"
              >
                <BottomSheetCloseIcon />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {(
                [
                  renderedBank.rateTypeCopy
                    ? { title: "Interest rate", body: renderedBank.rateTypeCopy }
                    : null,
                  renderedBank.foreclosure?.copy
                    ? {
                        title: "Closing the loan early",
                        body: renderedBank.foreclosure.copy,
                      }
                    : null,
                  renderedBank.partPayment?.copy
                    ? {
                        title: "Paying extra during the loan",
                        body: renderedBank.partPayment.copy,
                      }
                    : null,
                ] as const
              )
                .filter((section): section is { title: string; body: string } => section != null)
                .map((section, index) => (
                  <DetailSection
                    key={section.title}
                    title={section.title}
                    body={section.body}
                    showDivider={index > 0}
                  />
                ))}
            </div>
          </div>

          <div
            className={`shrink-0 bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] ${BOTTOM_SHEET_CTA_STRIP_TOP_CLASS}`}
          >
            <button type="button" onClick={handleConfirm} className="primary-cta w-full">
              Continue with {renderedBank.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
