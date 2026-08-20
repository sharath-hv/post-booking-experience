"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type ReactNode,
  type SetStateAction,
} from "react";

import { ConciergeDocumentsCard } from "@/components/organisms/ConciergeDocumentsCard";
import { ConciergeTurnShell } from "@/components/organisms/ConciergeTurnShell";
import { VERIFY_IDENTITY_WORDS } from "@/lib/concierge/script";
import { JOURNEY_PATHS } from "@/helpers/journey-routes";
import {
  createEmptyKycUploads,
  readKycUploadState,
  writeKycUploadState,
  type KycUploadsState,
} from "@/helpers/kyc-upload-state";

type IdentityCollectContextValue = {
  uploads: KycUploadsState;
  setUploads: Dispatch<SetStateAction<KycUploadsState>>;
  mockUploadCounterRef: MutableRefObject<number>;
  replies: {
    label: string;
    href: string;
    echo?: string;
    disabled: boolean;
  }[];
};

const IdentityCollectContext = createContext<IdentityCollectContextValue | null>(null);

function useIdentityCollect() {
  const value = useContext(IdentityCollectContext);
  if (value == null) {
    throw new Error("Identity collect sections must render inside IdentityCollectProvider");
  }
  return value;
}

export function IdentityCollectProvider({ children }: { children: ReactNode }) {
  const mockUploadCounterRef = useRef(0);
  const hasHydratedUploadsRef = useRef(false);
  const [uploads, setUploads] = useState<KycUploadsState>(createEmptyKycUploads);

  useEffect(() => {
    const stored = readKycUploadState();
    if (stored) {
      setUploads(stored.uploads);
      mockUploadCounterRef.current = stored.mockUploadCounter;
    }
    hasHydratedUploadsRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedUploadsRef.current) return;
    writeKycUploadState({
      uploads,
      mockUploadCounter: mockUploadCounterRef.current,
    });
  }, [uploads]);

  const canSubmit = uploads.aadhaar.length > 0 && uploads.pan.length > 0;

  const replies = useMemo(
    () => [
      {
        label: VERIFY_IDENTITY_WORDS.replyLabel ?? "Here are my documents",
        href: JOURNEY_PATHS.identity.documentsReceived,
        echo: VERIFY_IDENTITY_WORDS.replyEcho,
        disabled: !canSubmit,
      },
    ],
    [canSubmit],
  );

  const value = useMemo(
    () => ({ uploads, setUploads, mockUploadCounterRef, replies }),
    [uploads, replies],
  );

  return (
    <IdentityCollectContext.Provider value={value}>
      {children}
    </IdentityCollectContext.Provider>
  );
}

/** Conversation chrome for the identity collect turn. */
export function IdentityTurnSection({ children }: { children: ReactNode }) {
  const { replies } = useIdentityCollect();
  return (
    <ConciergeTurnShell
      dayStamp={VERIFY_IDENTITY_WORDS.dayStamp}
      says={VERIFY_IDENTITY_WORDS.says}
      footnote={VERIFY_IDENTITY_WORDS.footnote}
      callLabel={VERIFY_IDENTITY_WORDS.callLabel}
      replies={replies}
      artifact={children}
    />
  );
}

/** PAN + Aadhaar upload cards. */
export function IdentityDocumentsSection() {
  const { uploads, setUploads, mockUploadCounterRef } = useIdentityCollect();
  return (
    <ConciergeDocumentsCard
      uploads={uploads}
      onUploadsChange={setUploads}
      mockUploadCounterRef={mockUploadCounterRef}
      variant="glass"
    />
  );
}

export function ConciergeVerifyIdentityScreen() {
  return (
    <IdentityCollectProvider>
      <IdentityTurnSection>
        <IdentityDocumentsSection />
      </IdentityTurnSection>
    </IdentityCollectProvider>
  );
}
