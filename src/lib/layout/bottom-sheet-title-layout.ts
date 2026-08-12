import styles from "./bottom-sheet-title-layout.module.scss";

/**
 * Content row inside a `max-w-[640px]` sheet with `px-5` is ~320px wide.
 * - With a hero illustration, the title can use the full row (`w-full`); no `pr-12`.
 * - Without an illustration, keep the title to `w-[272px]` (320 − 48) so the absolute
 *   close control has its gutter without extra padding on the heading.
 */
export const bottomSheetTitleWidthWithIllustration = styles.withIllustration;
export const bottomSheetTitleWidthWithoutIllustration = styles.withoutIllustration;
