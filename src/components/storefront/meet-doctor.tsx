import Image from "next/image";

export function MeetDoctor() {
  return (
    <section className="px-6 py-24 lg:px-12 bg-white container max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 space-y-10 order-2 lg:order-1">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase text-[#f2c94c] bg-[#f2c94c]/5 inline-block px-4 py-2 rounded">
              The Visionary
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
                <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">
                  Patients Helped
                </p>
              </div>
              <div>
                <p className="text-4xl font-black text-black">100%</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">
                  Natural Basis
                </p>
              </div>
            </div>
          </div>
          <button className="bg-primary text-white px-10 py-5 rounded-full text-xs font-bold uppercase shadow-lg shadow-primary/20 hover:scale-105 transition-all w-fit">
            Discover Our Roots
          </button>
        </div>
        <div className="flex-1 relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none rounded-xl overflow-hidden order-1 lg:order-2">
          <Image
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2000&auto=format&fit=crop"
            alt="Dr. Simeon - Specialist"
            fill
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
