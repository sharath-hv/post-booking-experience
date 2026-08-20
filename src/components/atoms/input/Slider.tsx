import type { InputHTMLAttributes } from "react";

import { cn } from "@/utils/utils";

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/** Range input using the shared `.choose-loan-down-range` thumb/track chrome. */
export function Slider({ className, ...props }: SliderProps) {
  return (
    <input type="range" className={cn("choose-loan-down-range", className)} {...props} />
  );
}
