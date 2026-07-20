import styles from "./layout-classes.module.scss";

/**
 * Default screen shell: fluid width up to 640px, centered.
 * Must match `--app-max-width` in `app/globals.css`.
 */
export const APP_MAX_WIDTH_PX = 640;

/** Centered column for page content and fixed footers/sheets. */
export const appShellClass = styles.appShell;

/** Inner blocks that should span the shell (replaces legacy 320px caps). */
export const appContentWidthClass = styles.appContentWidth;
