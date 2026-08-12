import type {
  LoanApplicationApplicant,
  LoanApplicationCoApplicantRelation,
  LoanApplicationEmploymentType,
} from "@/constants/loan-application-content";
import { isLoanApplicationCoApplicantRelation } from "@/constants/loan-application-content";
import {
  createEmptyLoanApplicationDocuments,
  isLoanApplicationDocumentsState,
  type LoanApplicationDocumentsState,
} from "@/helpers/loan-application-documents-state";

export type LoanApplicationAddressFields = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

export type LoanApplicationOfficialAddress = {
  pincode: string;
  city: string;
  state: string;
  address: string;
};

export type LoanApplicationWorkDetails = {
  officialEmail: string;
  employerName: string;
  officialAddress: LoanApplicationOfficialAddress;
};

export function emptyOfficialAddress(): LoanApplicationOfficialAddress {
  return { pincode: "", city: "", state: "", address: "" };
}

export type LoanApplicationReference = {
  fullName: string;
  phone: string;
  address: string;
};

/** Person-shaped wizard data — used for primary and co-applicant passes. */
export type LoanApplicationApplicantProfile = {
  personal: {
    /** Co-applicant only — shown on personal details during the co pass. */
    fullName: string;
    /** Co-applicant only — relation to the primary applicant. */
    relationToPrimary: LoanApplicationCoApplicantRelation | null;
    /** Co-applicant only — primary employment lives on loanDetails. */
    employmentType: LoanApplicationEmploymentType | null;
    email: string;
    motherName: string;
    spouseName: string;
    work: LoanApplicationWorkDetails;
  };
  address: {
    permanent: LoanApplicationAddressFields;
    current: LoanApplicationAddressFields;
    currentSameAsPermanent: boolean;
  };
  documents: LoanApplicationDocumentsState;
  references: [LoanApplicationReference, LoanApplicationReference];
};

export type LoanApplicationState = {
  loanDetails: {
    loanAmountInr: number;
    tenureMonths: number;
    employmentType: LoanApplicationEmploymentType | null;
  };
  /** null until answered in the start-application bottom sheet. */
  includeCoApplicant: boolean | null;
  /** Primary applicant — kept at top level for the existing screens. */
  personal: LoanApplicationApplicantProfile["personal"];
  address: LoanApplicationApplicantProfile["address"];
  documents: LoanApplicationDocumentsState;
  references: [LoanApplicationReference, LoanApplicationReference];
  /** Populated when the user opts into a co-applicant. */
  coApplicant: LoanApplicationApplicantProfile | null;
};

const STORAGE_KEY = "pbe_loan_application_state_v2";

export function emptyAddress(): LoanApplicationAddressFields {
  return { line1: "", line2: "", city: "", state: "", pincode: "" };
}

export function emptyReference(): LoanApplicationReference {
  return { fullName: "", phone: "", address: "" };
}

export function emptyApplicantProfile(): LoanApplicationApplicantProfile {
  return {
    personal: {
      fullName: "",
      relationToPrimary: null,
      employmentType: null,
      email: "",
      motherName: "",
      spouseName: "",
      work: {
        officialEmail: "",
        employerName: "",
        officialAddress: emptyOfficialAddress(),
      },
    },
    address: {
      permanent: emptyAddress(),
      current: emptyAddress(),
      currentSameAsPermanent: true,
    },
    documents: createEmptyLoanApplicationDocuments(),
    references: [emptyReference(), emptyReference()],
  };
}

