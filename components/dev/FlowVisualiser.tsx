"use client";

import { useCallback, useMemo, useState } from "react";

export type FlowDeviceChrome = "iphone" | "android";

/** Top-level product journey (e.g. Express vs Standard delivery). */
export type ProductFlowId = "express_delivery" | "standard_delivery";

export type ProductFlowOption = {
  id: ProductFlowId;
  label: string;
};

/** Entries in the “Flows” dropdown — add more use cases as you build them. */
export const PRODUCT_FLOWS: ProductFlowOption[] = [
  { id: "express_delivery", label: "Express delivery" },
  { id: "standard_delivery", label: "Standard delivery" },
];

/** One screen/route the visualiser can load (same-origin iframe). */
export type FlowPreview = {
  id: string;
  label: string;
  path: string;
  /** Optional query string params (e.g. demo flags). */
  query?: Record<string, string>;
};

/** Screens grouped by product flow. Everything built so far lives under Express delivery. */
const SCREENS_BY_PRODUCT_FLOW: Record<ProductFlowId, FlowPreview[]> = {
  express_delivery: [
    { id: "quote", label: "Quote / entry", path: "/quote" },
    { id: "kyc-hub", label: "KYC hub", path: "/kyc" },
    { id: "kyc-upload", label: "KYC — document upload", path: "/kyc/upload" },
    { id: "kyc-processing", label: "KYC — booking processing", path: "/kyc/processing" },
    { id: "kyc-documents-received", label: "KYC — documents received", path: "/kyc/documents-received" },
    { id: "kyc-booking-confirmed", label: "KYC — booking confirmed (celebration)", path: "/kyc/booking-confirmed" },
    {
      id: "kyc-car-allocation-pending",
      label: "KYC — car allocation pending",
      path: "/kyc/car-allocation-pending",
    },
    {
      id: "kyc-car-allocation-confirmed",
      label: "KYC — car allocation confirmed",
      path: "/kyc/car-allocation-confirmed",
    },
    { id: "payment-choose", label: "Payment — choose method", path: "/payment/choose" },
    { id: "payment-default", label: "Payment — default (how to pay)", path: "/payment/default" },
    { id: "payment-checkout", label: "Payment — mock checkout (no down_payment)", path: "/payment" },
    {
      id: "payment-checkout-down",
      label: "Payment — mock checkout (with down_payment)",
      path: "/payment",
      query: { down_payment: "125000", loan_amount: "800000", bank: "hdfc" },
    },
    { id: "payment-booking-success", label: "Payment — booking payment success", path: "/payment/booking-success" },
    {
      id: "payment-down-payment-success",
      label: "Payment — down payment success (partial, sample)",
      path: "/payment/down-payment-success",
      query: {
        bank: "hdfc",
        loan_amount: "1073780",
        original_down_payment: "300000",
        paid: "100000",
        remaining: "200000",
      },
    },
    {
      id: "payment-down-payment-insurance",
      label: "Payment — insurance setup (after full DP)",
      path: "/payment/down-payment-insurance-setup",
    },
    {
      id: "payment-car-delivery-insurance-prep",
      label: "Payment — delivery prep & insurance",
      path: "/payment/car-delivery-insurance-prep",
    },
    {
      id: "payment-car-delivery-rto",
      label: "Payment — RTO registration (after insurance)",
      path: "/payment/car-delivery-rto",
    },
    {
      id: "payment-car-delivery-schedule",
      label: "Payment — select delivery date",
      path: "/payment/car-delivery-schedule",
    },
    {
      id: "payment-pay-down-remaining",
      label: "Payment — pay down payment (after partial)",
      path: "/payment/pay-down-payment",
      query: {
        bank: "hdfc",
        loan_amount: "1123780",
        down_payment: "250000",
        original_down_payment: "300000",
      },
    },
    {
      id: "payment-acko-finance-confirmed",
      label: "Payment — ACKO Drive finance confirmed",
      path: "/payment/acko-drive-finance-confirmed",
      query: { bank: "hdfc" },
    },
    { id: "payment-choose-loan", label: "Payment — choose loan amount", path: "/payment/choose-loan-amount" },
    { id: "payment-loan-processing", label: "Payment — loan processing", path: "/payment/loan-processing" },
    { id: "payment-loan-sanctioned", label: "Payment — loan sanctioned", path: "/payment/loan-sanctioned" },
    { id: "payment-loan-docs-upload", label: "Payment — loan documents upload", path: "/payment/loan-documents-upload" },
    {
      id: "payment-loan-docs-received",
      label: "Payment — loan documents received",
      path: "/payment/loan-documents-received",
    },
    { id: "payment-pay-down-payment", label: "Payment — pay down payment intro", path: "/payment/pay-down-payment" },
  ],
  standard_delivery: [],
};

