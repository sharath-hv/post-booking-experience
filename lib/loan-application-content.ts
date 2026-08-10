/** Main milestones shown in the horizontal rail (4 steps). */
export const LOAN_APPLICATION_MILESTONES = [
  { id: "loan_details", label: "Loan details" },
  { id: "personal", label: "Personal details" },
  { id: "documents", label: "Documents" },
  { id: "references", label: "Reference" },
] as const;

export type LoanApplicationMilestoneId = (typeof LOAN_APPLICATION_MILESTONES)[number]["id"];

/** Routable screens within the wizard (personal has 2 substeps). */
export const LOAN_APPLICATION_ROUTES = [
  "loan-details",
  "personal",
  "address",
  "documents",
  "references",
] as const;

export type LoanApplicationRoute = (typeof LOAN_APPLICATION_ROUTES)[number];

/** Which person's details the person-shaped steps are collecting. */
export const LOAN_APPLICATION_APPLICANTS = ["primary", "co"] as const;

export type LoanApplicationApplicant = (typeof LOAN_APPLICATION_APPLICANTS)[number];

export function isLoanApplicationRoute(value: string): value is LoanApplicationRoute {
  return (LOAN_APPLICATION_ROUTES as readonly string[]).includes(value);
}

export function isLoanApplicationApplicant(value: string): value is LoanApplicationApplicant {
  return (LOAN_APPLICATION_APPLICANTS as readonly string[]).includes(value);
}

/** Person-shaped steps show the You / Co-applicant eyebrow when dual-pass is on. */
export function isLoanApplicationPersonRoute(route: LoanApplicationRoute): boolean {
  return (
    route === "personal" ||
    route === "address" ||
    route === "documents" ||
    route === "references"
  );
}

export function routeToMilestone(route: LoanApplicationRoute): LoanApplicationMilestoneId {
  if (route === "loan-details") return "loan_details";
  if (route === "personal" || route === "address") return "personal";
  if (route === "documents") return "documents";
  return "references";
}

export const LOAN_APPLICATION_TENURE_OPTIONS = [12, 24, 36, 48, 60, 72, 84] as const;

export type LoanApplicationEmploymentType = "salaried" | "self_employed";

export const LOAN_APPLICATION_EMPLOYMENT_OPTIONS: {
  id: LoanApplicationEmploymentType;
  label: string;
}[] = [
  { id: "salaried", label: "Salaried" },
  { id: "self_employed", label: "Self employed" },
];

/** How the co-applicant is related to the primary applicant. */
export const LOAN_APPLICATION_CO_APPLICANT_RELATIONS = [
  "spouse",
  "parent",
  "sibling",
  "child",
  "friend",
  "other",
] as const;

export type LoanApplicationCoApplicantRelation =
  (typeof LOAN_APPLICATION_CO_APPLICANT_RELATIONS)[number];

export function isLoanApplicationCoApplicantRelation(
  value: string,
): value is LoanApplicationCoApplicantRelation {
  return (LOAN_APPLICATION_CO_APPLICANT_RELATIONS as readonly string[]).includes(value);
}

export const LOAN_APPLICATION_CO_APPLICANT_RELATION_OPTIONS: {
  id: LoanApplicationCoApplicantRelation;
  label: string;
}[] = [
  { id: "spouse", label: "Spouse" },
  { id: "parent", label: "Parent" },
  { id: "sibling", label: "Sibling" },
  { id: "child", label: "Child" },
  { id: "friend", label: "Friend" },
  { id: "other", label: "Other" },
];

export function loanApplicationApplicantEyebrowLabel(
  applicant: LoanApplicationApplicant,
): string {
  return applicant === "co" ? "Co\u2011applicant" : "You · Primary applicant";
}