/** Demo co-applicant prefill — distinct from the primary so dual-pass is obvious. */
export function createDefaultCoApplicantProfile(): LoanApplicationApplicantProfile {
  return {
    personal: {
      fullName: "Ananya R",
      relationToPrimary: "spouse",
      employmentType: "salaried",
      email: "ananya.r@gmail.com",
      motherName: "Meena R",
      spouseName: "",
      work: {
        officialEmail: "ananya.r@northstar.in",
        employerName: "Northstar Analytics",
        officialAddress: {
          pincode: "560034",
          city: "Bengaluru",
          state: "Karnataka",
          address: "2nd Floor, Koramangala 5th Block",
        },
      },
    },
    address: {
      permanent: {
        line1: "18, 4th Cross",
        line2: "Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
      },
      current: {
        line1: "18, 4th Cross",
        line2: "Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
      },
      currentSameAsPermanent: true,
    },
    documents: {
      aadhaar: [
        { id: "demo-co-aadhaar-1", name: "Co_Aadhaar_front.jpg", source: "file" },
        { id: "demo-co-aadhaar-2", name: "Co_Aadhaar_back.jpg", source: "file" },
      ],
      pan: [{ id: "demo-co-pan-1", name: "Co_PAN.jpg", source: "file" }],
      salarySlip: [{ id: "demo-co-salary-1", name: "Co_Salary_slip_Mar.pdf", source: "file" }],
      bankStatement: [{ id: "demo-co-bank-1", name: "Co_Bank_statement_6mo.pdf", source: "file" }],
      addressProof: [{ id: "demo-co-addr-1", name: "Co_Address_proof.pdf", source: "file" }],
      form16: [{ id: "demo-co-form16-1", name: "Co_Form16_FY25.pdf", source: "file" }],
    },
    references: [
      { fullName: "Vikram Shah", phone: "9876512340", address: "Jayanagar, Bengaluru" },
      { fullName: "Sneha Iyer", phone: "9876512341", address: "Whitefield, Bengaluru" },
    ],
  };
}

/**
 * Demo prefill — the wizard starts with every step complete so demos can move
 * fast (Continue is enabled immediately; fields stay editable).
 */
