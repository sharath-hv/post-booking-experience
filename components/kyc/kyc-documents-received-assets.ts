/**
 * Documents received screen — illustration from `/public/assets/` (source: `assets/`).
 */
const asset = (filename: string) => `/assets/${encodeURIComponent(filename)}`;

export const DOCUMENTS_RECEIVED_ASSETS = {
  illustration: asset("Documents_received.svg"),
} as const;
