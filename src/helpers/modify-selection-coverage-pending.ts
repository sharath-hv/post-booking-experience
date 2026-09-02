import type { InsuranceTenureId } from "@/components/organisms/payment/insurance-coverage-content";
import {
  MODIFY_SELECTION_COLOUR_CONFIRM_PATH,
} from "@/constants/modify-selection-colours-content";
import {
  MODIFY_SELECTION_DEFAULT_ACCESSORY_SELECTED,
  MODIFY_SELECTION_DEFAULT_INSURANCE_TENURE,
} from "@/constants/modify-selection-coverage-content";
import { MODIFY_SELECTION_VARIANT_CONFIRM_PATH } from "@/constants/modify-selection-variants-content";
import { readModifySelectionColourPending } from "@/helpers/modify-selection-colour-pending";
import { readModifySelectionDifferentCarPending } from "@/helpers/modify-selection-different-car-pending";
import { modifySelectionDifferentCarConfirmPath } from "@/helpers/modify-selection-different-car-paths";
import { readModifySelectionVariantPending } from "@/helpers/modify-selection-variant-pending";

const STORAGE_KEY = "pbe_modify_selection_coverage_pending_v1";

export type ModifySelectionCoverageFlow = "colour" | "variant" | "different-car";

export type ModifySelectionCoveragePending = {
  flow: ModifySelectionCoverageFlow;
  confirmPath: string;
  insuranceTenure: InsuranceTenureId;
  accessorySelected: boolean;
  /** True when opened from confirm edit — Continue returns to confirm, not the next step. */
  returnToConfirm: boolean;
};

function isTenureId(value: unknown): value is InsuranceTenureId {
  return value === "1+3" || value === "3+3";
}

function isFlow(value: unknown): value is ModifySelectionCoverageFlow {
  return value === "colour" || value === "variant" || value === "different-car";
}

export function readModifySelectionCoveragePending(): ModifySelectionCoveragePending | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const parsed = JSON.parse(raw) as Partial<ModifySelectionCoveragePending>;
    if (
      !isFlow(parsed.flow) ||
      typeof parsed.confirmPath !== "string" ||
      parsed.confirmPath.length === 0 ||
      !isTenureId(parsed.insuranceTenure) ||
      typeof parsed.accessorySelected !== "boolean"
    ) {
      return null;
    }
    return {
      flow: parsed.flow,
      confirmPath: parsed.confirmPath,
      insuranceTenure: parsed.insuranceTenure,
      accessorySelected: parsed.accessorySelected,
      returnToConfirm: parsed.returnToConfirm === true,
    };
  } catch {
    return null;
  }
}

export function writeModifySelectionCoveragePending(
  pending: ModifySelectionCoveragePending,
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearModifySelectionCoveragePending(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function inferCoverageFromSelectionPending(): ModifySelectionCoveragePending | null {
  const differentCar = readModifySelectionDifferentCarPending();
  if (differentCar != null) {
    return {
      flow: "different-car",
      confirmPath: modifySelectionDifferentCarConfirmPath(
        differentCar.brandId,
        differentCar.modelId,
      ),
      insuranceTenure: MODIFY_SELECTION_DEFAULT_INSURANCE_TENURE,
      accessorySelected: MODIFY_SELECTION_DEFAULT_ACCESSORY_SELECTED,
      returnToConfirm: false,
    };
  }

  if (readModifySelectionVariantPending() != null) {
    return {
      flow: "variant",
      confirmPath: MODIFY_SELECTION_VARIANT_CONFIRM_PATH,
      insuranceTenure: MODIFY_SELECTION_DEFAULT_INSURANCE_TENURE,
      accessorySelected: MODIFY_SELECTION_DEFAULT_ACCESSORY_SELECTED,
      returnToConfirm: false,
    };
  }

  if (readModifySelectionColourPending() != null) {
    return {
      flow: "colour",
      confirmPath: MODIFY_SELECTION_COLOUR_CONFIRM_PATH,
      insuranceTenure: MODIFY_SELECTION_DEFAULT_INSURANCE_TENURE,
      accessorySelected: MODIFY_SELECTION_DEFAULT_ACCESSORY_SELECTED,
      returnToConfirm: false,
    };
  }

  return null;
}

/** Seed or refresh coverage for the current modify flow. Keeps prior tenure/kit picks. */
export function beginModifySelectionCoverage(input: {
  flow: ModifySelectionCoverageFlow;
  confirmPath: string;
  returnToConfirm?: boolean;
}): ModifySelectionCoveragePending {
  const prev = readModifySelectionCoveragePending();
  const next: ModifySelectionCoveragePending = {
    flow: input.flow,
    confirmPath: input.confirmPath,
    insuranceTenure: prev?.insuranceTenure ?? MODIFY_SELECTION_DEFAULT_INSURANCE_TENURE,
    accessorySelected: prev?.accessorySelected ?? MODIFY_SELECTION_DEFAULT_ACCESSORY_SELECTED,
    returnToConfirm: input.returnToConfirm === true,
  };
  writeModifySelectionCoveragePending(next);
  return next;
}

/** Read coverage, or infer it from colour/variant/different-car pending. */
export function ensureModifySelectionCoveragePending(): ModifySelectionCoveragePending | null {
  const existing = readModifySelectionCoveragePending();
  if (existing != null) return existing;
  const inferred = inferCoverageFromSelectionPending();
  if (inferred != null) {
    writeModifySelectionCoveragePending(inferred);
    return inferred;
  }
  return null;
}
