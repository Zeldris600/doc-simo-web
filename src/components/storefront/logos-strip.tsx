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

const SOURCED_REGIONS = [
  "Cameroon Highlands",
  "Congo Basin",
  "Sahel Savanna",
  "West African Coast",
  "Great Rift Valley",
];

export function LogosStrip() {
  return (
    <section className="bg-white border-y border-[#f2c94c]/15 py-10 px-4 sm:px-6 lg:px-12 overflow-hidden">
      <div className="container max-w-7xl mx-auto space-y-8">
        {/* Heading */}
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-foreground/30">
          Rooted in African Botanical Traditions
        </p>

        {/* Traditions row */}
        <div className="flex flex-wrap items-start justify-center gap-4 md:gap-6">
          {TRADITIONS.map(({ emoji, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 px-5 py-4 rounded-2xl bg-[#f5faf6] hover:bg-[#eaf2e8] transition-colors min-w-[110px] text-center"
            >
              <span className="text-3xl">{emoji}</span>
              <p className="text-xs font-black text-primary leading-tight mt-1">
                {label}
              </p>
              <p className="text-[10px] text-foreground/40 font-medium">
                {sub}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-black/5" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/25 whitespace-nowrap">
            Wild-harvested from
          </p>
          <div className="flex-1 h-px bg-black/5" />
        </div>

        {/* Source regions */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {SOURCED_REGIONS.map((region) => (
            <span
              key={region}
              className="text-sm font-black text-foreground/20 hover:text-primary/50 transition-colors cursor-default select-none tracking-tight"
            >
              {region}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
