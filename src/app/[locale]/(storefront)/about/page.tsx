import { useTranslations } from "next-intl";
import Image from "next/image";
import { ShieldCheck, Leaf, TestTube } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700 pt-24 md:pt-32">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="flex-1 space-y-10">
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-black tracking-tight leading-none uppercase">
                {t("title")}
              </h1>
              <p className="text-sm md:text-base text-black/60 font-medium max-w-lg leading-relaxed">
                {t("subtitle")}
              </p>
            </div>

            <div className="bg-black/[0.02] p-8 md:p-10 rounded-[32px] border border-black/5 space-y-4 shadow-none">
              <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">{t("mission")}</h2>
              <p className="text-sm md:text-base font-medium text-black/70 leading-relaxed text-justify md:text-left">
                {t("missionDesc")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-black text-lg mb-1">{t("quality")}</h3>
                  <p className="text-sm text-black/40 font-medium">
                    {t("qualityDesc")}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Leaf className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-black text-lg mb-1">{t("purity")}</h3>
                  <p className="text-sm text-black/40 font-medium">
                    {t("purityDesc")}
                  </p>
                </div>
              </div>
              <div className="space-y-4 sm:col-span-2">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <TestTube className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-black text-lg mb-1">{t("innovation")}</h3>
                  <p className="text-sm text-black/40 font-medium max-w-md">
                    {t("innovationDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden relative shadow-2xl shadow-black/10 border border-black/5">
              <Image
                src="/doctor.png"
                alt="Middle-aged African doctor specializing in traditional formulations"
                fill
                className="object-cover hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 pt-32">
                <div className="flex flex-col gap-3">
                  <div className="bg-primary/20 backdrop-blur-md w-fit text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl">
                    Clinical Expert
                  </div>
                  <div className="text-white/90 font-medium text-base">
                    Advancing Traditional Botanical Medicine
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute -z-10 -inset-6 bg-primary/5 rounded-[48px] rotate-3 transition-transform hover:rotate-6 duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
