import {
  Leaf,
  HeartPulse,
  MapPin,
  Stethoscope,
  PackageCheck,
  FlaskConical,
} from "@/lib/icons";

const FEATURES = [
  {
    icon: Leaf,
    emoji: "🌿",
    title: "Cameroonian Botanicals",
    description:
      "Wild-harvested from Mount Cameroon's rainforests, the Bamileke highlands, and the Congo basin — plants our grandmothers trusted for generations.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    icon: FlaskConical,
    emoji: "🧪",
    title: "Ancestral Formulas",
    description:
      "Recipes passed down through Beti, Bamileke, and Fulbe healing traditions, refined by Dr. Simo's clinic into precise, effective preparations.",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  {
    icon: HeartPulse,
    emoji: "⚕️",
    title: "Clinically Guided",
    description:
      "Every product is developed and reviewed by Dr. Simo's medical team at our Douala clinic — grounded in both tradition and modern clinical practice.",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
  },
  {
    icon: Stethoscope,
    emoji: "🏥",
    title: "Clinic Consultation",
    description:
      "Book a one-on-one session with our specialists in Douala. We assess your condition and build a personalised herbal treatment plan.",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
  },
  {
    icon: PackageCheck,
    emoji: "📦",
    title: "Authentic & Pure",
    description:
      "No fillers, no synthetic additives. What you receive is exactly what nature provided — carefully prepared, freshly packed, and properly sealed.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  {
    icon: MapPin,
    emoji: "🚚",
    title: "Delivered Across Cameroon",
    description:
      "We deliver to all 10 regions — Yaoundé, Douala, Bafoussam, Bamenda, Garoua, Bertoua and beyond. International shipping also available.",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
  },
];

export function Features() {
  return (
    <section className="px-4 sm:px-6 lg:px-12 py-20 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
            🇨🇲 Proudly Cameroonian
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
            Healing Rooted in Our Land
          </h2>
          <p className="text-sm text-foreground/50 font-medium max-w-lg mx-auto leading-relaxed">
            From Cameroon&apos;s forests and highlands — plants our ancestors
            used, prepared with the precision of modern medicine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group flex flex-col gap-4 p-7 rounded-3xl border border-black/5 bg-[#f9fbf9] hover:bg-white hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon + emoji combo */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl ${f.iconBg} flex items-center justify-center shrink-0`}
                >
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <span className="text-2xl">{f.emoji}</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-primary tracking-tight">
                  {f.title}
                </h3>
                <p className="text-xs text-foreground/55 leading-relaxed font-medium">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
