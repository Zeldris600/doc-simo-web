import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const SECTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

type LegalDocumentProps =
  | {
      namespace: "terms";
      relatedHref: "/privacy";
      relatedLabelKey: "seeAlsoPrivacy";
    }
  | {
      namespace: "privacy";
      relatedHref: "/terms";
      relatedLabelKey: "seeAlsoTerms";
    };

export function LegalDocument({
  namespace,
  relatedHref,
  relatedLabelKey,
}: LegalDocumentProps) {
  const t = useTranslations(namespace);

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700 pt-24 md:pt-32">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <header className="space-y-4 mb-12 md:mb-16 pb-10 border-b border-black/10">
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight leading-tight">
            {t("title")}
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-black/40">
            {t("lastUpdated")}
          </p>
          <p className="text-sm md:text-base text-black/65 font-medium leading-relaxed">
            {t("intro")}
          </p>
        </header>

        <div className="space-y-10 md:space-y-12">
          {SECTIONS.map((n) => (
            <section key={n} className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-black tracking-tight">
                {t(`s${n}Title`)}
              </h2>
              <p className="text-sm md:text-base text-black/70 font-medium leading-relaxed whitespace-pre-line">
                {t(`s${n}Body`)}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-14 pt-10 border-t border-black/10 text-sm text-black/55 font-medium">
          <Link
            href={relatedHref}
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            {t(relatedLabelKey)}
          </Link>
        </p>
      </div>
    </div>
  );
}
