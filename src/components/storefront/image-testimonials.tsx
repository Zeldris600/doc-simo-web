import { Star } from "@/lib/icons";

const IMAGE_TESTIMONIALS = [
  {
    id: 1,
    content:
      "My skin has never looked this radiant. The papaya enzyme is a miracle worker!",
    author: "Grace Abanda",
    role: "Clinical Nutritionist, Limbe",
    rating: 5,
  },
  {
    id: 2,
    content:
      "25 years of practice and this is the best herbal brand I've recommended.",
    author: "Dr. Samuel Tchuente",
    role: "Holistic Practitioner, Bamenda",
    rating: 5,
  },
  {
    id: 3,
    content:
      "I start every morning with their Ashwagandha. Completely changed my energy levels.",
    author: "Esther Kamga",
    role: "Wellness Coach, Garoua",
    rating: 5,
  },
  {
    id: 4,
    content:
      "The sleep bundle is incredible. Best rest I've had in years.",
    author: "James Ebobisse",
    role: "Retired Athlete, Kribi",
    rating: 5,
  },
];

export function ImageTestimonials() {
  return (
    <section className="py-20 px-6 lg:px-12 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <p className="text-xs font-bold text-[#f2c94c] tracking-tight">
            Real people, real results
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
            What our customers say
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto font-medium">
            Voices from across Cameroon who trust Doctasimo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {IMAGE_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-xl border border-gray-100 bg-gray-50/50 p-5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-[#f2c94c] text-[#f2c94c]"
                  />
                ))}
              </div>

              <p className="text-xs text-gray-700 font-medium leading-relaxed flex-1 mb-4">
                &quot;{t.content}&quot;
              </p>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-bold text-black">{t.author}</p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
