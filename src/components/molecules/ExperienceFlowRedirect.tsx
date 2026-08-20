"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { isModifyNoChargesFlow } from "@/helpers/experience-flow";

type ExperienceFlowRedirectProps = {
  modifyHref: string;
  defaultHref: string;
};

/**
 * Client replace that branches on the modify-no-charges demo flow.
 */
export function ExperienceFlowRedirect({
  modifyHref,
  defaultHref,
}: ExperienceFlowRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(isModifyNoChargesFlow() ? modifyHref : defaultHref);
  }, [defaultHref, modifyHref, router]);

  return null;
}