/** All Express delivery screens (convenience export for tooling). */
export const EXPRESS_DELIVERY_SCREENS = SCREENS_BY_PRODUCT_FLOW.express_delivery;

/** @deprecated Prefer `EXPRESS_DELIVERY_SCREENS` or pick from `SCREENS_BY_PRODUCT_FLOW` via product flow. */
export const FLOWS = EXPRESS_DELIVERY_SCREENS;

function buildFlowSrc(flow: FlowPreview): string {
  const path = flow.path.startsWith("/") ? flow.path : `/${flow.path}`;
  const q = new URLSearchParams();
  if (flow.query) {
    Object.entries(flow.query).forEach(([k, v]) => q.set(k, v));
  }
  const qs = q.toString();
  return qs ? `${path}?${qs}` : path;
}

/** Outer chrome size for flow visualiser (matches common mobile artboard). */
const MOCK_DEVICE_WIDTH_PX = 360;
const MOCK_DEVICE_HEIGHT_PX = 760;

function IPhoneFrame({ iframeSrc }: { iframeSrc: string }) {
  return (
    <div
      className="box-border flex shrink-0 flex-col overflow-hidden rounded-[2.75rem] border-[10px] border-[#1c1c1f] bg-[#1c1c1f] shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
      style={{ width: MOCK_DEVICE_WIDTH_PX, height: MOCK_DEVICE_HEIGHT_PX }}
      role="presentation"
      aria-label="iPhone-style preview frame"
    >
      <div className="relative z-10 shrink-0 bg-white">
        <div className="flex h-8 items-center justify-between px-4 py-1 text-[13px] font-semibold leading-none tracking-tight text-[#000]">
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
      <iframe title="App preview" src={iframeSrc} className="min-h-0 w-full flex-1 border-0 bg-white" />
    </div>
  );
}

