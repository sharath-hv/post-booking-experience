import {
  IdentityCollectProvider,
  IdentityDocumentsSection,
  IdentityTurnSection,
} from "@/components/organisms/concierge/ConciergeVerifyIdentityScreen";

/**
 * Identity turn — Shivi asks for PAN + Aadhaar and collects them inline.
 * (Shivi is introduced on arrival at `/booking/received`.)
 * Verification outcomes stay under `/kyc/verification-*`.
 */
export default function IdentityPage() {
  return (
    <IdentityCollectProvider>
      <IdentityTurnSection>
        <IdentityDocumentsSection />
      </IdentityTurnSection>
    </IdentityCollectProvider>
  );
}
