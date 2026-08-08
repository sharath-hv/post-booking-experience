"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BACKDROP_MODE_CHANGE_EVENT,
  type BackdropMode,
  readBackdropMode,
  writeBackdropMode,
} from "@/lib/concierge/backdrop";

export function useBackdropMode(): [BackdropMode, (mode: BackdropMode) => void] {
  const [mode, setMode] = useState<BackdropMode>("aurora");

  useEffect(() => {
    setMode(readBackdropMode());

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<BackdropMode>).detail;
      setMode(detail === "video" ? "video" : "aurora");
    };

    window.addEventListener(BACKDROP_MODE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(BACKDROP_MODE_CHANGE_EVENT, onChange);
  }, []);

  const setBackdropMode = useCallback((next: BackdropMode) => {
    writeBackdropMode(next);
    setMode(next);
  }, []);

  return [mode, setBackdropMode];
}
