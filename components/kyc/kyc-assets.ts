/**
 * KYC pending screen assets.
 * Files live under `/public/assets/` (sync from repo `assets/`).
 */
const asset = (filename: string) => `/assets/${encodeURIComponent(filename)}`;

export const KYC_ASSETS = {
  avatar: asset("Shivi image.png"),
  getHelp: asset("get help.svg"),
  onlineDot: asset("online.svg"),
  warning: asset("Warning.svg"),
  askShivi: asset("Ask shivi.svg"),
  iconBooking: asset("Your booking details.svg"),
  iconPayment: asset("Payment summary.svg"),
  iconModify: asset("Modify booking.svg"),
  chevronRight: asset("Chevron_right.svg"),
  /** What’s next — vertical timeline step states */
  timelineDone: asset("Done.svg"),
  timelineInProgress: asset("in progress.svg"),
  timelineNext: asset("Next step.svg"),
} as const;
