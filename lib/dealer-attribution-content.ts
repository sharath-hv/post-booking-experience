/**
 * Dealer naming rule:
 * - Before the user starts paying the car (down payment / part / full amount beyond
 *   the booking lock): use `PARTNER_DEALER_*` — never the real dealer name.
 * - After payment has started: use `NAMED_DEALER_*` (demo fulfilment dealer).
 */

/** Car attribution — who's sourced/reserved the car (not the fulfilment dealer). */
export const CAR_SOURCE_NAME = "ACKO Drive";
export const CAR_SOURCE_DETAIL = "Sourced & reserved for you";

/** Generic fulfilment dealer — only before down payment / part payment starts. */
export const PARTNER_DEALER_LABEL = "our partner dealer";
export const PARTNER_DEALER_LABEL_CAPITALIZED = "Our partner dealer";

/** Demo fulfilment dealer — reveal after the user has started paying the car. */
export const NAMED_DEALER_NAME = "Advaith Hyundai";
export const NAMED_DEALER_DETAIL = "Whitefield · Bengaluru";

/**
 * Mid-sentence / title-case forms once payment has started.
 * Proper names are identical in both cases.
 */
export const NAMED_DEALER_LABEL = NAMED_DEALER_NAME;
export const NAMED_DEALER_LABEL_CAPITALIZED = NAMED_DEALER_NAME;
