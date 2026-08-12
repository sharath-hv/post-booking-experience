type ToastListener = (message: string) => void;

let listener: ToastListener | null = null;

/** Show a short-lived toast (requires {@link AppToastHost} in the tree). */
export function showAppToast(message: string) {
  listener?.(message);
}

export function subscribeAppToast(fn: ToastListener) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}
