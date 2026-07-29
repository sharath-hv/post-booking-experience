"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { subscribeAppToast } from "@/lib/app-toast";
import styles from "./AppToastHost.module.scss";

const TOAST_MS = 2200;

/** Body-level toast host — sits above manage overlay / bottom sheets. */
export function AppToastHost() {
  const [message, setMessage] = useState<string | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    return subscribeAppToast((next) => {
      setMessage(next);
    });
  }, []);

  useEffect(() => {
    if (message == null) return;
    const id = window.setTimeout(() => setMessage(null), TOAST_MS);
    return () => window.clearTimeout(id);
  }, [message]);

  if (portalTarget == null || message == null) return null;

  return createPortal(
    <div className={styles.host} role="status" aria-live="polite">
      <div key={message} className={styles.toast}>
        {message}
      </div>
    </div>,
    portalTarget,
  );
}
