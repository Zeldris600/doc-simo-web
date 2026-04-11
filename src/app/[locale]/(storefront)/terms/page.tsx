import { LegalDocument } from "@/components/legal/legal-document";

export default function TermsPage() {
  return (
    <LegalDocument
      namespace="terms"
      relatedHref="/privacy"
      relatedLabelKey="seeAlsoPrivacy"
    />
  );
}
