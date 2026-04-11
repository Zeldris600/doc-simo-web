import { Sprout, FlaskConical, Package, HeartPulse } from "@/lib/icons";

const STEPS = [
  {
    icon: Sprout,
    step: "01",
    title: "Ethically sourced",
    description:
      "We partner with certified organic farms in tropical regions to harvest the freshest papaya and rare botanicals at peak potency.",
  },
  {
    icon: FlaskConical,
    step: "02",
    title: "Clinically extracted",
    description:
      "Our specialist team uses cold-press and supercritical CO2 extraction to preserve maximum bioavailability and cellular integrity.",
  },
  {
    icon: Package,
    step: "03",
    title: "Lab tested & sealed",
    description:
      "Each batch undergoes 200+ third-party lab tests before being sealed in eco-friendly, light-protected packaging.",
  },
  {
    icon: HeartPulse,
    step: "04",
    title: "Delivered with care",
    description:
      "Carbon-neutral shipping ensures your clinical-grade formulation arrives fresh, potent, and ready to support your wellness journey.",
  },
];

export function ProcessSection() {
  return (
    <section className="px-6 py-20 lg:px-12 bg-gray-50/60">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs font-bold text-[#f2c94c] tracking-tight">
            Our process
          </p>
          <h2 className="text-lg md:text-xl font-bold text-black tracking-tight">
            From soil to supplement
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto font-medium">
            Every Doctasimo product follows a meticulous 4-step journey to
            ensure you receive nothing but the purest clinical-grade
            formulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, index) => (
            <div key={step.step} className="relative group">
              {/* Connector line - hidden on last item and on mobile */}
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gray-200" />
              )}

              <div className="flex flex-col items-center text-center space-y-5 p-6 rounded-lg bg-white border border-gray-100 hover:border-primary/20 transition-all">
                <div className="relative">
                  <div className="p-4 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#f2c94c] text-[10px] font-bold text-black flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-black">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
