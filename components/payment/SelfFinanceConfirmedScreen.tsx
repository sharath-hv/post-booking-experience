"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import ackoDriveFinanceSuccessLottie from "@/components/kyc/lottie/acko-drive-finance-success.json";
import { useReducedMotion } from "@/lib/animations/utils";
import styles from "./SelfFinanceConfirmedScreen.module.scss";


const USER_NAME = "Sharath";

const HEADLINE = `You're financing your own way, ${USER_NAME}`;
const SUBLINE =
  "Arrange the loan with your bank. We will provide all the documents your bank needs.";

/** If Lottie `onComplete` never fires, still reveal copy so the user is not stuck. */
const HEADER_FALLBACK_MS = 2200;
/** After copy mounts, delay before showing the bottom CTA (reads as step 3). */
const CTA_AFTER_COPY_MS = 420;

const FADE_DURATION = 0.45;
const FADE_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Self finance — payment option confirmed. Sequence: Lottie → headline + subtext → CTA.
 * Copy and footer stay in the DOM from first paint (opacity only) to avoid layout shift.
 */
export function SelfFinanceConfirmedScreen() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const copyRevealedByLottieRef = useRef(false);
  const [showCopy, setShowCopy] = useState(prefersReducedMotion);
  const [showFooter, setShowFooter] = useState(prefersReducedMotion);

  const revealCopy = useCallback(() => {
    copyRevealedByLottieRef.current = true;
    setShowCopy(true);
  }, []);

  const onLottieComplete = useCallback(() => {
    revealCopy();
  }, [revealCopy]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setTimeout(() => {
      if (!copyRevealedByLottieRef.current) {
        revealCopy();
      }
    }, HEADER_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, [prefersReducedMotion, revealCopy]);

  useEffect(() => {
    if (!showCopy || prefersReducedMotion) return;
    const id = window.setTimeout(() => setShowFooter(true), CTA_AFTER_COPY_MS);
    return () => window.clearTimeout(id);
  }, [showCopy, prefersReducedMotion]);

  return (
    <div className={styles.relative_0}>
      <div
        className={styles.pointer_events_none_1}
        aria-hidden
      />

      <div className={styles.relative_2}>
        <div className={styles._translate_y_8_3}>
          <div className={styles.relative_4}>
            <Lottie
              animationData={ackoDriveFinanceSuccessLottie}
              loop={false}
              className={styles.h_full_5}
              aria-label="Success animation"
              onComplete={onLottieComplete}
            />
          </div>

          <motion.div
            className={styles.mt_6_6}
            initial={false}
            animate={{ opacity: showCopy ? 1 : 0 }}
            transition={{ duration: FADE_DURATION, ease: FADE_EASE }}
            aria-hidden={!showCopy}
          >
            <h1 className={styles.text_center_7}>
              {HEADLINE}
            </h1>
            <p className={styles.max_w_sm_8}>{SUBLINE}</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        className={[styles.relative_9, "footer-elevated"].filter(Boolean).join(" ")}
        initial={false}
        animate={{ opacity: showFooter ? 1 : 0 }}
        transition={{ duration: FADE_DURATION, ease: FADE_EASE }}
        style={{ pointerEvents: showFooter ? "auto" : "none" }}
        aria-hidden={!showFooter}
      >
        <button
          type="button"
          className={[styles.primary_cta_10, "primary-cta"].filter(Boolean).join(" ")}
          onClick={() => router.push("/payment/self-finance-action")}
          tabIndex={showFooter ? 0 : -1}
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}
