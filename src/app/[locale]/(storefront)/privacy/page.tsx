import { LegalDocument } from "@/components/legal/legal-document";

export default function PrivacyPage() {
  return (
    <LegalDocument
      namespace="privacy"
      relatedHref="/terms"
      relatedLabelKey="seeAlsoTerms"
    />
  );
}
