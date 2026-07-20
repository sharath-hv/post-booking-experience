import styles from "./bottom-sheet-layout.module.scss";
/** Full-screen bottom sheet scrim + panel — above ConciergeTurnShell header chrome (z-110). */
export const BOTTOM_SHEET_OVERLAY_Z_CLASS = styles.bottomSheetOverlayZ;

/**
 * Max height for scrollable bottom sheets — 90% of dynamic viewport.
 * Do not use on content-sized sheets without scroll (e.g. Shivi intro).
 */
export const BOTTOM_SHEET_MAX_HEIGHT_CLASS = styles.bottomSheetMaxHeight;

/**
 * Space between the bottom-sheet scroll body (end of copy/cards) and the CTA strip (32px).
 * Use `pb-8` on the body and `pt-0` on the footer so the gap is exactly 32px — do not add extra `pt-*` on the CTA row.
 */
export const BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS = styles.bottomSheetBodyBeforeCta;
export const BOTTOM_SHEET_CTA_STRIP_TOP_CLASS = styles.bottomSheetCtaStripTop;

/** Scroll-only sheets — outer panel clips; header stays fixed, body scrolls. */
export const BOTTOM_SHEET_SCROLL_PANEL_CLASS = styles.bottomSheetScrollPanel;

/** Scroll region below a fixed sheet header. Do not add `flex flex-col` here — wrap content instead. */
export const BOTTOM_SHEET_SCROLL_BODY_CLASS = styles.bottomSheetScrollBody;
