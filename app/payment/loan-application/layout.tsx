"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { LoanApplicationShell } from "@/components/payment/loan-application/LoanApplicationShell";
import { isLoanApplicationRoute } from "@/lib/loan-application-content";

export default function LoanApplicationLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "";
  const currentRoute = isLoanApplicationRoute(lastSegment) ? lastSegment : null;

  if (currentRoute == null) return <>{children}</>;

  return (
    <Suspense fallback={null}>
      <LoanApplicationShell currentRoute={currentRoute}>{children}</LoanApplicationShell>
    </Suspense>
  );
}