export function createDefaultLoanApplicationState(): LoanApplicationState {
  return {
    loanDetails: {
      loanAmountInr: 10_73_780,
      tenureMonths: 60,
      employmentType: "salaried",
    },
    includeCoApplicant: null,
    personal: {
      fullName: "",
      relationToPrimary: null,
      employmentType: null,
      email: "sharath.hv@gmail.com",
      motherName: "Lakshmi H V",
      spouseName: "",
      work: {
        officialEmail: "sharath.hv@meridiansoft.in",
        employerName: "Meridian Software Pvt Ltd",
        officialAddress: {
          pincode: "560066",
          city: "Bengaluru",
          state: "Karnataka",
          address: "4th Floor, Tower B, Prestige Tech Park, Marathahalli",
        },
      },
    },
    address: {
      permanent: {
        line1: "221, 6th Main Road",
        line2: "HSR Layout, Sector 2",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560102",
      },
      current: {
        line1: "221, 6th Main Road",
        line2: "HSR Layout, Sector 2",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560102",
      },
      currentSameAsPermanent: true,
    },
    documents: {
      aadhaar: [],
      pan: [],
      salarySlip: [{ id: "demo-salary-1", name: "Salary_slip_Mar.pdf", source: "file" }],
      bankStatement: [{ id: "demo-bank-1", name: "Bank_statement_6mo.pdf", source: "file" }],
      addressProof: [{ id: "demo-addr-1", name: "Rental_agreement.pdf", source: "file" }],
      form16: [{ id: "demo-form16-1", name: "Form16_FY25.pdf", source: "file" }],
    },
    references: [
      { fullName: "Rohan Kumar", phone: "9876543210", address: "HSR Layout, Bengaluru" },
      { fullName: "Priya Nair", phone: "9876501234", address: "Indiranagar, Bengaluru" },
    ],
    coApplicant: null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAddress(value: unknown): value is LoanApplicationAddressFields {
  if (!isRecord(value)) return false;
  return (
    typeof value.line1 === "string" &&
    typeof value.line2 === "string" &&
    typeof value.city === "string" &&
    typeof value.state === "string" &&
    typeof value.pincode === "string"
  );
}

function isReference(value: unknown): value is LoanApplicationReference {
  if (!isRecord(value)) return false;
  return (
    typeof value.fullName === "string" &&
    typeof value.phone === "string" &&
    (typeof value.address === "string" || typeof value.relationship === "string")
  );
}

function normalizeReference(value: unknown): LoanApplicationReference {
  if (!isRecord(value)) return emptyReference();
  return {
    fullName: typeof value.fullName === "string" ? value.fullName : "",
    phone: typeof value.phone === "string" ? value.phone : "",
    address:
      typeof value.address === "string"
        ? value.address
        : typeof value.relationship === "string"
          ? value.relationship
          : "",
  };
}

function parseEmploymentType(value: unknown): LoanApplicationEmploymentType | null {
  return value === "salaried" || value === "self_employed" ? value : null;
}

function parsePersonal(personal: Record<string, unknown>) {
  const work = isRecord(personal.work) ? personal.work : {};
  const officialAddr = isRecord(work.officialAddress) ? work.officialAddress : {};
  const legacyWorkAddress = typeof work.workAddress === "string" ? work.workAddress : "";
  const relation =
    typeof personal.relationToPrimary === "string" &&
    isLoanApplicationCoApplicantRelation(personal.relationToPrimary)
      ? personal.relationToPrimary
      : null;
  return {
    fullName: typeof personal.fullName === "string" ? personal.fullName : "",
    relationToPrimary: relation,
    employmentType: parseEmploymentType(personal.employmentType),
    email: typeof personal.email === "string" ? personal.email : "",
    motherName: typeof personal.motherName === "string" ? personal.motherName : "",
    spouseName: typeof personal.spouseName === "string" ? personal.spouseName : "",
    work: {
      officialEmail: typeof work.officialEmail === "string" ? work.officialEmail : "",
      employerName: typeof work.employerName === "string" ? work.employerName : "",
      officialAddress: {
        pincode: typeof officialAddr.pincode === "string" ? officialAddr.pincode : "",
        city: typeof officialAddr.city === "string" ? officialAddr.city : "",
        state: typeof officialAddr.state === "string" ? officialAddr.state : "",
        address:
          typeof officialAddr.address === "string"
            ? officialAddr.address
            : legacyWorkAddress,
      },
    },
  };
}

function parseAddressBlock(address: Record<string, unknown>) {
  return {
    permanent: isAddress(address.permanent) ? address.permanent : emptyAddress(),
    current: isAddress(address.current) ? address.current : emptyAddress(),
    currentSameAsPermanent:
      typeof address.currentSameAsPermanent === "boolean"
        ? address.currentSameAsPermanent
        : false,
  };
}

function parseApplicantProfile(value: unknown): LoanApplicationApplicantProfile | null {
  if (!isRecord(value)) return null;
  const personal = isRecord(value.personal) ? value.personal : {};
  const address = isRecord(value.address) ? value.address : {};
  const refs = Array.isArray(value.references) ? value.references : [];
  const parsedPersonal = parsePersonal(personal);
  const demoPersonal = createDefaultCoApplicantProfile().personal;
  return {
    personal: {
      ...parsedPersonal,
      // Demo prefill — older sessions may predate co-applicant identity fields.
      fullName: parsedPersonal.fullName.trim() || demoPersonal.fullName,
      relationToPrimary: parsedPersonal.relationToPrimary ?? demoPersonal.relationToPrimary,
      employmentType: parsedPersonal.employmentType ?? demoPersonal.employmentType,
    },
    address: parseAddressBlock(address),
    documents: isLoanApplicationDocumentsState(value.documents)
      ? value.documents
      : createEmptyLoanApplicationDocuments(),
    references: [
      isReference(refs[0]) ? normalizeReference(refs[0]) : emptyReference(),
      isReference(refs[1]) ? normalizeReference(refs[1]) : emptyReference(),
    ],
  };
}

function parseState(raw: string): LoanApplicationState | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;
    const defaults = createDefaultLoanApplicationState();
    const loanDetails = isRecord(parsed.loanDetails) ? parsed.loanDetails : {};
    const personal = isRecord(parsed.personal) ? parsed.personal : {};
    const address = isRecord(parsed.address) ? parsed.address : {};
    const refs = Array.isArray(parsed.references) ? parsed.references : [];

    return {
      loanDetails: {
        loanAmountInr:
          typeof loanDetails.loanAmountInr === "number"
            ? loanDetails.loanAmountInr
            : defaults.loanDetails.loanAmountInr,
        tenureMonths:
          typeof loanDetails.tenureMonths === "number"
            ? loanDetails.tenureMonths
            : defaults.loanDetails.tenureMonths,
        employmentType:
          loanDetails.employmentType === "salaried" ||
          loanDetails.employmentType === "self_employed"
            ? loanDetails.employmentType
            : defaults.loanDetails.employmentType,
      },
      includeCoApplicant:
        typeof parsed.includeCoApplicant === "boolean" ? parsed.includeCoApplicant : null,
      personal: parsePersonal(personal),
      address: parseAddressBlock(address),
      documents: isLoanApplicationDocumentsState(parsed.documents)
        ? parsed.documents
        : createEmptyLoanApplicationDocuments(),
      references: [
        isReference(refs[0]) ? normalizeReference(refs[0]) : emptyReference(),
        isReference(refs[1]) ? normalizeReference(refs[1]) : emptyReference(),
      ],
      coApplicant: parseApplicantProfile(parsed.coApplicant),
    };
  } catch {
    return null;
  }
}

