import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function MeetDoctor() {
  return (
    <section className="px-6 py-24 lg:px-12 bg-transparent relative w-full overflow-hidden">
      {/* Soft clinical background layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/forest-bg.jpg"
          alt="Natural laboratory background"
          fill
          className="object-cover opacity-[0.05] scale-110"
        />
        {/* Soft elegant gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/95 to-secondary/30" />
      </div>

      <div className="container max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
        <div className="flex-1 space-y-10 order-2 lg:order-1">
          <div className="space-y-4">
            <p className="text-xs font-bold text-primary bg-primary/10 inline-block px-4 py-2 rounded-full border border-primary/20 mb-2">
              The visionary
            </p>
            <h2 className="text-4xl font-black text-primary sm:text-5xl leading-[1.05] tracking-tight">
              Meet Dr. Simo
            </h2>
          </div>
          <p className="text-xl text-foreground/80 py-2">
            &quot;Nature is the ultimate clinic. My mission with Doctasimo is to
            validate ancient botanical wisdom with modern clinical
            rigorousness.&quot;
          </p>
          <div className="space-y-6 text-foreground/70 font-medium">
            <p className="leading-relaxed">
              With over 25 years in botanical research and internal medicine,
              Dr. Simo founded Doctasimo to create the gold standard in herbal
              extractions.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-primary">3,500+</p>
                <p className="text-[10px] font-bold text-primary/50 mt-1 uppercase tracking-wider">
                  Patients helped
                </p>
              </div>
              <div>
                <p className="text-4xl font-black text-primary">15+</p>
                <p className="text-[10px] font-bold text-primary/50 mt-1 uppercase tracking-wider">
                  Proprietary Formulations
                </p>
              </div>
            </div>
          </div>
          <button className="inline-flex items-center text-xs font-black tracking-widest text-primary hover:opacity-70 transition-all group uppercase">
            Discover our roots{" "}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Glassmorphism Container applied here */}
        <div className="flex-1 relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none rounded-3xl overflow-hidden order-1 lg:order-2 backdrop-blur-3xl bg-white/40 ring-1 ring-white/60 p-2">
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/doctor.png"
              alt="Dr. Simo - Specialist"
              fill
              className="object-cover object-top hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
