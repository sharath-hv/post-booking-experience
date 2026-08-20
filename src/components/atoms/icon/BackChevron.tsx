import styles from "./BackChevron.module.scss";

/** 24×24 back chevron used in the sticky top nav. */
export function BackChevron() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.icon} aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