export function readLoanApplicationState(): LoanApplicationState {
  if (typeof window === "undefined") return createDefaultLoanApplicationState();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultLoanApplicationState();
    return parseState(raw) ?? createDefaultLoanApplicationState();
  } catch {
    return createDefaultLoanApplicationState();
  }
}

export function writeLoanApplicationState(state: LoanApplicationState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/** Clears wizard session — use when starting a new application from finance action. */
export function resetLoanApplicationState(): LoanApplicationState {
  const next = createDefaultLoanApplicationState();
  writeLoanApplicationState(next);
  return next;
}

export function getApplicantProfile(
  state: LoanApplicationState,
  applicant: LoanApplicationApplicant,
): LoanApplicationApplicantProfile {
  if (applicant === "co") {
    return state.coApplicant ?? emptyApplicantProfile();
  }
  return {
    personal: state.personal,
    address: state.address,
    documents: state.documents,
    references: state.references,
  };
}

function mergeApplicantProfile(
  current: LoanApplicationApplicantProfile,
  patch: Partial<LoanApplicationApplicantProfile> | undefined,
): LoanApplicationApplicantProfile {
  if (!patch) return current;
  return {
    personal: {
      ...current.personal,
      ...patch.personal,
      work: {
        ...current.personal.work,
        ...patch.personal?.work,
        officialAddress: {
          ...current.personal.work.officialAddress,
          ...patch.personal?.work?.officialAddress,
        },
      },
    },
    address: {
      ...current.address,
      ...patch.address,
      permanent: { ...current.address.permanent, ...patch.address?.permanent },
      current: { ...current.address.current, ...patch.address?.current },
    },
    documents: patch.documents ?? current.documents,
    references: patch.references ?? current.references,
  };
}

export function patchLoanApplicationState(
  patch: Partial<LoanApplicationState>,
): LoanApplicationState {
  const current = readLoanApplicationState();
  const next: LoanApplicationState = {
    ...current,
    ...patch,
    loanDetails: { ...current.loanDetails, ...patch.loanDetails },
    includeCoApplicant:
      patch.includeCoApplicant !== undefined
        ? patch.includeCoApplicant
        : current.includeCoApplicant,
    personal: {
      ...current.personal,
      ...patch.personal,
      work: {
        ...current.personal.work,
        ...patch.personal?.work,
        officialAddress: {
          ...current.personal.work.officialAddress,
          ...patch.personal?.work?.officialAddress,
        },
      },
    },
    address: {
      ...current.address,
      ...patch.address,
      permanent: { ...current.address.permanent, ...patch.address?.permanent },
      current: { ...current.address.current, ...patch.address?.current },
    },
    references: patch.references ?? current.references,
    documents: patch.documents ?? current.documents,
    coApplicant:
      patch.coApplicant === null
        ? null
        : patch.coApplicant
          ? mergeApplicantProfile(
              current.coApplicant ?? emptyApplicantProfile(),
              patch.coApplicant,
            )
          : current.coApplicant,
  };
  writeLoanApplicationState(next);
  return next;
}

/** Patch primary top-level fields or the co-applicant nested profile. */
export function patchApplicantProfile(
  applicant: LoanApplicationApplicant,
  patch: Partial<LoanApplicationApplicantProfile>,
): LoanApplicationState {
  if (applicant === "co") {
    return patchLoanApplicationState({
      coApplicant: mergeApplicantProfile(
        readLoanApplicationState().coApplicant ?? emptyApplicantProfile(),
        patch,
      ),
    });
  }
  return patchLoanApplicationState({
    personal: patch.personal,
    address: patch.address,
    documents: patch.documents,
    references: patch.references,
  });
}
