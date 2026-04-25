"use client";

import Image from "next/image";
import { useCallback, type MouseEvent } from "react";

/** Served from `public/assets/` (synced from repo `assets/Car coverage.svg`). Figma node 2158:10807. */
const CAR_COVERAGE_SRC = `/assets/${encodeURIComponent("Car coverage.svg")}`;

export type ZeroDepInsuranceCoverageCardProps = {
  /** Optional href for “View coverage details” (e.g. policy doc URL). */
  coverageDetailsHref?: string;
};

/**
 * Insurance coverage callout — icon in grey tile, Zero Dep copy, hyperlink (Figma 2158:10807).
 */
export function ZeroDepInsuranceCoverageCard({
  coverageDetailsHref,
}: ZeroDepInsuranceCoverageCardProps) {
  const onPlaceholderClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    if (!coverageDetailsHref) e.preventDefault();
  }, [coverageDetailsHref]);

  return (
    <section
      className="w-full rounded-xl border border-[#e8e8e8] bg-white pl-3 pr-3 pb-3 pt-3 text-left"
      aria-label="Car insurance coverage"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f5f5f5]"
          aria-hidden
        >
          <Image
            src={CAR_COVERAGE_SRC}
            alt=""
            width={24}
            height={24}
            className="size-6 object-contain"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-normal leading-5 text-[#4b4b4b]">
            Your car will be insured with ACKO&apos;s Zero Depreciation Plan.
          </p>
          <a
            href={coverageDetailsHref ?? "#"}
            onClick={onPlaceholderClick}
            className="mt-2 inline-block text-sm font-medium leading-5 text-[#1b73e8] underline-offset-2 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#1b73e8]/30 focus-visible:ring-offset-2"
          >
            View coverage details
          </a>
        </div>
      </div>
    </section>
  );
}
