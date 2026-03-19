import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function MeetDoctor() {
  return (
    <section className="px-6 py-24 lg:px-12 bg-white container max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 space-y-10 order-2 lg:order-1">
          <div className="space-y-4">
            <p className="text-xs font-bold text-[#f2c94c] bg-[#f2c94c]/5 inline-block px-4 py-2 rounded">
              The visionary
            </p>
            <h2 className="text-4xl font-black text-black sm:text-6xl leading-[1.1] tracking-tight">
              Meet Dr. Simeon
            </h2>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-[#f2c94c]/20 pl-6 py-2">
            &quot;Nature is the ultimate clinic. My mission with Doctasime is to
            validate ancient botanical wisdom with modern clinical
            rigorousness.&quot;
          </p>
          <div className="space-y-6 text-gray-500 font-medium">
            <p className="leading-relaxed">
              With over 25 years in botanical research and internal medicine,
              Dr. Simeon founded Doctasime to create the gold standard in herbal
              extractions.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-black">25k+</p>
                <p className="text-[10px] font-bold text-gray-400 mt-1">
                  Patients helped
                </p>
              </div>
              <div>
                <p className="text-4xl font-black text-black">100%</p>
                <p className="text-[10px] font-bold text-gray-400 mt-1">
                  Natural basis
                </p>
              </div>
            </div>
          </div>
          <button className="inline-flex items-center text-xs font-black tracking-widest text-primary hover:opacity-70 transition-all group uppercase">
            Discover our roots <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="flex-1 relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none rounded-xl overflow-hidden order-1 lg:order-2">
          <Image
            src="/dr-simeon.png"
            alt="Dr. Simeon - Specialist"
            fill
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
