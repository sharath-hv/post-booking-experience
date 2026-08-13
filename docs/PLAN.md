# Post-booking experience — implementation plan

Living document: update this file when flows, routes, or UI behavior change.

---

## Concierge experience (branch: `concierge`) — first draft

The journey is being redesigned as a conversation with **Shivi** (first-person voice, no chat thread). Every converted page is a **turn**: the user's last reply lands as a sent chip (echo) → Shivi speaks (word-by-word) → she hands over an artifact (card) or visibly works (activity feed) → the user replies via user-voice CTAs, or a demo **time-skip pill** stands in for days passing.

### Booking & Delivery Policy alignment

The business policy (5 stages; Booking Confirmation = lock point; 50%-of-total-paid cancellation; one ₹5,000 model/colour change; CYP deadlines; 100% refund on ACKO failure) governs all flows. **Stage mapping:** Booking Request = arrival · KYC = identity chapter · Booking Confirmation = dealer lock (booking-accepted/confirmed) · CYP = the money chapter · Delivery Processing = post-payment delivery chapter.

**Cancellation (built, policy-correct):** “Cancel my purchase” is on the manage sheet until **car payment starts** (DP / instalment beyond the ₹10k lock) — then the Cancel row (and the whole “Make a change” section when Change is already gone) is hidden. Free through dealer search (`/booking/processing`); from `/booking/accepted` (partner locked) onward retains **50% of the booking lock (₹5,000)**. OTP is manufacturer-portal confirmation, not the fee boundary. Sheet passes `?paid=&stage=` to `/booking/cancel` (`ConciergeCancelScreen`). Cancel turn phases: **confirm** → **refund initiated** (`status=processing`) → demo **After refund is processed** → **refund successful** (terminal; `status=received`; **Back to the start** → `/quote`). Same-URL phase swaps remount the turn shell (`key` per phase) so echo → dialogue → card animates. **Single primary CTA** on confirm (no soft “go back”). **`reason=our-failure`** (ACKO couldn't deliver — allocation-failed / variant-unavailable): full refund, copy “This one's on me…”, CTA **Refund me ₹…**, skip reason sheet; entry echo **Get my full refund**. **`from=finance`** (loan-rejected cancel): post-lock **50% fee still applies**, short holdback copy (no salvage pitch), CTA **Refund me ₹…** (net after fee), skip reason sheet; entry echo **Cancel my booking**. **Loan-rejected SLA timeout** (`/payment/loan-decision-cancelled`): same post-lock **50% fee** (engine/chassis already assigned). **Allocation SLA timeout** (`/car-allocation/decision-cancelled`): **₹0** fee — the unit was never assigned. Other cancels still open the reason sheet.

**One-time change rule (built, policy §1.9 / §2.3):** Change is offered through allocation-pending. Free through dealer search (`/booking/processing`). From partner locked (`/booking/accepted`, before VIN): ₹5,000 once. After vehicle ID (engine/chassis on `/booking/confirmed`+): **Change row hidden**. `lib/change-policy.ts` tracks post–fee-boundary changes; manage sheet writes entry stage `pre`/`post`. Second paid change → cancel & rebook (`reason=second-change`). Dealer-search heads-up warns that fees start on the **next** step. Loan one-time rules (§6.2/6.3) are surfaced on loan **rejection** paths (“your one free switch covers this”); the loan-processing wait subline no longer repeats the switch offer.

**Inability to deliver (built, policy §1.14 / §2.4):** **edge-case demo only** — **express delivery only** (hidden when `readExperienceFlow() === "standard"`). Demo entry points: `/booking/processing` (dealer search) and `/car-allocation/pending` each carry express-only alt pills → remediation screens (`ConciergeAllocationFailedScreen`). **Express miss** — “No car found” → `/car-allocation/failed` (`mode=express_miss`). Shivi apologises (“I'm sorry, Sharath. I couldn't find your car.” + express-timeline body); three **card-based** outs: **Wait for standard delivery** (`writeExperienceFlow("standard")`, echo “I'll wait for standard delivery”, → `/booking/accepted`), **Change your selection** (free change, `entry stage pre`, → modify-selection; after pay → auto-advance **Payment received** then **`/booking/processing`**), **Cancel with a full refund** (echo **Get my full refund** → cancel `reason=our-failure`). **Variant discontinued** — “Variant discontinued” → `/car-allocation/variant-unavailable` (`mode=discontinued`). Same apology shell + outs **without** wait-for-standard (variant is gone on every timeline); default card is change selection. Express alt pills render **side by side** on one row. Call affordance: “Want to talk it through? I can call you”. **Decision SLA timeout (built):** remediation screens carry `AllocationDecisionDeadlineFootnote` (24h) + demo alt **SLA timed out** → `/car-allocation/decision-cancelled` (`ConciergeAllocationDecisionCancelledScreen`) — no remediation choices left; **full booking-lock refund (₹0 cancellation charge)** because the car is not yet assigned; refund initiated → demo **After refund is processed** → refund successful (same grammar as KYC retries-exhausted).

**Car ready early (built — standard demo):** On `/car-allocation/pending`, alt skip **Car ready early** → `/car-allocation/early-offer` (choice turn). **Yes, deliver early** → `/car-allocation/early-confirming` (ongoing wait; no user CTA). Demo skips: **Confirmed · same dealer** → `/car-allocation/confirmed?early=1` (writes earlier delivery line via `lib/concierge/early-delivery.ts` — default **Standard delivery by 4 Oct '26**; pill/cards/`getBookingDeliveryLine` pick it up); **Needs verification · different dealer** → `/booking/accepted?earlyDealer=1` (OTP again — product copy frames **verify for faster delivery**, does not name a dealer change; demo **After the call** → confirmed with early date). **Keep my original date** → `/car-allocation/keeping-date` (pending-shaped manufacturing wait on original **25 Oct '26**) → **A few months later** → `/car-allocation/confirmed` (no early override). Moments: `earlyDeliveryOffer` · `earlyDeliveryConfirming` · `earlyDeliveryKept` · `allocationDone` (`?early=1`).

**Known policy deviations (reported, not yet built):** insurance *selection* belongs in CYP (we select+pay at the RTO gate — proposal: confirm Shield at ₹0 during CYP, pay at the gate); no unified CYP deadline/auto-cancel state (loan-rejected has a **48h decision SLA**; other CYP waits do not); loan agreement/e-mandate signing step missing from the wizard (terms sheet at submit is consent-only, not e-mandate); §6 loan **amount-change** flows and same-day self-finance switch in Delivery Processing still open (rejection recovery paths — alt bank / co-applicant / guarantor / self-finance / full pay / cancel — are built; see loan-rejected); booking-lock amounts are still demo constants (not yet per car/variant from catalogue) — cheaper-change adjustment copy is demo-previewable on review-and-pay via `?demo_booking=`; Pre-Launch booking type absent; inability-to-deliver during *other* stages (e.g. post-payment) has no entry point yet; 50 km delivery-zone promise unsurfaced; `/car-allocation/*` kept as edge-case demo only — needs policy-doc blessing or comms-language alignment.

**Cold-open rule:** every turn is a re-entry point days apart, not a step in one sitting — copy must read correctly to someone who just reopened the app. Lead lines are standalone news (“Your Creta is reserved in your name.”), never reactions (“Done —”) unless the user acted seconds ago on the previous screen; day stamps carry event anchors (“Wed 23 Apr · after the dealer's call”). The only legitimately reactive turn is documents-received (the user just tapped submit).

**Paperwork rule:** never frame identity/KYC as “verify you” (confrontational) — but also never name a third party as the documents' recipient unless that's actually true (we collect and hold KYC; the dealer needs it later, and we don't surface that yet). Honest framing: documents are what the *purchase* runs on — “Your PAN and Aadhaar open the purchase in your name — they're what the invoice and RTO registration run on.” Shivi runs the checks herself (“Running the standard checks…”, “Paperwork's done ✓”); documents “stay encrypted with me, used only for what your purchase needs.” Bank document asks in finance journeys may name the bank — the bank genuinely receives them.

**No interstitials rule:** “Payment option confirmed”-style success screens break the conversation — the user's choice should land as an echo on Shivi's next action turn instead. The three payment-choice celebrations are removed (routes 308 to the action turns); the choice echoes (“Let's finance via HDFC Bank”).

**Demo prefill:** the loan application wizard starts fully prefilled (`createDefaultLoanApplicationState()` returns complete demo data; `fresh=1` re-seeds it) so Continue is enabled on every step — fields stay editable.

**Policy transparency:** Shivi's arrival promise (“fully refundable right now — I'll flag it before that ever changes”) is kept: on dealer-search (`/booking/processing`) the heads-up warns fees start from the **next** step (₹5,000 change / 50% cancel); dealer-found (`/booking/accepted`) is the fee boundary and points to the ⋮ menu. Manage sheet: free through dealer search; charged from booking-accepted onward.

**Insurance plan details & the acko.com price gap:** users comparison-shop mid-flow; discovering a cheaper number on acko.com themselves is what triggers support calls. The experience preempts it instead of defending after the fact. Flow: **`/payment/pay-insurance-premium`** shows default **ACKO Drive Shield** (base ₹28,000) → **`/payment/insurance-addons`** (optional covers: engine, NCB, RTI, consumables, electrical/non-electrical accessories, passenger, paid driver — Add/Added, live premium) → **`/payment/choose-insurance-tenure`** prices 1+3 / 3+3 from that selection → checkout. Tenure page is a **modify-selection static shell** (`StandaloneScreenHeader` + `PageLeadHeading`); option cards mirror payment/choose hierarchy (chip / title / radio / blurb / stats / dashed price footer) but use a **bordered idle state and no elevation** on the plain white page. Coverage sheet (`InsuranceCoverageBottomSheet`, content in `insurance-coverage-content.ts`): IDV block → base covers → **selected optional add-ons** when any are picked.

**ACKO Drive Shield (exclusive package):** branded **Shield** and positioned as *only available with cars bought on ACKO Drive*. Card title: “ACKO Drive Shield”; quote subtitle notes selected add-on count when any are opted in.

**Pricing-team commitments required (numbers in the sheet must stay true):**
0. **Shield exclusivity** — the Shield SKU (this IDV + selected add-ons) is never sold on acko.com or other channels; exclusivity is what makes the comparison story unbeatable, so it must be contractual, not accidental.
1. **IDV floor** — drive-channel policies are written at full ex-showroom IDV, zero new-car haircut, and the exact IDV prints in the flow and on the policy doc.
2. **Selection integrity** — issued policy matches the base + add-ons + tenure the user confirmed; premium is recomputed from that set, not a fixed endorsement later.
3. **Like-for-like parity** — drive price ≤ acko.com price for identical spec (same IDV + same add-ons), monitored continuously; the comparison row is fed by the live quote API, never hardcoded.
4. **Price promise underwriting** — sign-off on “refund the difference” for exact-spec matches, with the claim handled by the concierge (Shivi-initiated refund, no forms).
5. **Anchor substantiation** — the ₹60,000 strikethrough must be a defensible dealer-channel average quote for this model, documented.
6. **Quote freshness** — the website-default comparison number (₹29,800-class) re-fetched on each render in production; staleness window agreed (e.g. 24h max).

**The price identity (business rule — all three finance flows):** `price lock (₹10,000) + bank disbursement + insurance (₹37,000) + down payment = locked price (₹13,73,780)`. The bank's disbursement is the bank's decision — **there is no loan-amount slider** (`/payment/choose-loan-amount` is a legacy redirect). The down payment is **derived** (`cashDownPaymentDueInr()` in `loan-amount-demo-constants.ts`; ACKO demo: HDFC disburses ₹10,76,780 → DP ₹2,50,000). `CarPriceBreakupCard` makes the identity visible on loan-sanctioned, pay-down-payment, and full-payment screens: lock tagged **Paid ✓**, disbursement tagged **Bank → dealer**, insurance tagged **Later · before delivery**, and the due-now row highlighted — with the footer line “These parts always add up to your locked price — nothing extra, ever.” The `down_payment` URL param now always means **net cash due now** (self-finance screens pass `carDownPaymentPortionInr`; full payment cash = `cashDownPaymentDueInr(0)` = ₹13,26,780, finally net of the lock). Self-finance keeps its enter-the-bank's-number screens (reporting the bank's figure, not choosing); partial instalments work on raw net figures.

**Insurance timing (business rule):** insurance is needed only just before delivery, for RTO registration — never framed as due after disbursement. Typical full package is ₹37,000 (base + all add-ons); the payable amount follows the user’s add-on + tenure selection. Disbursement-received ends with a “When your car's nearly ready” time-skip; the premium ask reads as the final pre-delivery gate (“The RTO won't register a car without an active policy”); all summary cards/sheets say “pay later, just before delivery — needed for RTO registration”.

**What's-left sheet:** the old “See your delivery timeline” link is now the user asking “What's left, Shivi?”, and the sheet opens with her framing above the timeline rail. Purchase-state last chapter is **Collect your car** (dealership pickup — not doorstep): in-progress copy “Insurance, RTO, then pickup at the dealership”.

**Delivery schedule (journey finale):** `/delivery/schedule` is a bespoke two-phase turn — day + window chips inline (flow-aware dates; picker still shows Morning/Afternoon/Evening labels; “Lock my pickup slot” disabled until both picked), then her confirmation with confetti (`fireBasicCannon`), the car card with **`Pickup {day} · {time range}`** (period-of-day omitted — time implies it), and a “Start over” demo skip to `/quote`. Locked pickup line persists (`src/helpers/pickup-slot.ts`) and replaces the delivery ETA on the **manage-booking car card on the schedule stage only**. **Car registration number** appears on VIN rows only after RTO completes (`isVehicleRegistrationAvailable` — `/delivery/schedule` and legacy schedule path). Location name + detail use **4px** gap. Dealership collection copy (not home delivery).

**Honest time rule (both directions):** real-world third-party work (dealers, yard allocations, RTO) must never fake-complete on screen — and ACKO's own work must never fake-slow. ACKO **is** the insurer: the policy issues the instant the premium lands (“Issued the moment your payment landed — insurance is us, after all”), a brand moment, not a wait. The only honest waits in the delivery chapter are the dealer's prep and the RTO. `WorkingNarration` has two modes — `live` for quick system actions that tick off while you watch (e.g. document submission), and `ongoing` for real-world waits: the first task spins, the rest queue with dashed circles, a clock row sets the expectation (“Expect news from me by tomorrow morning”), and the **result is reported in Shivi's dialogue on the next turn** (“I heard back overnight — three dealers…”). Set via `workingMode` / `workingEtaLabel` in the script. The word **“booking” never appears in user-facing copy** — the language is: payment received → verify identity → find your car → reserve it → **the exact unit is yours at OTP** (engine/chassis on the card) → sort the money → delivery.

### Primitives (`components/concierge/`, `lib/concierge/`)

| Piece | Purpose |
|---|---|
| `ConciergeTurnShell` | Page grammar: day-stamp divider, echo chip, `ShiviDialogue` (+ optional `afterBody` continuation), artifact slot (`mt-8` below dialogue), `WorkingNarration`, fixed footer (footnote + replies + optional call affordance + time-skip); nav has back + manage-sheet menu only — no persistent Shivi pill |
| `ConciergeMoment` | Binds a script moment to routes + artifacts (flow-aware via `readExperienceFlow()`) |
| `ConciergeAllocationFailedScreen` | Express-only remediation — `express_miss` at `/car-allocation/failed` (wait for standard / change / refund); `discontinued` at `/car-allocation/variant-unavailable` (change / refund only); both carry 24h decision-deadline footnote + **SLA timed out** → decision-cancelled (₹0 fee — unit never assigned) |
| `ConciergeVerifyIdentityScreen` | Bespoke `/kyc` turn — PAN/Aadhaar upload cards inline as the conversation; reply disabled until both docs are in (words: `VERIFY_IDENTITY_WORDS`) |
| `ShiviCallSheet` | Call-offer confirmation sheet — contextual call affordances per turn (`callLabel` in the script; `callLabel` prop on the shell adapter for finance screens) instead of ambient presence chrome. **Always her voice:** “Stuck? I can call you” — never third person. **Every waiting/watching turn has one** — waiting is when anxiety peaks (“Can't sleep on it? I can call you”, “Anxious about the loan? I can call you”). **Online indicator** on her avatar: green when within business hours, grey when away — see `lib/shivi-business-hours.ts` (9 AM–9 PM IST); copy adapts (“within 10 minutes” vs “once I'm back online”) |
| `IconCalloutCard` | Shared organism — `IconWell` + title (**16px**) + body (**14px** `#4b4b4b`) + optional blue text/link CTA; `default` / `glass` surfaces |
| `NextStepCard` | Thin wrapper on `IconCalloutCard` — glass + **20px** `OTP_Call` icon, no CTA (partner-dealer call / bank OTP). Title + body stack at **4px** gap |
| `ConciergeAllocationDecisionCancelledScreen` | Allocation decision SLA timed out — `/car-allocation/decision-cancelled`; **full refund, ₹0 cancellation charge** (car not assigned); refund initiated → demo skip → refund successful (no remediation cards) |
| `LoanDecisionCancelledScreen` | Loan-rejected decision SLA timed out — `/payment/loan-decision-cancelled`; **post-lock 50% fee** (engine/chassis already assigned); refund initiated → demo skip → refund successful |
| `lib/concierge/script.ts` | All of Shivi's lines per moment (`EXPRESS_SCRIPT`); **express and standard share the same dialogue** — only `moneyIntro` footnote injects the flow-specific delivery date via `getDeliveryDateShort()` |
| `lib/dealer-attribution-content.ts` | Car source labels — `CAR_SOURCE_NAME` / `CAR_SOURCE_DETAIL` (“ACKO Drive · Sourced & reserved for you”); `PARTNER_DEALER_LABEL` for post-payment dealer references |
| `lib/shivi-business-hours.ts` | Callback availability — `isShiviWithinBusinessHours()` (Asia/Kolkata, 09:00–21:00); drives `ShiviCallSheet` status dot + copy |
| `lib/concierge/echo.ts` | sessionStorage handoff: reply label → sent chip on the next turn (StrictMode-safe consume) |
| `lib/concierge/instant.ts` | `sessionStorage.pbe-concierge-instant = "1"` renders turns fully revealed (demos/automation) |
| `artifacts.tsx` | `AmountReceivedCard`, `PlanList`, `NoteCallout`, `CarSummaryCardLite` (flow-aware `deliveryStripClassName` / `deliveryIconSrc` from `ConciergeMoment`) |
| `IconWell` (`components/molecules/`) | Shared circular icon container — tones **grey / green / amber / purple**; default **44px**; **1px** borders; used across plan, receipts, banks, uploads, self-finance steps |
| `PlanList` | Arrival plan (`appearance="plan"`) and purchase-state menu timeline (`appearance="progress"` — 32px status nodes, “In progress” / “Done” labels, 20px stage gaps; [Figma 3342:18746](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=3342-18746)) |

### Converted moments (express + standard)

`/booking/received` (arrival — Shivi intro + plan; initial price-lock checkout now lands here via `buildBookingLockSuccessHref`) → `/kyc` (identity ask **with upload inline**; Shivi intro sheet removed; `/kyc/upload` 302s here — verification-failed re-upload links included) → `/kyc/documents-received` (working) → `/kyc/verification-in-progress` (kyc_failed fork + cancel_no_charges skip-hide preserved) → `/booking/processing` (dealer search, working; express-only alt skip **If no car is found** → `/car-allocation/failed`) → `/booking/accepted` (found it + `NextStepCard` OTP note) → `/booking/confirmed` (**car reserved** — engine/chassis on card) → `/payment/default` (money intro) → `/payment/choose` (header converted to a Shivi ask; CTAs in user voice). Modify-selection pay returns land on `/booking/confirmed?source=payment&return_source=modify-selection` (auto-advance Payment received); post-verification returns (express/standard, including allocation-failed → change car) continue to `/booking/processing` — not `/kyc`. After a completed selection change, `dealerSearch` / `dealerFound` use **“Change locked in…”** copy (not “paperwork done”), with the new car/colour/variant interpolated from `readActiveBookingSnapshot()`.

**Express main spine skips `/car-allocation/*` after OTP** — unit assigned at booking-confirmed; CTA into payment. **Standard** still uses `/car-allocation/pending` after OTP (manufacturing wait), including the **Car ready early** demo branch (`/car-allocation/early-*`, `/car-allocation/keeping-date`). `/car-allocation/failed` and `/car-allocation/variant-unavailable` remain express-only demos.

**Purchase-state timeline (`src/helpers/journey-stage.ts`):** 0 paperwork · 1 exact car (`/booking/processing`, `/booking/accepted`, allocation-pending) · 2 money (`/booking/confirmed` onward — car is reserved, VIN on card) · 3 delivery (insurance / RTO / schedule — title **Collect your car**). Booking-confirmed must not stay on “exact car / waiting on partner”. Engine/chassis from booking-confirmed; **registration number** only on schedule (post-RTO).

**`dealerFound` turn (`/booking/accepted`):** shortlisted car on `CarSummaryCardLite` + `NextStepCard` OTP; demo **After the call** → standard `/car-allocation/pending` · express `/booking/confirmed`. **`?earlyDealer=1`:** verify-for-faster-delivery copy (no name in lead; no “different dealer” wording) → confirmed `?early=1`. **`carReserved` / `allocationDone`:** engine/chassis + payment handoff → `/payment/choose`. **`moneyIntro` (`/payment/default`):** legacy redirect into choose; footnote stakes delivery date via `getDeliveryDateShort()` (honours early override). **`/payment/choose`:** option cards — chip above title, 16px gap, centred stat divider; ACKO Drive EMI **₹21,833** (no `/mo`); selected radio inline `#5920C5`. ACKO Drive always default-selected; demo alt **No ACKO Drive finance preselect** → `?preselect=0` (neutral body copy only).

Buying-guide routes are bypassed on the spine (the arrival plan replaces them). No-"booking" sweep applied to converted surfaces + manage sheet ("Your car", "Make a change", "Cancel my purchase", "Booking amount paid", "Price lock amount").

### Finance & delivery — converted via the shell adapter

`KycBookingProcessingScreen` is now a **concierge adapter** (renders `ConciergeTurnShell`; same props API): headline/subline → Shivi's lines, `belowHeadline` → `afterBody` (e.g. banking partner row on finance action), infoBox/summary card → artifacts, demo “Next” → “Skip ahead” time-skip pill, real CTAs → user replies, ctaWarningLine → footnote, delivery-timeline sheet behind a footer link. This converts in one move: finance action, loan processing (+ bank-call `NextStepCard` with ETA + stake), loan sanctioned, pay down payment, insurance setup/disbursement waits, disbursement received, pay insurance premium, insurance prep, RTO, delivery schedule, self-finance action, margin money slip, full payment. Voice pass applied to all their copy (first person, honest time, stakes tied to the delivery date).

**Loan application wizard** (`LoanApplicationShell`, [Figma 2841:8477](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2841-8477)): **white** page background; dark-green header gradient (`#044328` → `#022717`) with inverted nav + **Get help** → `ShiviCallSheet`; horizontal milestone rail (white connectors/icons on dark; opaque milestone fills). Shared loan-details once, then **person-shaped dual-pass**: personal (+ address) → documents → references for **primary**, then the same four steps again for **co-applicant** when enabled (`?applicant=co`). Co-applicant gate: **`LoanApplicationCoApplicantBottomSheet`** on finance-action (“Start my loan application”) — chips **No, just me** / **Yes, add co-applicant** (default order: no first). Person steps show **`LoanApplicationApplicantEyebrow`** (“You · Primary applicant” / “Co‑applicant”) when dual-pass is on; co-applicant personal collects relation via **`LoanApplicationRelationBottomSheet`**. Documents: primary sees KYC **verified banner** + financial uploads only; co-applicant collects **Aadhaar + PAN** identity uploads plus financial docs (`collectIdentityDocuments`, `lib/loan-application-documents-*`). Final references CTA opens **`LoanApplicationTermsBottomSheet`** → submitted success (white bg, auto-advance). State: `lib/loan-application-state.ts` (`includeCoApplicant`, `coApplicant` profile); URLs: `lib/loan-application-urls.ts`.

**Day stamps are real dates** with event anchors (“Wed 23 Apr · after the dealer's call”), never “Day 1” journey bookkeeping; omitted when no time has passed. **Customer-dependency stakes** are explicit wherever the user's action gates the timeline (footnotes + `stakeLabel` on next-step cards).

**Known debt:** celebration interstitials (finance/self-finance/full-payment confirmed, down-payment success), choose-loan-amount + enter-sanctioned/disbursement headers, modify/cancel flow screens, and `WhatsNextTimeline` labels still use the old voice — next pass.

**Source spec:** `docs/detailed_post_booking_experience.docx`  
**Design (Figma):** [Post-booking-experience](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience) — bank sheet node `1941:12822`.

---

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript, SCSS
- Local dev: `npm run dev` → **http://localhost:3008/post-booking-experience** (`next dev --turbopack --port 3008`; `BASE_PATH` from `lib/site-config.ts`, default `/post-booking-experience`)
- Static export + GitHub Pages: `npm run build` → `out/`; prefer `import` from `@/assets/` or `publicAssetPath()` for `/public/assets/`

---

## Component architecture (Atomic Design lite)

Hybrid model: thin shared atomic layers + domain feature folders. **No** `templates/` layer — `app/` routes import feature screens directly.

```
app/page  →  feature screen (payment | kyc | concierge | quote)
                 ↓
             organisms (ConciergeTurnShell, BottomSheetShell, shared cards)
                 ↓
             molecules (IconWell, BottomSheetPortal, chips, bullet lists)
                 ↓
             atoms (BottomSheetCloseIcon, experience backdrop layers)
```

### Placement rules

| What | Where |
|------|--------|
| Route screen / flow adapter | Feature folder (`payment/`, `kyc/`, `concierge/`, `quote/`) |
| Used across **2+ domains** | `molecules/` (small) or `organisms/` (section / shell / shared card) |
| Circular icon container (menu / receipts / cards) | Always `IconWell` |
| Plain grey confirm-sheet icon pad | Always `SoftIconPad` — never a one-off `#f5f5f5` circle |
| Bottom sheet | Feature folder if single-flow; **must** use `BottomSheetShell` (or `useBottomSheetPresence` for rare special cases) |
| Concierge page grammar | `ConciergeTurnShell` — screens supply `says` / `artifact` / `replies` |
| Cross-flow manage / upload / cancel reason sheets | `organisms/` |

**Dependency rule:** feature folders import atomic layers; organisms/molecules/atoms must **not** import from `payment/` / `kyc/` / `concierge/`.

**SCSS:** co-located `*.module.scss` per component; shared surfaces in `styles/_components.scss` (`card-elevated`, `sheet-elevated`, CTA classes) and `lib/layout/*` (bottom-sheet layout tokens).

### Key shared pieces

| Piece | Layer | Role |
|-------|-------|------|
| `BottomSheetShell` | organism | Portal + scrim + slide panel + optional absolute close + body scroll lock |
| `useBottomSheetPresence` | organism hook | Mount / animate-in / exit (280ms) — for sheets that cannot use the shell (e.g. Shivi intro coachmark sibling) |
| `BottomSheetPortal` | molecule | `document.body` portal only |
| `IconWell` | molecule | Gradient / bordered wells — menu, receipts, cards, bank logos |
| `SoftIconPad` | molecule | Plain `#f5f5f5` circular pad — confirm / how-it-works bottom-sheet rows |
| `BottomSheetConfirmBulletList` | molecule | SoftIconPad + tick/copy rows on confirm sheets |
| `ConciergeTurnShell` | organism | Concierge turn grammar |
| `IconCalloutCard` | organism | IconWell + title + body; optional text/link CTA — base for NextStep / document / location callouts |
| `artifacts.tsx` | organism barrel | `AmountReceivedCard`, `PlanList`, `IconCalloutCard`, `NextStepCard`, `CarSummaryCardLite`, `NoteCallout` |

---

## Experience flows (Express / Standard / Verification failed / Modify no charges / Modify with charges / Cancel no charges / Cancel with charges)

Switch on **`/quote`** via the top-left menu (`QuoteFlowMenuSheet`). Active flow is stored in **`sessionStorage`** (`post-booking-experience-flow`) via `readExperienceFlow()` in `lib/experience-flow.ts`.

| Flow | Selectable | Journey |
|------|------------|---------|
| **Express delivery** | Yes | Default — full route map below |
| **Standard delivery** | Yes | Same KYC/dealer spine as express until OTP; then **manufacturing wait** at `/car-allocation/pending` (not booking-confirmed). Delivery date/visuals from `lib/experience-flow-content.ts`. **Car ready early** demo branch from pending (see policy section). |
| **Verification failed** | Yes | Same as express until KYC verification in progress → `lib/kyc-verification-outcome.ts` |
| **Change selection without any charges** | Yes | Express path through **`/kyc` (KYC pending)** only; post–KYC-pending routes redirect to `/kyc`; manage booking fees always free (`lib/manage-booking-modify.ts`); modify-selection routes unchanged |
| **Change selection with ₹5,000 fee** | Yes | **Same routes as express** through **`/booking/accepted`**; change selection from booking accepted (`isModifyWithChargesFlow()` + `isChangeSelectionAvailablePhase`); ₹5,000 change fee in review-and-pay (`lib/modify-selection-review-pay-content.ts`) |
| **Cancellation with no charges** | Yes | Express path through **`/kyc/verification-in-progress`** (inclusive); post–verification-in-progress routes redirect to `/kyc/verification-in-progress`; manage booking fees always free; **Cancel booking** → concierge cancel turn (`ConciergeCancelScreen`) with ₹0 charge; **Change selection** shown but not clickable |
| **Cancellation with 50% charges** | Yes | Express path through **`/booking/accepted`** (partner locked); later routes redirect to booking-accepted; cancel fee **standard** (₹5,000 retained); **Cancel booking** → concierge cancel turn with `stage=post`; **Change selection** shown but not clickable |

### Common vs flow-specific changes

- **Common** — edit shared components/libs with **no** flow guard; applies to Express and Standard (including concierge script dialogue).
- **Standard only (visual/date)** — `isStandardDeliveryFlow()` helpers in `lib/experience-flow-content.ts`: delivery line **“Standard delivery by 25 Oct '26”** (or early override **4 Oct '26** after accept), gray text (`#4B4B4B`), neutral card strip (`#f5f5f5`), clock icon; `CarDeliveryScheduleScreen` uses October day chips.
- **Standard only (demo branch)** — **Car ready early** from `/car-allocation/pending` → early-offer / early-confirming / keeping-date (see policy section + route table).
- **Express only (visual/date)** — default when not standard: **“Express delivery by 10 Jun '25”**, purple text (`#5920c5`), lavender card strip (`#f9f6ff`), bolt icon; June day chips on delivery schedule.
- **Express only (demo branch)** — side-by-side alts “No car found” → `/car-allocation/failed`; “Variant discontinued” → `/car-allocation/variant-unavailable` (no standard-delivery out); both on dealer search and allocation-pending.
- **Modify no charges** — `isModifyNoChargesFlow()` / `lib/experience-flow-journey.ts` (journey cap + always-free modify fees).
- **Modify with charges** — `isModifyWithChargesFlow()` / `getModifySelectionFlowRedirectTarget` (full express to booking accepted; change fee in booking amount).
- **Cancel no charges** — `isCancelNoChargesFlow()` / `lib/experience-flow-journey.ts` (journey cap through verification in progress + cancel-booking routes).
- **Cancel with charges** — `isCancelWithChargesFlow()` / `lib/experience-flow-journey.ts` (journey cap through booking accepted / dealer identified + cancel-booking; cancel fee follows phase).

### Journey map (`lib/journey-routes.ts`)

- **`JOURNEY_PATHS`** — canonical path strings for milestones (KYC hub → processing → booking accepted → car allocation → payment).
- **`resolveJourneyPhase(pathname)`** — coarse phase for fees and future branching (not payment instalment state).
- **`isIdentityFunnelPhase`** — identity + dealer-search phases (`/kyc` through `/booking/processing`).
- Prefer importing paths from here when touching navigation; migrate `router.push` strings incrementally.

### Demo vs product CTAs (GitHub Pages)

- **`primary-cta`** — filled `#121212`; real user actions (Pay, Complete KYC, Choose how to pay, etc.).
- **`demo-nav-cta`** — outline `#121212`, no fill; label **`Next`** only (`lib/demo-nav-cta.ts`, `primaryOrDemoNavCtaClass()`). Used on `KycBookingProcessingScreen`, `KycVerificationInProgressScreen`, buying guide steps 1–3.

---

## Routes (current)

| Path | Purpose |
|------|---------|
| `/` | Redirects to `/quote` |
| `/quote` | Entry / quote screen |
| `/payment/choose` | Choose payment method (ACKO Drive / self finance / full payment). ACKO Drive always default-selected. Demo **No ACKO Drive finance preselect** → `?preselect=0` (neutral body copy); reverse **ACKO Drive finance preselect** → default. ACKO CTA opens **eligibility sheet** before bank options |
| `/payment/choose-bank` | Full-page bank picker (`BankSelectionScreen`) — initial pick, mid-flow change, post-rejection switch (`lib/payment/bank-selection-urls.ts`) |
| `/payment/acko-drive-finance-confirmed` | After bank sheet **Confirm banking partner** — celebration + docs card; **Continue** → `/payment/acko-drive-finance-action?bank=` |
| `/payment/acko-drive-finance-action` | ACKO Drive loan application action — `AckoDriveFinanceActionScreen` (banking partner `afterBody`, `LoanDocumentsChecklistCard`); **Start my loan application** → co-applicant sheet → `/payment/loan-application/loan-details?bank=` |
| `/payment/loan-documents-upload` | **Legacy** — redirects to loan-application documents step; accepts optional `?bank=` |
| `/payment/loan-processing` | Bank OTP confirm — `LoanBookingProcessingScreen` (`NextStepCard`); demo **After the call** → `/payment/loan-under-review` |
| `/payment/loan-under-review` | Bank processing loan (2–3 working days) — `LoanUnderReviewScreen`; alts **More docs needed** / **If the bank declines** → `/payment/loan-rejected?bank=`; skip → `/payment/loan-sanctioned` |
| `/payment/loan-rejected` | Bank declined — analysis outcomes (`?outcome=` demo switcher); radio option cards + contextual CTA (`LoanRejectedScreen`, `src/constants/loan-rejected-content.ts`). 48h `LoanDecisionDeadlineFootnote` + demo **SLA timed out** → `/payment/loan-decision-cancelled`. Cancel outs → `/booking/cancel?stage=post&from=finance` (50% fee; echo **Cancel my booking**) |
| `/payment/loan-decision-cancelled` | Loan-rejected decision SLA timed out (`LoanDecisionCancelledScreen`); post-lock **50% fee** (engine/chassis assigned); refund initiated → demo skip → refund successful |
| `/payment/loan-guarantor` | Guarantor after conditional bank path — modify-selection shell + Aadhaar/PAN uploads (`LoanGuarantorScreen`); submit → under-review |
| `/payment/loan-sanctioned` | Loan sanctioned — same shell family as loan-processing |
| `/payment/choose-loan-amount` | Choose loan amount slider (`?bank=`); **Confirm loan amount** → `LoanSubmitConfirmBottomSheet` → `/payment/pay-down-payment?bank=&loan_amount=&down_payment=` |
| `/payment/pay-down-payment` | Pay down payment hero (`KycBookingProcessingScreen`); CTA → `/payment?down_payment=` (instalments demo) |
| `/payment/down-payment-success` | Instalment / full DP celebration → remaining or `/payment/down-payment-insurance-setup` |
| `/payment/down-payment-insurance-setup` | Down payment received — loan disbursement processing or full-payment complete; `?loan_amount=` (+ `original_down_payment` / `down_payment=0` when DP complete) |
| `/payment/loan-disbursement-received` | Loan disbursed ack (`?loan_amount=`, optional `?transaction_id=`) — **Continue** → `/payment/pay-insurance-premium` |
| `/payment/pay-insurance-premium` | Insurance quote — Shield intro → add-ons page |
| `/payment/insurance-addons` | Optional add-ons (modify-selection static page) → choose tenure |
| `/payment/choose-insurance-tenure` | Tenure 1+3 / 3+3 — modify-selection static page; bordered idle cards (no elevation) → pay |
| `/payment/insurance-premium-success` | After insurance payment |
| `/delivery/insurance-prep` | Car insurance prep in progress |
| `/delivery/rto` | RTO registration in progress; demo **More docs needed** → `/delivery/rto/additional-documents` |
| `/delivery/rto/additional-documents` | RTO mid-registration document request (demo); submit → back to RTO wait |
| `/delivery/schedule` | Dealership pickup day + window → lock slot; registration on car card; manage-menu pickup line while on this stage |
| `/payment/enter-sanctioned-loan-amount` | Self finance — declare sanctioned / disbursement amount |
| `/payment/margin-money-slip` | Self finance — margin money slip after full DP |
| `/payment/pay-full-payment` | Full payment action screen |
| `/payment/full-payment-option-confirmed` | Full payment celebration — “Payment option confirmed”; auto-advance (~3s) → action |
| `/payment/full-payment-confirmed` | Full payment action — `KycBookingProcessingScreen` + amount breakdown; **Continue** → `/payment/pay-full-payment` |
| `/payment/loan-application` | Wizard entry (redirects to first step) |
| `/payment/loan-application/loan-details` … `references`, `submitted` | ACKO loan application wizard — optional `?applicant=co` for co-applicant pass (`lib/loan-application-state.ts`, `lib/loan-application-urls.ts`) |
| `/kyc/verification-failed` | KYC verification failed — **`ConciergeVerificationFailedScreen`**: Shivi explains the specific failure (`?reason=image_not_clear\|name_mismatch\|address_mismatch`); tab switcher (`VerificationFailureReasonSwitcher` in `afterBody`) for QA/demo; CTA **"I'll re-upload them"** → `/kyc/upload?reason=`; 2nd failure → `/kyc/verification-cancelled` (`ConciergeVerificationCancelledScreen`: refund initiated → demo **After refund is processed** → refund successful) |
| `/payment/self-finance-confirmed` | Self finance — post-confirm celebration; **Continue** → `/payment/self-finance-action` |
| `/payment/self-finance-action` | Self finance — proforma hero + **`LoanProcessingWhatsNext variant="self_finance_action"`**; primary CTA → `/payment/pay-down-payment` (current wire) |
| `/payment` | Payment flow / hub (e.g. full payment path from choose) |
| `/payment/default` | Default payment prompt — CTA to **`/payment/choose`** |
| `/booking/received` | Legacy redirect → `/booking/confirmed?source=payment` |
| `/booking/received/next` | Legacy redirect → `/onboarding/1` |
| `/onboarding/[1-3]` | Buying process onboarding (Figma 2460:7661); step 3 **Let's get started** → `/kyc` (payment + delivery combined) |
| `/kyc` | KYC pending — Shivi intro bottom sheet on load ([Figma 2479:7600](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2479-7600)); **Got it** → hero + **Complete KYC Now** |
| `/kyc/upload` | PAN/Aadhaar upload via `KycPanAadhaarDocumentUploadSections` + shared `DocumentUploadInfoTipsCard`, `DigilockerFetchButton`, `DocumentUploadDocumentCards` ([Figma 2501:8136](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2501-8136)); `mt-6` title→tips→cards; DigiLocker fetch above Aadhaar only; no headline subtext; re-upload from verification-failed uses same screen; **Submit documents** → `/kyc/documents-received` |
| `/kyc/documents-received` | Documents received |
| `/kyc/verification-in-progress` | KYC verification in progress (between documents received and processing); demo **Next** hidden in **cancel_no_charges** flow |
| `/booking/cancel` | **Cancel-no-charges demo flow only** — Figma 2709:17395 (`CancelBookingConfirmScreen`); staggered page load; car card + refund breakdown + outline CTAs; **Yes, cancel my booking** → reason bottom sheet (Figma 2711:21013) |
| `/booking/cancel/success` | **Cancel-no-charges demo flow only** — celebration success layout + fixed bottom **Done** CTA; full booking amount refund copy; **Done** → `/quote` |
| `/booking/processing` | Dealer search (`ConciergeMoment` `dealerSearch`) — demo **Next morning** → `/booking/accepted`; express-only side-by-side alts **No car found** → `/car-allocation/failed`; **Variant discontinued** → `/car-allocation/variant-unavailable` |
| `/booking/accepted` | Dealer found + OTP `NextStepCard` — demo **After the call** → standard: `/car-allocation/pending` · express: `/booking/confirmed`. **`?earlyDealer=1`** (from early-confirming): faster-delivery verify copy (no dealer-change wording); **After the call** → `/car-allocation/confirmed?early=1` |
| `/booking/modify` | **Modify-selection demo flows** (`modify_no_charges`, `modify_with_charges`) — chooser; bottom CTA varies by option (See available colours / variants / Browse cars) |
| `/booking/modify/colour` \| `variant` \| `different-car` | Selection steps; each path has `…/confirm` → shared review-and-pay (`ModifySelectionReviewPayScreen`) |
| `/booking/modify/*/confirm` | Review selection + pay; edit icons gated by flow (see **Modify selection**) |
| `/booking/confirmed` | Booking confirmed — default spine: **`ConciergeMoment` `carReserved`** — payment handoff → `/payment/choose`; modify-selection pay returns (`?source=payment&return_source=modify-selection`): auto-advance **Payment received** (`DownPaymentInstalmentSuccess`) — next route journey-aware (see **Pay → booking received**) |
| `/car-allocation/pending` | Manufacturing wait (`allocationPending`); primary skip **A few months later** → `/car-allocation/confirmed`; **standard** alt **Car ready early** → `/car-allocation/early-offer`; **express** side-by-side alts **No car found** → `/car-allocation/failed`; **Variant discontinued** → `/car-allocation/variant-unavailable` |
| `/car-allocation/early-offer` | **Standard demo** (`earlyDeliveryOffer`) — car ready early; replies **Yes, deliver early** → `/car-allocation/early-confirming` or **Keep my original date** → `/car-allocation/keeping-date` |
| `/car-allocation/early-confirming` | **Standard demo** (`earlyDeliveryConfirming`) — ongoing wait (no product CTA). Demo: **Confirmed · same dealer** → `/car-allocation/confirmed?early=1` (writes early date); **Needs verification · different dealer** → `/booking/accepted?earlyDealer=1` |
| `/car-allocation/keeping-date` | **Standard demo** (`earlyDeliveryKept`) — user kept original date; manufacturing wait (pending-shaped) → **A few months later** → `/car-allocation/confirmed` |
| `/car-allocation/confirmed` | Unit ready with engine/chassis (`allocationDone`); payment handoff → `/payment/choose`. **`?early=1`**: early-accept copy + delivery date already updated (4 Oct '26) |
| `/car-allocation/failed` | **Edge-case demo (express only)** — express-miss remediation (`ConciergeAllocationFailedScreen` `mode=express_miss`); includes wait-for-standard; demo **SLA timed out** → decision-cancelled |
| `/car-allocation/variant-unavailable` | **Edge-case demo (express only)** — discontinued-variant remediation (`ConciergeAllocationFailedScreen` `mode=discontinued`); **no** wait-for-standard option; same SLA timeout alt |
| `/car-allocation/decision-cancelled` | **Edge-case demo** — allocation decision SLA timed out (`ConciergeAllocationDecisionCancelledScreen`); **full booking-lock refund, ₹0 cancellation charge** (car not assigned); no remediation cards |

**Legacy URLs** (308 redirect): `/kyc/car-allocation-pending` → `/car-allocation/pending`, `/kyc/car-allocation-confirmed` → `/car-allocation/confirmed` (`next.config.ts`).

Intended journey (from product doc): **Payment success → KYC → Processing → Confirmed** (wire as needed per final IA).

---

## Payment journeys — ACKO Drive finance vs self finance

Entry: **`/payment/choose`** (`ChoosePaymentOptionsScreen`).

### Shared

- All three options use the same screen; CTA adapts to selection (**Show me the bank options** / **I'll use my own bank loan** / **I'll pay in full**). Option cards: chip above title, 16px gap between cards, centred stat divider. ACKO Drive path gates bank options behind **`AckoDriveFinanceEligibilityBottomSheet`**.
- **“What’s next?”** on `KycBookingProcessingScreen` renders `whatsNextCard` inside **`WhatsNextTimelineBottomSheet`** (`components/kyc/WhatsNextTimelineBottomSheet.tsx`).

### ACKO Drive finance (assisted loan via partner banks)

| Step | Behaviour |
|------|-----------|
| Choose | CTA **“See bank options”** opens **`AckoDriveFinanceEligibilityBottomSheet`** (salaried/self-employed · personal-name only; no company registration / lease). **Agree and continue** → **`BankSelectionBottomSheet`**. |
| Bank partner | **Confirm banking partner** → **`/payment/acko-drive-finance-confirmed?bank={id}`**. |
| Confirmed | **`AckoDriveFinanceConfirmedScreen`**: brief success (Lottie + headline + banking partner); auto-advances (~3s) → **`/payment/acko-drive-finance-action?bank={id}`**. |
| Action | **`AckoDriveFinanceActionScreen`**: `KycBookingProcessingScreen` (two-line headline, banking partner as `afterBody`, `LoanDocumentsChecklistCard` artifact); **Start my loan application** → **`LoanApplicationCoApplicantBottomSheet`** → **`/payment/loan-application/loan-details?bank={id}`**. |
| Loan application wizard | Shared **Loan details**, then person dual-pass: **Personal** (+ address) → **Documents** → **References** for primary; when co-applicant enabled, the same person steps again with `?applicant=co` (eyebrow + shortened titles). Co-applicant documents collect Aadhaar/PAN + financials; primary shows verified banner + financials only. Shell: dark header ([Figma 2841:8477](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2841-8477)), white body, **Get help** opens `ShiviCallSheet`. Final CTA → **`LoanApplicationTermsBottomSheet`** → submitted → **`/payment/loan-processing?bank={id}`**. Legacy **`/payment/loan-documents-upload`** redirects to documents step. |
| Bank OTP | **`LoanBookingProcessingScreen`** (`/payment/loan-processing`) — confirm OTP with the bank (`NextStepCard`); demo **After the call** → under-review. |
| Under review | **`LoanUnderReviewScreen`** (`/payment/loan-under-review`) — 2–3 working days processing; demo **More docs needed** / **If the bank declines** → loan-rejected; skip → sanctioned. |
| Loan rejected | **`LoanRejectedScreen`** (`/payment/loan-rejected?bank=&outcome=`) — backend-style analysis outcomes with demo switcher (`LoanRejectedOutcomeSwitcher`). Radio option cards + one contextual CTA (same grammar as allocation-failed). Outcomes: **`non_doable`** (self-finance / full pay / cancel) · **`same_bank_co_applicant`** · **`same_bank_guarantor`** → `/payment/loan-guarantor` · **`alt_bank`** (best-rate other partner; carry-over → loan-processing) · **`alt_bank_co_applicant`**. Default demo outcome: **`alt_bank`**. **48h decision SLA** (`LoanDecisionDeadlineFootnote`) — pick a path or the booking auto-cancels; demo **SLA timed out** → `/payment/loan-decision-cancelled` (`LoanDecisionCancelledScreen`; post-lock **50% fee**, engine/chassis already assigned — unlike allocation decision-cancelled, which is ₹0 because the unit was never assigned). User cancel → `/booking/cancel?stage=post&from=finance` (same **50% fee**; CTA **Refund me ₹…**; skip reason sheet; echo **Cancel my booking**). Copy: `src/constants/loan-rejected-content.ts`. |
| Guarantor | **`LoanGuarantorScreen`** — modify-selection page shell (`MODIFY_SELECTION_PAGE_SHELL`, `StandaloneScreenHeader`, `PageLeadHeading`, fixed `footer-elevated` CTA). Fields: name / phone / email + **Aadhaar/PAN document uploads** (loan-application identity cards + `UploadSourceBottomSheet`; no DigiLocker; no PAN/Aadhaar text fields). Submit → under-review. |
| Loan sanctioned | **`LoanSanctionedScreen`** — `AmountReceivedCard` (sanctioned amount) + `NextStepCard` (partner-dealer call); CTA → choose loan amount / dealer-confirmed path |
| Choose loan | **`ChooseLoanAmountScreen`** — slider min **₹1L** (`MIN_LOAN_INR`), max on-road price; down-payment split card (car DP + insurance); **`ChooseLoanPaymentSummaryCard`** |
| Before pay DP | **`LoanSubmitConfirmBottomSheet`** on confirm — bullets + **Agree and continue** → pay-down-payment |
| Pay DP | **`PayDownPaymentScreen`** — car DP summary card; partial remaining uses **`DownPaymentSummaryCard`** (car amounts) |
| DP complete | **`buildInsuranceSetupHref`** carries `loan_amount`, `original_down_payment`, `down_payment=0` |
| Disbursement wait | **`DownPaymentInsuranceSetupScreen`** — info: insurance ₹37k after disbursement |
| Disbursed | **`LoanDisbursementReceivedScreen`** — amount + transaction ID; headline **Loan disbursed, Sharath!** |
| Insurance | **`PayInsurancePremiumScreen`** — coverage sheet ([Figma 2585:68086](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2585-68086)) |
| Later stages | **`LoanProcessingWhatsNext`** variants (`sanctioned`, `down_payment`, `down_payment_complete`, `insurance_premium_due`, delivery `*_prep`, …) on respective screens |

**Key files**

- `components/payment/ChoosePaymentOptionsScreen.tsx` — ACKO branch + eligibility sheet + bank sheet open
- `components/payment/AckoDriveFinanceEligibilityBottomSheet.tsx` — eligibility gate before bank options
- `components/payment/BankSelectionBottomSheet.tsx`
- `components/payment/BankSelectionScreen.tsx`, `BankLoanCard.tsx`, `BankLoanDetailBottomSheet.tsx` — full-page `/payment/choose-bank`
- `lib/payment/bank-selection-urls.ts` — shared bank-picker deep links
- `components/payment/AckoDriveFinanceConfirmedScreen.tsx`
- `components/payment/AckoDriveFinanceActionScreen.tsx` — co-applicant sheet before wizard entry
- `components/payment/FinanceWhatsNextPaymentProcess.tsx`
- `components/payment/loan-application/*` — wizard shell, dual-pass person steps, terms / relation / co-applicant sheets
- `lib/loan-application-urls.ts`, `lib/loan-application-state.ts`, `lib/loan-application-content.ts`, `lib/loan-application-documents-*`
- `components/payment/LoanBookingProcessingScreen.tsx`
- `components/payment/LoanUnderReviewScreen.tsx`
- `src/components/organisms/payment/LoanRejectedScreen.tsx`, `LoanRejectedOutcomeSwitcher.tsx`, `LoanDecisionCancelledScreen.tsx`, `src/constants/loan-rejected-content.ts`
- `src/components/organisms/payment/LoanGuarantorScreen.tsx`
- `components/payment/LoanProcessingWhatsNext.tsx`
- `components/payment/ChooseLoanAmountScreen.tsx`, `ChooseLoanPaymentSummaryCard.tsx`
- `components/payment/LoanSubmitConfirmBottomSheet.tsx`, `LoanSanctionedScreen.tsx`, `SanctionedAmountSummaryCard.tsx`
- `components/payment/PayDownPaymentScreen.tsx`, `DownPaymentAmountSummaryCard.tsx`, `DownPaymentSummaryCard.tsx`
- `components/payment/DownPaymentInsuranceSetupScreen.tsx`, `LoanDisbursementReceivedScreen.tsx`
- `components/payment/PayInsurancePremiumScreen.tsx`, `ZeroDepInsuranceCoverageCard.tsx`, `InsuranceCoverageBottomSheet.tsx`
- `components/payment/loan-amount-demo-constants.ts` — pricing demo, `MIN_LOAN_INR`, `carDownPaymentFromTotalInr()`, `DEMO_LOAN_DISBURSEMENT_TRANSACTION_ID`
- `lib/paymentUrls.ts` — checkout / success / insurance-setup href builders

### Self finance (customer arranges loan with their bank)

| Step | Behaviour |
|------|-----------|
| Choose | CTA **“I’ll go with Self finance”** opens **`SelfFinanceConfirmBottomSheet`** (“Things to know before you continue!” + bullets). |
| Agree | **Agree and continue** → **`/payment/self-finance-confirmed`**. |
| Confirmed | **`SelfFinanceConfirmedScreen`**: **`FadePageTransition`** (fade-in, not celebration slide-from-bottom); ACKO success Lottie; **`onComplete`** → headline + subtext → **Continue**. |
| Action | **`/payment/self-finance-action`** — **`SelfFinanceActionScreen`**: `KycBookingProcessingScreen` (two-line headline, `ProformaInvoiceCard`, CTA **“Enter the disbursement amount”** → **`/payment/pay-down-payment`**). |
| What’s next | **`LoanProcessingWhatsNext variant="self_finance_action"`** — **same interaction model as loan-processing** (expandable Payment, chevron, nested rail, 24×24 icons): Car allocation (dated “Completed on …”) → **Payment** (self-finance subtitle) → **five nested substeps** → **Car delivery** (flat row). |

**Nested Payment substeps (self finance only) — product meaning**

1. **Download proforma invoice** — for customer to submit to bank for disbursement workflow.  
2. **Declare loan disbursement amount** — after bank approval, user enters sanctioned amount → drives **down payment** calculation.  
3. **Downpayment** — pay in app.  
4. **Download margin money slip** — after DP; customer gives slip to bank to release funds to dealer.  
5. **Confirm disbursement from bank** — user enters **UTR**; verification/confirmation of transfer to dealer.

Initial UI statuses in code: first substep **`in_progress`**, others **`next`** (replace with server/session state later).

**Key files**

- `components/payment/SelfFinanceConfirmBottomSheet.tsx`
- `components/payment/SelfFinanceConfirmedScreen.tsx`
- `components/payment/SelfFinanceActionScreen.tsx`
- `components/payment/ProformaInvoiceCard.tsx` — thin `IconCalloutCard` wrapper (Download CTA)
- `components/organisms/IconCalloutCard.tsx` — shared callout organism
- `components/payment/LoanProcessingWhatsNext.tsx` — **`self_finance_action`**, **`SELF_FINANCE_ACTION_PAYMENT_SUBSTEPS`**, **`paymentSectionSubtitle()`**
- `app/payment/self-finance-confirmed/page.tsx`, `app/payment/self-finance-action/page.tsx`

**Note:** `WhatsNextTimeline` exposes optional **`paymentSubSteps`** for a lighter nested layout; **self finance timeline in the bottom sheet deliberately uses `LoanProcessingWhatsNext`** so visuals and behaviour align with ACKO **`/payment/loan-processing`**.

### Full payment

| Step | Behaviour |
|------|-----------|
| Choose | CTA opens **`FullPaymentConfirmBottomSheet`** → **Agree and continue** |
| Confirmed | **`/payment/full-payment-option-confirmed`** — celebration (tick Lottie, “Payment option confirmed”); auto-advance ~3s |
| Action | **`/payment/full-payment-confirmed`** — `KycBookingProcessingScreen` + breakdown; **Continue** → **`/payment/pay-full-payment`** |

**Key files:** `FullPaymentConfirmBottomSheet.tsx`, `FullPaymentOptionConfirmedScreen.tsx`, `FullPaymentConfirmedScreen.tsx`, `PayFullPaymentScreen.tsx`

---

## Manage booking — payment summary & modify booking

**Component:** `components/kyc/ManageBookingBottomSheet.tsx` (opened from nav menu on `KycBookingProcessingScreen` and KYC screens).

### Payment summary (query-driven)

| URL context | Card shown |
|-------------|------------|
| No loan context | **`PaymentSummaryCard`** — ACKO price, booking paid, amount to pay |
| Post–loan-application submit (`loan-processing` / under-review / sanctioned / …) with `?bank=` even without `loan_amount` | **`ChooseLoanPaymentSummaryCard`** — demo loan + DP due (complete breakup) |
| `loan_amount` + `down_payment` (pending / partial) | **`ChooseLoanPaymentSummaryCard`** — loan amount; optional **Down payment paid** row when `original_down_payment` > remaining; footer **Remaining down payment** or **Down payment amount** |
| `loan_amount` + full DP (`down_payment=0` + `original_down_payment`, insurance checkout, or post–car-payment path with bare `loan_amount`) | Same card — **Down payment paid** = car DP via `cashDownPaymentDueInr()` (not on-road − loan); **no** grey footer row |
| `loan_amount` only on pre–DP routes | Same card — **Down payment amount** footer (due); no “paid” row |

Parser: `parseConfirmedLoanPlan(searchParams, pathname)` in manage sheet; car DP from `cashDownPaymentDueInr(loan)`; post-submit paths default loan to `BANK_DISBURSEMENT_INR` when URL omits it; bare `loan_amount` shows **paid** on `isDownPaymentSettledForSummaryPath`, or await routes with confirm flags (`dp_confirmed=1` on dealer-confirmed, `slip_ready=1` on margin-money).

### Modify booking (Change + Cancel)

OTP confirms the booking on the manufacturer portal — it is **not** the fee boundary. Dealer search = `/booking/processing` (still free). Partner locked = `/booking/accepted` (fee boundary). Vehicle ID (engine/chassis) = `/booking/confirmed` onward.

| Stage | Change selection | Cancel my purchase | “Make a change” section |
|-------|------------------|--------------------|-------------------------|
| Before partner locked (through dealer search `/booking/processing`) | **Show** · free | **Show** · free | Both |
| Partner locked (`/booking/accepted` → `/car-allocation/pending`) | **Show** · ₹5,000 | **Show** · 50% of booking lock | Both |
| After vehicle ID (engine/chassis — `/booking/confirmed`, `/car-allocation/confirmed`+) | **Hide** | **Show** · 50% of booking lock | Cancel only |
| After car payment (DP / instalment beyond ₹10k lock) | **Hide** | **Hide** | **Hide entire section** |

Helpers: `isChangeSelectionMenuVisible` / `isCancelBookingMenuVisible` / fee tiers in `lib/manage-booking-modify.ts`; phases in `lib/journey-routes.ts`.

#### Flow-specific overrides

| Flow | Change selection | Cancel booking |
|------|------------------|----------------|
| **cancel_no_charges** | Visible when stage allows; **not clickable** | Enabled → `stage=pre` (₹0) |
| **cancel_with_charges** | Visible when stage allows; **not clickable** | Enabled → fee by phase; park at booking-accepted → `stage=post` |
| **modify_no_charges** | Enabled (always free); journey capped at `/kyc` | Fee by phase |
| **modify_with_charges** | Enabled; ₹5,000 from booking-accepted | Fee by phase |
| **express / standard / kyc_failed** | Per stage table above | Per stage table above |

`showVehicleIdentification` only affects the car card (engine/chassis rows), not modify actions.

Post-allocation car card is enabled when `manageBookingShowVehicleIdentification` is set or `whatsNextCard != null` / car allocation step `done` on `KycBookingProcessingScreen`.

---

## Modify selection (modify-no-charges / modify-with-charges flows)

**Entry:** manage booking → **Change selection** when `isModifyNoChargesFlow()` (from `/kyc`) or `isModifyWithChargesFlow()` + `isChangeSelectionAvailablePhase` (from booking accepted) → `/booking/modify` (`ChooseModifyBookingScreen`).

### White page surface & card shadows

All `/booking/modify/*` screens use **`MODIFY_SELECTION_PAGE_SHELL_CLASS`** (`min-h-dvh bg-white font-sans`). Sticky nav uses `StandaloneScreenHeader` → `TopNavHeader` with **`surface="white"`** (white scroll fade — not the blue `#F7FAFF` gradient used elsewhere).

**No card shadows on modify-selection pages.** Cards on the white background are **flat bordered** shells — **`border border-[#e8e8e8]`**, **never** `card-elevated`. Shared tokens in `components/booking/modify-option-card-ui.tsx`:

| Token | Use |
|-------|-----|
| `MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS` | Hub + downstream picker option cards (purple selected state, `#e8e8e8` border when unselected) |
| `MODIFY_SELECTION_SUMMARY_CARD_CLASS` | Review selection, booking amount summary, price summary |

Sticky/fixed footers may still use **`footer-elevated`**; bottom sheets use **`sheet-elevated`**.

**Shivi concierge pages unchanged** — turns on **`#F1F5FD` / `#F7FAFF`** keep **`card-elevated`** (and glass variants where specified) per `.cursor/rules/concierge-spacing.mdc`. Do not remove shadows from concierge artifacts to match modify-selection.

**Get help:** every modify-selection screen uses `GetHelpCallButton` → **`ShiviCallSheet`** (callback confirmation with online/offline indicator per business hours).

**Booking amount:** `bookingAmountToPayInr` = max(0, new booking lock − paid lock) + change fee (₹5,000 when post-lock / modify-with-charges). When paid lock exceeds new lock, surplus is **not refunded** on this screen — shown as “will be adjusted in your final car amount” (`bookingAmountSurplusInr` on `ModifySelectionReviewBookingAmountCard`).

**Review-and-pay booking demo (QA only):** `ModifySelectionReviewPayDemoSwitcher` on `ModifySelectionReviewPayScreen` — segmented control labeled “Booking amount cases · demo”. Query `?demo_booking=` + sessionStorage `pbe_modify_review_pay_demo_v1` (`lib/modify-selection-review-pay-demo.ts`). Overrides lock amounts and fee for preview; does not change production policy outside this screen.

| `demo_booking` | New lock | Paid | Fee | Due today | Notes |
|----------------|----------|------|-----|-----------|-------|
| `higher` (default) | ₹15,000 | ₹10,000 | — | ₹5,000 | Shortfall |
| `higher_fee` (Hi+fee) | ₹15,000 | ₹10,000 | ₹5,000 | ₹10,000 | Shortfall + fee |
| `lower` | ₹7,000 | ₹10,000 | — | ₹0 | ₹3,000 adjusted in final car amount |
| `same` | ₹10,000 | ₹10,000 | — | ₹0 | No delta |
| `same_fee` (Same+fee) | ₹10,000 | ₹10,000 | ₹5,000 | ₹5,000 | Fee only |

**Chooser primary CTA** (`lib/modify-selection-content.ts` → `continueCtaLabel`; updates when the selected radio option changes):

| Option | CTA label |
|--------|-----------|
| Change colour | See available colours |
| Change variant | See available variants |
| Choose a different car | Browse cars |

Tap opens `ModifySelectionConfirmBottomSheet` — content-hug height, `BottomSheetConfirmBulletList`, bottom CTA = `continueCtaLabel` (e.g. **See available colours** / **See available variants** / **Browse cars**). Copy: `confirmHeader` + `confirmPoints[]` per option in `lib/modify-selection-content.ts` (colour: 2 bullets; variant / different car: 3 bullets on price + delivery).

| User choice | Confirm / review route | `ModifySelectionReviewPayScreen` `flow` |
|-------------|------------------------|----------------------------------------|
| **Change colour** | `/booking/modify/colour/confirm` | `colour` |
| **Change variant** | `/booking/modify/variant/confirm` | `variant` |
| **Choose a different car** | `/booking/modify/different-car/[brand]/[model]/confirm` | `different-car` (+ `brandId`, `modelId`) |

**Shared review UI:** `ModifySelectionReviewPayScreen` + `ModifySelectionReviewSelectionCard` (review-and-pay).

### Review-and-pay page IA

Title: **Confirm your change**. One decision: what is due today to lock the change.

| Block | Role |
|-------|------|
| Selection card | Identity (car / variant / colour / delivery) with gated edit |
| **What you pay to confirm the change** | Primary composed card — lavender wash, inset due amount, fee (amber) / surplus (green) notices; math under “How we calculated this” |
| **Car price** | Secondary composed card — ACKO Drive price; “View breakup” expands ex-showroom / charges / discounts |
| Demo switcher | QA only — at page bottom (`?demo_booking=`); not product chrome |
| Footer | **Due today** + **Pay ₹X** (or **Confirm** when ₹0) |

### Review page — which rows are editable

Edit icons appear only for fields the user may change on that entry path. **Delivery** edit is shown only when the selected colour is **express** (`resolved.option.isExpressDelivery` → `showDeliveryEdit`); standard colours show delivery as read-only.

| Entry choice | Make & model (title) | Variant | Colour | Delivery (express only) |
|--------------|----------------------|---------|--------|-------------------------|
| **Change colour** | Read-only (default booked car) | Read-only | **Edit** → `/booking/modify/colour` | **Edit** (bottom sheet) if express |
| **Change variant** | Read-only | **Edit** → `/booking/modify/variant` | **Edit** → `/booking/modify/variant/colour` | **Edit** if express |
| **Choose a different car** | **Edit** → `/booking/modify/different-car` | **Edit** → model/variant step for brand+model | **Edit** → colour step for brand+model | **Edit** if express |

**Implementation:** gate callbacks in `ModifySelectionReviewPayScreen` when passing props to `ModifySelectionReviewSelectionCard`:

- `onEditCar` — only when `flow === "different-car"`.
- `onEditVariant` — only when `flow === "variant"` or `flow === "different-car"`.
- `onEditColour` — all three flows.
- `showDeliveryEdit` — all three flows, express colour only.

The card renders an edit control only when the matching callback is non-null (or `showDeliveryEdit` for delivery).

### Pay → booking received

- On **Pay**, write pending snapshot: `writeModifySelectionPendingFromSummary` (`lib/active-booking-snapshot.ts`, key `pbe_modify_selection_pending_payment_v1`).
- Mock checkout: `buildBookingLockCheckoutHref` with `return_source=modify-selection`.
- Success: `/booking/confirmed?source=payment&paid=…&return_source=modify-selection` — `syncModifySelectionBookingSnapshot` commits **pending** checkout before reading completed (avoids stale car on repeat changes). **Same for all three paths** (colour / variant / different-car): auto-advance **Payment received** via `DownPaymentInstalmentSuccess` (no car card, no CTA; ~3s) — not the celebration layout.
- On success (`KycBookingConfirmedPageClient`): when the active flow is **express** or **standard**, `writeExperienceFlow` from the snapshot’s `deliveryChoice` so post-change dealer search / delivery copy follows the new selection. Demo modify flows keep their flow id (journey guards / fee demos).
- **Connected voice:** when `selectionChangeCompleted` is set, `/booking/processing` (`dealerSearch`) and `/booking/accepted` (`dealerFound`) lead with **“Change locked in…”** / **“Found a match for your new pick…”** — never first-time “paperwork done”. Car title / variant / colour are interpolated from the snapshot (`lib/concierge/script.ts` + `ConciergeMoment`).

| After pay (all three change-selection paths) | Screen | Auto-advance next |
|---------------------------------------------|--------|-------------------|
| **modify_no_charges** (pre-verification demo) | Payment received | `/kyc` |
| **modify_with_charges** | Payment received | `/booking/processing` (dealer search) |
| **express / standard** (e.g. allocation-failed → pick a different car, or manage-booking change after KYC) | Payment received | `/booking/processing` — resume express or standard spine from delivery choice; **do not** re-ask for verification |

**Key files:** `components/booking/modify-option-card-ui.tsx`, `StandaloneScreenHeader.tsx`, `ModifySelectionReviewPayScreen.tsx`, `ModifySelectionReviewPayDemoSwitcher.tsx`, `ModifySelectionReviewSelectionCard.tsx`, `ModifySelectionReviewBookingAmountCard.tsx`, `KycBookingConfirmedScreen.tsx`, `KycBookingConfirmedPageClient.tsx`, `DownPaymentInstalmentSuccess.tsx`, `lib/modify-selection-review-pay-content.ts`, `lib/modify-selection-review-pay-demo.ts`, `lib/modify-selection-*-pending.ts`, `lib/active-booking-snapshot.ts`, `lib/paymentUrls.ts`.

---

## Cancel booking (cancel demo flows)

Product cancel is available in **every** flow via `/booking/cancel` (`ConciergeCancelScreen`): free before a dealer is identified (`stage=pre`), ₹5,000 retained from booking accepted onward — including before OTP (`stage=post` = 50% of the ₹10,000 booking lock — not 50% of total paid).

Two selectable demos on **`/quote`**:

| Flow id | Park point | Cancel charge |
|---------|------------|---------------|
| `cancel_no_charges` | `/kyc/verification-in-progress` | ₹0 (`stage=pre`) |
| `cancel_with_charges` | `/booking/accepted` (partner locked) | ₹5,000 (`stage=post`) |

### Journey caps

**cancel_no_charges** — identity funnel through verification in progress:

| Allowed | Blocked (redirect → `/kyc/verification-in-progress`) |
|---------|------------------------------------------------------|
| `/quote`, payment routes, `/kyc`, `/kyc/upload`, `/kyc/documents-received`, `/kyc/verification-in-progress` | `/booking/processing`, `/booking/accepted`, `/booking/confirmed`, car-allocation, etc. |
| `/booking/cancel` | `/booking/modify/*` |

**cancel_with_charges** — express path through dealer found (partner locked):

| Allowed | Blocked (redirect → `/booking/accepted`) |
|---------|----------------------------------------------|
| Paths above plus `/booking/processing`, `/booking/accepted` | `/booking/confirmed`, car-allocation, verification-failed / manual-verification |
| `/booking/cancel` | `/booking/modify/*` |

Guards: `getCancelNoChargesRedirectTarget()` / `getCancelWithChargesRedirectTarget()` in `lib/experience-flow-journey.ts`; KYC post-hub pages use unified `getExperienceFlowJourneyRedirectTarget()` via `ModifyNoChargesGatedPage`.

On **`/kyc/verification-in-progress`**, demo **Next** is hidden when `isCancelNoChargesFlow()`. On **`/booking/accepted`**, the time-skip is hidden when `isCancelWithChargesFlow()` so the demo stays on the charged cancel park point.

### Entry

**Manage booking** → **Cancel booking** when `isCancelNoChargesFlow()` → **`/booking/cancel`**.

### Cancel confirmation (full page — Figma 2709:17395)

**Component:** `CancelBookingConfirmScreen`  
**Copy:** `lib/cancel-booking-content.ts`  
**Stagger:** `lib/cancel-booking-stagger.ts` (`.payment-success-stagger` sequence)  
**Subcomponents:** `CancelBookingCarCard`, `CancelBookingRefundSummaryCard`

| Element | Copy / behaviour |
|---------|------------------|
| Overline | Are you sure you want to cancel? — `#D16900` |
| Headline | You have come a long way to get your {model} |
| Car card | Compact horizontal card — title, variant, colour, delivery line + icon (clock for standard, bolt for express) |
| Modify prompt | Not happy with your selection? |
| Modify CTA | **Modify my booking** — `demo-nav-cta`, visible but not clickable in this flow |
| Cancel prompt | Still want to cancel? |
| Refund card | Booking amount ₹10,000 · Cancellation fee 0 · Refund amount ₹10,000 + “You'll get your refund in 5-7 business days” |
| Confirm CTA | **Yes, cancel my booking** — `demo-nav-cta` → opens reason bottom sheet |
| Back | `TopNavHeader` (`transparent`) chevron → `router.back()`; solid **`bg-white`** on scroll |

**Layout:** Gradient section (`from-white to-[#f5f5f5]`) wraps overline + headline + car card with **20px** padding below card (`pb-5`); white section starts **24px** below (`pt-8`). **16px** between refund card and confirm CTA (`mt-4`). **32px** page bottom padding below confirm CTA.

Car details: `readActiveBookingSnapshot()` or defaults from `booking-car-card-content.ts` + `getBookingDeliveryLine()`. Refund amount: `BOOKING_LOCK_AMOUNT_INR` (`lib/paymentUrls.ts`).

### Cancel reason bottom sheet (Figma 2711:21013)

**Component:** `CancelBookingReasonBottomSheet`  
Opened from **Yes, cancel my booking** on the confirm page.

| Element | Copy / behaviour |
|---------|------------------|
| Title | Before you go, tell us what went wrong? |
| Options | Checkbox-style rows (toggle select/deselect); **no default selection** |
| Reasons | Found a better deal elsewhere · Changed my mind about the car · Financial reasons · Delivery timeline is too long · Unhappy with the process · Other |
| Primary CTA | **Cancel my booking** — `primary-cta`; disabled until a reason is selected → `/booking/cancel/success` |

### Cancel success (celebration layout — not action hero)

**Component:** `CancelBookingSuccessScreen`  
**Copy:** `lib/cancel-booking-success-content.ts`  
**Layout:** Centered success content + **fixed bottom** CTA strip (same family as `SelfFinanceConfirmedScreen` — not `min-h-[90dvh]` action hero).

| Element | Copy |
|---------|------|
| Hero | `assets/Booking cancelled.svg` |
| Headline | Your booking has been cancelled (word-by-word reveal) |
| Subline | No cancellation fee applied |
| Info box | Your full booking amount of ₹10,000 will be refunded to your account in 5-7 business days. |
| CTA | **Done** (fixed footer) → `/quote` |

### Route guards

- Cancel-booking is open in every flow (policy §7). `CancelBookingFlowGuard` / `getCancelBookingFlowRedirectTarget` are no-ops if remounted.
- Demo journey caps above apply only to `cancel_no_charges` / `cancel_with_charges`.

**Key files:** `lib/experience-flow.ts`, `lib/experience-flow-journey.ts`, `lib/manage-booking-modify.ts`, `components/concierge/ConciergeCancelScreen.tsx`, `components/organisms/CancelBookingReasonBottomSheet.tsx`, `components/organisms/ManageBookingBottomSheet.tsx`, `app/booking/cancel/page.tsx`.

---

## UI patterns — hero info callout & bottom sheets

Shared **info callout** (icon + `text-xs` body, `rounded-2xl`, `border-[#E8E8E8]`, `px-3 py-3`):

- `KycBookingProcessingScreen` — `infoBox` / `sublineLine2` below subline
- `DownPaymentInsuranceSetupScreen` — insurance payable after disbursement
- `RtoRegistrationStatusCard` — RTO registration message on `/delivery/rto`

**Bottom sheets** — **always** build on `BottomSheetShell` (`components/organisms/BottomSheetShell.tsx`):

- Portal to `document.body`, `bg-black/90` scrim, 280ms slide, `max-w-[640px]`, `rounded-t-[24px]`, `sheet-elevated`
- Props: `open` / `onClose` / `showCloseButton` (absolute top-right; set `false` when the sheet owns a header close) / `constrainHeight` (90dvh; default true) / `panelClassName`
- Layout tokens stay in `lib/layout/bottom-sheet-layout.ts` (`BODY_BEFORE_CTA`, `CTA_STRIP_TOP`, scroll panel/body)
- **Exception:** `ShiviIntroBottomSheet` uses `useBottomSheetPresence` + `BottomSheetPortal` directly (coachmark sibling + non-dismissible scrim)
- Confirm / eligibility sheets: `AckoDriveFinanceEligibilityBottomSheet`, `SelfFinanceConfirmBottomSheet`, `FullPaymentConfirmBottomSheet`, `LoanApplicationCoApplicantBottomSheet`, `LoanApplicationTermsBottomSheet`, `LoanSubmitConfirmBottomSheet`, …
- Cross-flow: `ManageBookingBottomSheet`, `UploadSourceBottomSheet`, `CancelBookingReasonBottomSheet`, `ShiviCallSheet`, `BankLoanDetailBottomSheet`, `InsuranceCoverageBottomSheet` ([2585:68086](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2585-68086)), …

**Do not** re-implement mount/animate/exit or inline fixed overlays — that duplicates the shell and breaks z-index above sticky nav.

**Insurance coverage sheet:** ZD + TP rows (`assets/ZD cover.svg`, `assets/TP cover.svg`), 20px gap between rows; opened from **View coverage details** on `ZeroDepInsuranceCoverageCard` (button unless `coverageDetailsHref` set).

**Overlay glass** (`lib/overlay-glass-card.module.scss`): softer fill `linear-gradient(100deg, rgba(255,255,255,0.7) → rgba(255,255,255,0.3))`, white 1px border, blur 32px; nested separators inherit **`--card-separator-color: #d6dce7`**.

---

## UI patterns — circular icon wells, title/detail gaps, bank logos

Two circular icon treatments — pick by surface, do not mix:

| Molecule | Look | Use |
|----------|------|-----|
| **`IconWell`** | 1px border · gradient fill · inset white ring | Menu rows, receipts, cards, bank logos, plan nodes |
| **`SoftIconPad`** | Flat `#f5f5f5`, default **36px** | Confirm / eligibility / how-it-works bottom-sheet step rows |

Global `.icon-well-surface*` classes in `styles/_components.scss` are deprecated in favour of `IconWell`.

### Circular icon wells (`IconWell`)

| Tone | Border / fill | Use |
|------|---------------|-----|
| **Grey (default)** | `1px #e8e8e8` · `linear-gradient(180deg, #e4e6ea → #fff)` · inset white ring | Document rows, manage-menu icons, `NextStepCard`, bank logos (list), partner/location wells, self-finance how-it-works **card** variant |
| **Green (success)** | `1px #bfe8d2` · `linear-gradient(180deg, #dff1e8 → #fff)` · inset white ring | `AmountReceivedCard` received tick, `PlanList` done nodes, `MoneyPlanCard` active node |
| **Amber (processing)** | `1px #f0ddb0` · `linear-gradient(180deg, #ffefd0 → #fff)` · inset white ring | `AmountReceivedCard` processing, `MoneyPlanCard` pending node |
| **Purple (current)** | `1px #5920c5` · `linear-gradient(180deg, #e5dafb → #fff)` · inset white ring | `PlanList` / progress “now” nodes |

**Default well size:** **44px**. **Default glyph size inside wells:** **20px**. Progress appearance uses **32px** status nodes.

### Soft icon pads (`SoftIconPad`)

Confirm-sheet step rows (`BottomSheetConfirmBulletList`, `SelfFinanceHowItWorksCard` `variant="embedded"`, eligibility sheet). Default **36px** / `#f5f5f5` / **20px** glyph. Do not substitute `IconWell` here.

**Exceptions (IconWell sizing)**

| Surface | Well | Logo / glyph |
|---------|------|--------------|
| Bank list cards (`BankLoanCard`) | 44px grey well | **24px** bank logo |
| Bank detail sheet (`BankLoanDetailBottomSheet`) | **52px** grey well | **32px** bank logo |
| Loan-rejected option cards | Illustration / bank mark at **44px** (not always an `IconWell`) | Bank mark or colour illustration |

`PlanList` timeline nodes are **44px** in plan mode (rail column width matches); **progress** mode uses 32px status icons + “In progress” / “Done” labels. Done nodes use the green well; now uses purple; todo keeps grey.

Pills, chips, and banner strips (pre-approved chip, status tags on receipt rows, delivery badges) stay **flat fills** — not icon wells.

### Title + detail / amount + label gap

Primary line + secondary line stacks use **4px** vertical gap (flex column `gap: 4px`, or `margin-top: 4px` where the parent is not a column). Applied across:

- `AmountReceivedCard` amount + title
- `IconCalloutCard` family — title **16px** / body **14px** (`NextStepCard`, `MarginMoneySlipCard`, `ProformaInvoiceCard`, `PartnerGarageCard` wrappers); title↔body gap **4px**; optional CTA at **14px**
- `CarDeliveryScheduleScreen` location name + detail
- Document upload rows (`document-upload-card-layout` / `DocumentUploadSection`)
- `LoanDocumentsChecklistCard`, `ShieldPolicyCard` highlights, insurance tenure stats, coverage addon rows
- `BankLoanCard` / `CarSummaryCardLite` / `MoneyPlanCard` primary + caption lines
- Payment-option stat captions, `CancelBookingCarCard` title → variant

### Bank selection UI

Full-page picker: **`/payment/choose-bank`** (`BankSelectionScreen` + `BankLoanCard` list → `BankLoanDetailBottomSheet`). Shared route for initial choice, mid-flow change, and post-rejection switch (`lib/payment/bank-selection-urls.ts`). Logo wells follow the circular style above (list 44/24, detail sheet 52/32).

### Shivi callback availability

`ShiviCallSheet` avatar shows a **14px** status dot (white ring):

- **Green `#0fa457`** — within business hours → “I'll call you within 10 minutes”
- **Grey `#b7b7b8`** — outside hours → “I'll call you once I'm back online” + hours callout

Hours: **9 AM–9 PM IST**, every day (`lib/shivi-business-hours.ts`). Re-evaluated each time the sheet opens.

---

## Done — payment choice + bank sheet (ACKO Drive)

### Behaviour

- On **Finance with ACKO Drive**, primary CTA label is **“See bank options”** (not direct checkout).
- Tap opens **`AckoDriveFinanceEligibilityBottomSheet`** first; **Agree and continue** opens **`BankSelectionBottomSheet`** (modal over dimmed backdrop).
- **Confirm banking partner** closes the sheet and navigates to **`/payment/acko-drive-finance-confirmed`**; user continues to **`/payment/acko-drive-finance-action`**, then co-applicant gate → **loan application wizard** (see **Payment journeys** above). Chosen bank id is carried in **`?bank=`** on downstream routes where wired — persistence to checkout/API remains backlog.

### Files

- `components/payment/AckoDriveFinanceEligibilityBottomSheet.tsx` — eligibility gate
- `components/payment/BankSelectionBottomSheet.tsx` — sheet UI + open/close animation
- `components/payment/ChoosePaymentOptionsScreen.tsx` — eligibility + bank sheet, self-finance sheet, CTA routing
- `components/payment/payment-choose-assets.ts` — `BANK_SHEET_OPTIONS`, `PAYMENT_CHOOSE_ASSETS`, `asset()` helper for `/public/assets/`

### Bank sheet UX (implemented)

- **Animation:** Sheet slides up on open, down on dismiss (~280ms); backdrop fades in/out. `prefers-reduced-motion` disables motion.
- **Backdrop:** `bg-black/90` (90% opacity).
- **Layout:** Full-viewport overlay; sheet `max-w-[360px]`, centered, `rounded-t-[20px]`, `max-h-[90dvh]` with sheet-level scroll only if viewport is very short (removed inner scroll + 560px cap that caused unnecessary scrolling).
- **Header:** Title “Choose your banking partner”; subtitle “Finance through” + **ACKO Drive logo** (`public/assets/ACKO Drive logo.svg`).
- **Top padding** on scrollable header block: **24px** (`pt-6`).
- **Bank rows:** HDFC, Bank of Baroda, ICICI, Bank of India, Canara Bank — logo, name, “Interest rate from …”, selected border/background, shared radio artwork from assets.
- **Radio:** Absolutely positioned **12px from top and right** of each card (`top-3 right-3`); `pointer-events-none` so the whole row remains the hit target; content uses extra right padding (`pr-10`) to avoid overlap.
- **Footer:** **Confirm banking partner** uses `primary-cta`; **no top border** above the CTA.

### Full-page bank selection (also implemented)

- Route **`/payment/choose-bank`** (`BankSelectionScreen`) — shared entry for initial pick, change-bank, and loan-rejection switch (`bank-selection-urls.ts`).
- Cards: **`BankLoanCard`** with **44px** circular grey `IconWell` + **24px** logo; opens **`BankLoanDetailBottomSheet`** (**52px** well + **32px** logo).
- Loan-rejected alt-bank options use a bank mark illustration (not the list-card well) with rate + EMI footer.

### Assets added / referenced

- `public/assets/ACKO Drive logo.svg` (wordmark; synced from `assets/ACKO Drive logo.svg`)
- `assets/co-applicant.svg` — co-applicant sheet + loan-rejected / guarantor illustrations
- `assets/Close 01.svg` — eligibility “not financed” row icons

---

## Local-only dev tools (not in git)

These paths are **gitignored** (see root `.gitignore`). They are optional helpers kept on developer machines only; fresh clones will not include them unless you restore copies locally.

| Path | Purpose |
|------|---------|
| `/dev/flow-visualiser` | Flow catalogue + screen picker, device chrome, iframe (`app/dev/flow-visualiser/page.tsx`, `components/dev/FlowVisualiser.tsx`) |
| `/dev/mobile-mock` | Same-origin iframe preview (`app/dev/mobile-mock/page.tsx`, e.g. `?path=/payment`) |

---

## Operational notes (local)

- **“This page isn’t working” / HTTP 500 in dev** with the server still listening: often **stale Turbopack `.next`**. Fix: stop the process on **3008**, `rm -rf .next`, `npm run dev`.
- Do not run `http://localhost:3008` in the shell as a command; open it in the **browser**.

---

## Backlog / follow-ups

1. **Persist selected bank** on Confirm (`?bank=` already used on navigation; persist to checkout/API / session as needed).
2. **Self finance journey state** — drive nested substep statuses from backend or `sessionStorage`; wire **ProformaInvoiceCard** `downloadHref` to real PDF.
3. **Loan / DP state** — replace URL query demo (`loan_amount`, `down_payment`, `original_down_payment`) with session or API; real transaction IDs on disbursement screen.
4. **Manage booking payment summary** — align “post-allocation” / engine-chassis visibility with true journey milestone (main spine shows VIN at booking-confirmed after OTP; `manageBookingShowVehicleIdentification` on post-payment screens).
5. **Accessibility:** focus trap in sheets, return focus to trigger on close, optional `aria-describedby` for subtitle.
6. **Z-index / stacking:** confirm no clash with other fixed layers (e.g. choose-screen footer).
7. **KYC + payment sequencing:** align route guards and deep links with final product copy in the DOCX.
8. **Static export / prerender:** wrap `useSearchParams()` consumers (e.g. `/booking/processing`, manage booking) in `Suspense` where build fails.

---

## Checklist (high level)

- [x] Payment choose screen with three options + partner strip
- [x] ACKO Drive → eligibility sheet → bank selection bottom sheet (Figma-aligned iterations)
- [x] ACKO Drive confirmed → finance action → co-applicant gate → loan application wizard (dual-pass)
- [x] Loan application terms sheet at final submit; co-applicant identity (Aadhaar/PAN) + financial docs
- [x] Loan rejected analysis outcomes (`?outcome=`) — self-finance / full pay / co-applicant / guarantor / alt bank / cancel (`from=finance`, 50% fee)
- [x] Loan-rejected 48h decision SLA → `/payment/loan-decision-cancelled` (post-lock 50% fee)
- [x] Guarantor capture screen (shell + Aadhaar/PAN uploads) → under-review
- [x] Delivery schedule = dealership pickup; PlanList **Collect your car**; registration post-RTO; manage-card pickup line
- [x] Insurance tenure bordered cards (no elevation) on white modify-selection shell
- [x] Cancel confirm: single CTA; `our-failure` / `from=finance` specials; phase remount animation
- [x] Allocation decision SLA timeout → `/car-allocation/decision-cancelled` refund turn (₹0 fee — car not assigned)
- [x] Self finance → confirm bottom sheet → celebration → action screen + proforma card
- [x] Self finance “What’s next” uses **`LoanProcessingWhatsNext`** (`self_finance_action`) for parity with loan-processing timeline UX
- [x] Sheet motion, strong backdrop, layout and radio placement refinements
- [x] ACKO Drive logo in sheet subtitle
- [x] Choose loan amount — slider ₹1L–on-road, payment summary card, confirm bottom sheet copy + **Agree and continue**
- [x] Pay down payment — car DP hero card, partial/remaining summary, confirmed subline
- [x] Down payment complete → insurance setup info callout; manage-booking loan payment summary
- [x] Loan disbursed screen — transaction ID, personalised headline
- [x] Insurance coverage bottom sheet (Figma 2585:68086) from **View coverage details**
- [x] RTO prep info callout aligned with hero info pattern
- [x] Manage booking — post-allocation cancel fee ₹5,000; loan plan summary with partial/full DP states
- [x] Modify selection review — edit icons gated by flow (colour: colour+delivery; variant: variant+colour+delivery; different-car: make/model+variant+colour+delivery; delivery edit express-only)
- [x] Cancel no charges flow — selectable on quote; journey through verification in progress
- [x] Cancel no charges — manage booking: cancel enabled; change selection visible but not clickable
- [x] Cancel confirmation full page (Figma 2709:17395) + reason bottom sheet (Figma 2711:21013) + celebration success page; route guards; full booking amount refund (₹10,000, no fee)
- [x] Standard **Car ready early** demo — offer → confirm (same dealer / needs verification) or keep original date → wait; early delivery line override (`lib/concierge/early-delivery.ts`)
- [x] **`IconWell` molecule** (grey / green / amber / purple, 1px borders) + softer overlay glass (`#d6dce7` separators)
- [x] `PlanList` progress appearance (32px nodes, In progress / Done) + 4px title/detail gaps across receipt, plan, upload, and document cards
- [x] Bank list/detail logo wells (44/24 list · 52/32 sheet) via `IconWell`
- [x] `NextStepCard` OTP/call glyph at 20px; `ShiviCallSheet` online/offline indicator via business hours
- [x] **`BottomSheetShell`** — shared portal/scrim/slide/close; all product sheets migrated (Shivi intro uses presence hook exception)
- [x] **`SoftIconPad`** — plain grey confirm-sheet pads (vs `IconWell` for menu/receipts)
- [x] Atomic placement rules documented in PLAN (feature folders + shared layers)
- [ ] Pass selected `bankId` / self-finance step state into payment/checkout and APIs
- [ ] Full a11y pass on sheets
- [ ] End-to-end journey documented in README (optional)
