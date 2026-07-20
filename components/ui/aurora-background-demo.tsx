"use client";

import { motion } from "framer-motion";

import { AuroraBackground } from "@/components/ui/aurora-background";
import styles from "./aurora-background-demo.module.scss";


export function AuroraBackgroundDemo() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className={styles.relative_0}
      >
        <div className={styles.text_center_1}>
          Background lights are cool you know.
        </div>
        <div className={styles.py_4_2}>
          And this, is chemical burn.
        </div>
        <button
          type="button"
          className={styles.w_fit_3}
        >
          Debug now
        </button>
      </motion.div>
    </AuroraBackground>
  );
}
