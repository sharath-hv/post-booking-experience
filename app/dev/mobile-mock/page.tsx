"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Dev-only: interactive app preview inside an iPhone-style chrome + status bar.
 * Open: /dev/mobile-mock?path=/payment&bank=hdfc
 * All query params except `path` are forwarded to the iframe URL.
 */
function MobileMockContent() {
  const searchParams = useSearchParams();

  const iframeSrc = useMemo(() => {
    const raw = searchParams.get("path") ?? "/payment";
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    const q = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key === "path") return;
      q.set(key, value);
    });
    const qs = q.toString();
    return qs ? `${path}?${qs}` : path;
  }, [searchParams]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0f0f0f] p-4 font-sans">
      <p className="mb-4 max-w-xl text-center text-xs text-neutral-400">
        Same-origin iframe — full interaction. Adjust URL:{" "}
        <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-[11px] text-neutral-200">
          ?path=/payment/acko-drive-finance-confirmed&bank=hdfc
        </code>
      </p>

      <div
        className="flex w-[min(393px,calc(100vw-32px))] max-w-[393px] flex-col overflow-hidden rounded-[2.75rem] border-[10px] border-[#1c1c1f] bg-[#1c1c1f] shadow-[0_25px_80px_rgba(0,0,0,0.55)] aspect-[393/852] max-h-[min(852px,90vh)]"
        role="presentation"
        aria-label="iPhone-style preview frame"
      >
        {/* Dynamic Island + status bar area */}
        <div className="relative z-10 shrink-0 bg-white">
          <div className="flex h-3 justify-center pt-2">
            <div
              className="h-[28px] w-[100px] rounded-full bg-black/90"
              aria-hidden
            />
          </div>
          <div className="flex h-11 items-end justify-between px-6 pb-1.5 text-[15px] font-semibold tracking-tight text-[#000]">
            <span>9:41</span>
            <div className="flex items-center gap-1 pr-0.5" aria-hidden>
              <svg width="18" height="12" viewBox="0 0 18 12" className="text-[#000]">
                <rect x="0" y="7" width="3" height="5" rx="0.5" fill="currentColor" />
                <rect x="5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
                <rect x="10" y="3" width="3" height="9" rx="0.5" fill="currentColor" />
                <rect x="15" y="1" width="3" height="11" rx="0.5" fill="currentColor" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" className="text-[#000]">
                <path
                  fill="currentColor"
                  d="M8 2.5c2.2 0 4 1.5 4 3.5 0 .4-.1.8-.2 1.1l1.2.7c.2-.6.3-1.2.3-1.8 0-3-2.7-5.5-6-5.5S1.5 3 1.5 6c0 .6.1 1.2.3 1.8l1.2-.7c-.1-.3-.2-.7-.2-1.1 0-2 1.8-3.5 4-3.5z"
                />
                <path fill="currentColor" d="M8 5c1.1 0 2 .7 2 1.5S9.1 8 8 8s-2-.7-2-1.5S6.9 5 8 5z" />
              </svg>
              <svg width="25" height="12" viewBox="0 0 25 12" className="text-[#000]">
                <rect
                  x="1"
                  y="2"
                  width="21"
                  height="8"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <rect x="22.5" y="4.5" width="2" height="3" rx="0.5" fill="currentColor" />
                <rect x="3" y="4" width="15" height="4" rx="1" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* App */}
        <iframe
          title="App preview"
          src={iframeSrc}
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      </div>
    </div>
  );
}

function MobileMockFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0f0f0f] text-sm text-neutral-400">
      Loading preview…
    </div>
  );
}

export default function DevMobileMockPage() {
  return (
    <Suspense fallback={<MobileMockFallback />}>
      <MobileMockContent />
    </Suspense>
  );
}
