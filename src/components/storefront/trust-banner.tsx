import { Award, Users, Beaker, Globe } from "lucide-react";

const STATS = [
  {
    icon: Users,
    value: "1,200+",
    label: "Patients Treated",
    description: "In Cameroon since our founding",
  },
  {
    icon: Beaker,
    value: "18",
    label: "Herbal Formulas",
    description: "Developed at our Douala clinic",
  },
  {
    icon: Award,
    value: "12 yrs",
    label: "In Practice",
    description: "Dr. Simo's clinical experience",
  },
  {
    icon: Globe,
    value: "8",
    label: "Towns Served",
    description: "Delivering across Cameroon",
  },
];

export function TrustBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-primary py-20 px-6 lg:px-12">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14 space-y-3">
            <p className="text-xs font-bold text-[#f2c94c] tracking-tight">
              Why trust Doctasimo
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Numbers that speak for themselves
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center space-y-3 p-6"
              >
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <stat.icon className="w-6 h-6 text-[#f2c94c]" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white/90">
                    {stat.label}
                  </p>
                  <p className="text-xs text-white/50 font-medium">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
