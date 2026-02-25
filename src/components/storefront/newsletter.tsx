"use client";

import { useSearchParams } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";

export function Newsletter() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as "en" | "fr") || "en";
  const dict = getDictionary(lang);

  return (
    <section className="mx-6 lg:mx-12 bg-white px-6 py-24 sm:py-32">
      <div className="container max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase text-[#f2c94c] tracking-tight">
            Community
          </p>
          <h2 className="text-4xl font-black tracking-tight text-black sm:text-7xl leading-tight">
            {dict.newsletter.title.split(" ").map((word, i) =>
              word === "20%" || word === "Off" ? (
                <span
                  key={i}
                  className="text-primary underline decoration-primary/20"
                >
                  {word}{" "}
                </span>
              ) : (
                word + " "
              ),
            )}
          </h2>
        </div>
        <p className="text-lg leading-8 text-gray-500 font-medium max-w-xl mx-auto">
          {dict.newsletter.subtitle}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto p-2 bg-gray-50 rounded-full sm:rounded-full rounded-2xl">
          <input
            type="text"
            placeholder={dict.newsletter.placeholderName}
            className="flex-1 px-8 py-4 text-sm font-bold text-black bg-transparent border-none focus:ring-0 outline-none placeholder:text-gray-400"
          />
          <input
            type="tel"
            placeholder={dict.newsletter.placeholderPhone}
            className="flex-1 px-8 py-4 text-sm font-bold text-black bg-transparent border-none focus:ring-0 outline-none placeholder:text-gray-400 border-t sm:border-t-0 sm:border-l border-gray-200"
          />
          <button className="bg-primary px-10 py-4 rounded-full sm:rounded-full rounded-xl text-xs font-bold uppercase text-white hover:bg-black transition-all">
            {dict.newsletter.button}
          </button>
        </div>
      </div>
    </section>
  );
}
