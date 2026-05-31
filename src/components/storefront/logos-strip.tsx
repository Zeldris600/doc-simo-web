// African herbal traditions strip — no certifications
const TRADITIONS = [
  {
    emoji: "🌿",
    label: "Cameroonian Botanicals",
    sub: "Neem · Moringa · Bitter leaf",
  },
  {
    emoji: "🌺",
    label: "West African Roots",
    sub: "Turmeric · Ginger · Garlic",
  },
  { emoji: "🍃", label: "Central Forest Herbs", sub: "Papaya · Aloe · Shea" },
  {
    emoji: "🌾",
    label: "Savanna Medicinals",
    sub: "Baobab · Hibiscus · Soursop",
  },
  {
    emoji: "🫚",
    label: "Sacred Plant Oils",
    sub: "Neem oil · Moringa oil · Coconut",
  },
];

export function LogosStrip() {
  return (
    <section className="bg-white border-y border-[#f2c94c]/10 py-12 px-4 sm:px-6 lg:px-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Heading */}
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/50">
          Rooted in African Botanical Traditions
        </p>

        {/* Traditions row */}
        <div className="flex flex-wrap items-start justify-center gap-4 md:gap-6">
          {TRADITIONS.map(({ emoji, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 px-6 py-6 rounded-[32px] bg-[#f5faf6] hover:bg-[#eaf2e8] transition-all duration-300 min-w-[140px] text-center border border-black/[0.03] hover:-translate-y-1"
            >
              <span className="text-4xl mb-2">{emoji}</span>
              <p className="text-xs font-semibold text-primary leading-tight">
                {label}
              </p>
              <p className="text-[10px] text-foreground/40 font-bold leading-snug mt-1">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
