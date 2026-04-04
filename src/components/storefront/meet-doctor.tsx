import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  PhoneCall,
  GraduationCap,
  Stethoscope,
  FlaskConical,
} from "lucide-react";

const CREDENTIALS = [
  { icon: GraduationCap, text: "MD, Internal Medicine — University of Paris" },
  { icon: Stethoscope, text: "25+ years Botanical & Antiviral Research" },
  { icon: FlaskConical, text: "Founder, Doctasimo Clinical Institute" },
];

export function MeetDoctor() {
  return (
    <section className="px-4 sm:px-6 py-24 lg:px-12 bg-white relative w-full overflow-hidden">
      <div className="container max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        {/* Doctor image — left on desktop */}
        <div className="flex-1 relative aspect-[3/4] w-full max-w-sm mx-auto lg:max-w-none rounded-[2.5rem] overflow-hidden ring-1 ring-black/5 shadow-xl shadow-black/5 order-1">
          <Image
            src="/doctor.png"
            alt="Dr. Simo – Doctasimo Founder & Chief Medical Officer"
            fill
            className="object-cover object-top hover:scale-105 transition-transform duration-1000"
          />
          {/* Name plate */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-lg rounded-2xl px-5 py-4 shadow-lg">
            <p className="font-black text-primary text-base leading-tight">
              Dr. Simo
            </p>
            <p className="text-xs text-foreground/50 font-medium mt-0.5">
              Founder & Chief Medical Officer
            </p>
          </div>
        </div>

        {/* Content — right on desktop */}
        <div className="flex-1 space-y-8 order-2 text-center lg:text-left">
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
              The Visionary Behind Doctasimo
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-primary leading-tight tracking-tight">
              Meet Dr. Simo
            </h2>
          </div>

          <blockquote className="text-sm md:text-base text-foreground/70 font-medium leading-relaxed border-l-4 border-[#f2c94c]/50 pl-5 text-left bg-[#f5faf6] py-3 pr-4 rounded-r-xl">
            &quot;Nature is the ultimate clinic. My mission with Doctasimo is to
            validate ancient botanical wisdom with modern clinical rigorousness
            — so every patient gets results that last.&quot;
          </blockquote>

          {/* Credentials */}
          <div className="space-y-3">
            {CREDENTIALS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-left">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-foreground/70 font-medium">{text}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            {[
              { value: "3,500+", label: "Patients Helped" },
              { value: "15+", label: "Proprietary Formulations" },
              { value: "98%", label: "Patient Satisfaction" },
              { value: "25 yrs", label: "Research Experience" },
            ].map((s) => (
              <div key={s.label} className="bg-[#f5faf6] rounded-2xl px-4 py-4">
                <p className="text-2xl font-black text-primary">{s.value}</p>
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-wider mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-[#142c1b] transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              Book a Consultation
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-black text-primary hover:opacity-70 transition-all group"
            >
              Read Dr. Simo&apos;s Story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
