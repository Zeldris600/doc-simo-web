import Image from "next/image";
import { ArrowRight } from "@/lib/icons";

export function AboutSection() {
  return (
    <section className="px-6 py-24 lg:px-12 bg-white container max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 relative aspect-[1/1] w-full rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
          <Image
            src="/about_doctasimo_lab.png"
            alt="Doctasimo Research Lab"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase text-[#f2c94c] tracking-tight">
              Our Standard
            </p>
            <h2 className="text-4xl font-black text-black sm:text-5xl leading-tight tracking-tight">
              About Doctasimo
            </h2>
          </div>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            At Doctasimo, we believe in the healing power of nature. We
            carefully select the purest herbs and extracts from around the world
            to craft remedies that support your journey toward holistic
            wellness.
          </p>
          <p className="text-base text-gray-500 leading-relaxed font-medium">
            Our mission is to bridge the gap between ancient herbal traditions
            and modern clinical standards. Every product we make is rigorously
            tested, fully organic, and designed with your health in mind.
          </p>
          <button className="inline-flex items-center text-xs font-black tracking-widest text-primary hover:opacity-70 transition-all group uppercase">
            Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
