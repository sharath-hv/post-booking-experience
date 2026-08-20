import { cn } from "@/utils/utils";

import styles from "./ToggleAdd.module.scss";

export type ToggleAddProps = {
  selected: boolean;
  idleLabel: string;
  selectedLabel: string;
  onClick: () => void;
  className?: string;
};

/** Compact Add / Added control. Parent owns the selected state. */
export function ToggleAdd({
  selected,
  idleLabel,
  selectedLabel,
  onClick,
  className,
}: ToggleAddProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(styles.btn, selected && styles.btnSelected, className)}
    >
      {selected ? selectedLabel : idleLabel}
    </button>
  );
}