function AndroidFrame({ iframeSrc }: { iframeSrc: string }) {
  return (
    <div
      className="box-border flex shrink-0 flex-col overflow-hidden rounded-[20px] border-[6px] border-[#2d2d2d] bg-[#2d2d2d] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      style={{ width: MOCK_DEVICE_WIDTH_PX, height: MOCK_DEVICE_HEIGHT_PX }}
      role="presentation"
      aria-label="Android-style preview frame"
    >
      <div className="relative z-10 shrink-0 bg-[#f7f7f7]">
        <div className="flex h-2 justify-center pt-2" aria-hidden>
          <div className="h-[10px] w-[10px] rounded-full bg-[#1a1a1a]" title="Camera" />
        </div>
        <div className="flex h-10 items-center justify-between px-4 pb-1 text-[13px] font-medium text-[#1a1a1a]">
          <span>9:41</span>
          <div className="flex items-center gap-1.5" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" className="text-[#1a1a1a]">
              <path
                fill="currentColor"
                d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"
              />
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" className="text-[#1a1a1a]">
              <path
                fill="currentColor"
                d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V8h2v6z"
              />
            </svg>
          </div>
        </div>
      </div>
      <iframe title="App preview" src={iframeSrc} className="min-h-0 w-full flex-1 border-0 bg-white" />
    </div>
  );
}

export function FlowVisualiser() {
  const initialScreens = SCREENS_BY_PRODUCT_FLOW.express_delivery;
  const [productFlowId, setProductFlowId] = useState<ProductFlowId>("express_delivery");
  const [selectedScreenId, setSelectedScreenId] = useState(initialScreens[0]!.id);
  const [iframeSrc, setIframeSrc] = useState(() => buildFlowSrc(initialScreens[0]!));
  const [iframeKey, setIframeKey] = useState(0);
  const [device, setDevice] = useState<FlowDeviceChrome>("iphone");

  const screensForFlow = useMemo(() => SCREENS_BY_PRODUCT_FLOW[productFlowId], [productFlowId]);

  const selectedScreen = useMemo(() => {
    if (screensForFlow.length === 0) return null;
    return screensForFlow.find((s) => s.id === selectedScreenId) ?? screensForFlow[0]!;
  }, [screensForFlow, selectedScreenId]);

  const loadPreview = useCallback(() => {
    if (!selectedScreen) return;
    setIframeSrc(buildFlowSrc(selectedScreen));
    setIframeKey((k) => k + 1);
  }, [selectedScreen]);

  const handleProductFlowChange = useCallback((nextId: ProductFlowId) => {
    setProductFlowId(nextId);
    const nextScreens = SCREENS_BY_PRODUCT_FLOW[nextId];
    setSelectedScreenId(nextScreens[0]?.id ?? "");
  }, []);

  const canLoad = selectedScreen != null;

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#0f0f0f] font-sans text-neutral-100">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <aside className="flex min-h-0 w-full shrink-0 flex-col gap-4 overflow-y-auto border-neutral-800 p-4 sm:p-5 md:h-full md:w-80 md:max-w-[min(380px,40vw)] md:border-r md:border-t-0 border-t">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">Flow visualiser</h1>
            <p className="mt-1 text-xs text-neutral-400">
              Dev-only. Choose a product flow, then a screen, pick device chrome, and Load. Iframe hot-reloads with
              source edits.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="product-flow-select"
              className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500"
            >
              Flows
            </label>
            <select
              id="product-flow-select"
              value={productFlowId}
              onChange={(e) => handleProductFlowChange(e.target.value as ProductFlowId)}
              className="w-full rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {PRODUCT_FLOWS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="screen-select"
              className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500"
            >
              Screen
            </label>
            <select
              id="screen-select"
              value={screensForFlow.length > 0 ? selectedScreenId : ""}
              onChange={(e) => setSelectedScreenId(e.target.value)}
              disabled={screensForFlow.length === 0}
              className="w-full rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {screensForFlow.length === 0 ? (
                <option value="">No screens in this flow yet</option>
              ) : (
                screensForFlow.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Mobile viewer
            </span>
            <div className="flex w-full rounded-lg border border-neutral-600 p-0.5" role="group" aria-label="Device chrome">
              <button
                type="button"
                onClick={() => setDevice("iphone")}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
                  device === "iphone"
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                iPhone
              </button>
              <button
                type="button"
                onClick={() => setDevice("android")}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
                  device === "android"
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Android
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={loadPreview}
            disabled={!canLoad}
            className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Load
          </button>

          <p className="break-all font-mono text-[11px] leading-relaxed text-neutral-500" title={iframeSrc}>
            {iframeSrc}
          </p>

          <div className="mt-auto border-t border-neutral-800 pt-4 text-[11px] text-neutral-500">
            <p className="font-medium text-neutral-400">Tools</p>
            <p className="mt-1">
              Legacy URL mock:{" "}
              <a href="/dev/mobile-mock?path=/quote" className="text-sky-400 underline hover:text-sky-300">
                /dev/mobile-mock
              </a>
            </p>
          </div>
        </aside>

        <main className="flex max-md:min-h-[42dvh] min-h-0 flex-1 flex-col items-center justify-center overflow-auto border-t border-neutral-800 bg-[#0a0a0a] p-4 md:border-t-0 md:py-8">
          {device === "iphone" ? (
            <IPhoneFrame key={iframeKey} iframeSrc={iframeSrc} />
          ) : (
            <AndroidFrame key={iframeKey} iframeSrc={iframeSrc} />
          )}
        </main>
      </div>
    </div>
  );
}
