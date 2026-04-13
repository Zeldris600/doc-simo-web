export interface DeliveryTimelineEntry {
  title: string;
  duration: string;
  colorClass: string;
  locations: string;
}

export const DELIVERY_TIMELINES: DeliveryTimelineEntry[] = [
  {
    title: "Inbound — Within Cameroon",
    duration: "2–4 business days",
    colorClass: "text-emerald-700",
    locations: "Yaoundé, Douala, Bafoussam, Bamenda, Garoua, Ngaoundéré, Bertoua",
  },
  {
    title: "Outbound — West & Central Africa",
    duration: "5–8 business days",
    colorClass: "text-amber-700",
    locations:
      "Nigeria, Gabon, Congo, Côte d'Ivoire, Senegal, Ghana, Burkina Faso",
  },
  {
    title: "International — Worldwide",
    duration: "7–14 business days",
    colorClass: "text-black/50",
    locations:
      "Europe, USA, Canada, UK, Asia & more — subject to customs clearance",
  },
];

export const DELIVERY_CITIES = [
  "Yaoundé",
  "Douala",
  "Bafoussam",
  "Bamenda",
  "Garoua",
  "Ngaoundéré",
  "Bertoua",
  "Kribi",
  "Limbe",
  "Maroua",
  "Lagos",
  "Abidjan",
  "Dakar",
  "Libreville",
  "Brazzaville",
  "Paris",
  "London",
  "New York",
  "Montréal",
];
