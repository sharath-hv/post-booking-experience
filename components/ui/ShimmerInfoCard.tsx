import type { CSSProperties, ReactNode } from "react";

import infoIcon from "@/assets/Info.svg";
import warningIcon from "@/assets/Warning.svg";

import { cn } from "@/lib/utils";

type ShimmerInfoIcon = "alert" | "clock" | "info";

const WARNING_ICON_MASK_STYLE = {
  maskImage: `url(${warningIcon.src})`,
  WebkitMaskImage: `url(${warningIcon.src})`,
} satisfies CSSProperties;

const INFO_ICON_MASK_STYLE = {
  maskImage: `url(${infoIcon.src})`,
  WebkitMaskImage: `url(${infoIcon.src})`,
} satisfies CSSProperties;

const ICON_PATHS: Record<"clock", ReactNode> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
};

export type ShimmerInfoCardProps = {
  /** `alert` for caveats/checks, `clock` for deadlines/expectations, `info` for general information. */
  icon?: ShimmerInfoIcon;
  /** Bold scent-word prefix, e.g. “Quick check:”. */
  lead?: string;
  children: ReactNode;
  className?: string;
};

/**
 * The app's highlighted-info style: amber outline, soft yellow-to-white
 * gradient, shimmer sweep. Use wherever a line of info must not be missed
 * (caveats, deadlines, stakes).
 */
export function ShimmerInfoCard({ icon = "alert", lead, children, className }: ShimmerInfoCardProps) {
  return (
    <div
      className={cn(
        "next-step-shimmer flex items-center gap-2.5 rounded-2xl border border-[#f3e0b6] bg-[linear-gradient(180deg,rgba(255,247,229,1)_0%,rgba(255,255,255,0.8)_100%)] p-3",
        className
      )}
    >
      {icon === "alert" ? (
        <span
          aria-hidden
          className="h-4 w-4 shrink-0 bg-[#D16900] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
          style={WARNING_ICON_MASK_STYLE}
        />
      ) : icon === "info" ? (
        <span
          aria-hidden
          className="h-5 w-5 shrink-0 bg-[#7a5410] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
          style={INFO_ICON_MASK_STYLE}
        />
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="shrink-0 text-[#a76406]"
        >
          {ICON_PATHS[icon]}
        </svg>
      )}
      <p className="text-xs leading-[18px] text-[#7a5410]">
        {lead ? <span className="font-semibold">{lead} </span> : null}
        {children}
      </p>
    </div>
  );
}
