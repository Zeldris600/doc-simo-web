import { AlertTriangle } from "@/lib/icons";

export function HealthDisclaimer() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
        <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
          Health Disclaimer
        </p>
      </div>
      <p className="text-xs text-amber-700 font-medium leading-relaxed">
        Doctasimo products are traditional herbal &amp; antiviral formulations
        rooted in African botanical medicine. They are{" "}
        <strong>not intended to diagnose, treat, cure, or replace</strong> any
        prescribed medical treatment. Always consult your licensed healthcare
        provider before use, especially if you are pregnant, nursing, or on
        prescription medication. Results may vary.
      </p>
    </div>
  );
}
