"use client";

import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Send } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call for sending message
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent successfully!", {
        description: "Our clinical team will get back to you shortly."
      });
      // Optionally reset form
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700 pt-24 md:pt-32">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-black/60 font-medium leading-relaxed max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-32">
            <div>
              <h2 className="text-2xl font-bold text-black mb-8 tracking-tight">{t("contactInfo")}</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-5 group">
                  <div className="h-14 w-14 rounded-2xl bg-black/[0.03] group-hover:bg-primary/10 transition-colors flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-black/60 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5">
                      Location
                    </p>
                    <p className="font-semibold text-black text-base">{t("address")}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5 group">
                  <div className="h-14 w-14 rounded-2xl bg-black/[0.03] group-hover:bg-primary/10 transition-colors flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-black/60 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5">
                      {t("phoneLabel")}
                    </p>
                    <p className="font-semibold text-black text-base">+237 600 000 000</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="h-14 w-14 rounded-2xl bg-black/[0.03] group-hover:bg-primary/10 transition-colors flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-black/60 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5">
                      {t("emailLabel")}
                    </p>
                    <p className="font-semibold text-black text-base">support@doctasimo.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/10">
              <h3 className="font-bold text-lg text-primary mb-2">Need immediate assistance?</h3>
              <p className="text-sm font-medium text-black/60 leading-relaxed mb-6">
                Our clinical support team is available during standard business hours for urgent inquiries regarding botanical formulations.
              </p>
              <Button variant="outline" className="w-full bg-white text-primary border-primary/20 hover:bg-primary/5 rounded-xl h-12">
                Call Support
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-black/[0.02] border border-black/5 p-8 md:p-12 rounded-[40px] shadow-none">
              <h2 className="text-2xl font-bold text-black mb-10 tracking-tight">{t("sayHello")}</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 pl-1">
                      {t("name")}
                    </label>
                    <Input required placeholder="Jane Doe" className="h-14 bg-white border-black/5 rounded-2xl shadow-none focus:border-primary/50 text-base font-medium px-5" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 pl-1">
                      {t("email")}
                    </label>
                    <Input type="email" placeholder="jane@example.com" required className="h-14 bg-white border-black/5 rounded-2xl shadow-none focus:border-primary/50 text-base font-medium px-5" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 pl-1">
                    {t("subject")}
                  </label>
                  <Input required placeholder="How can we help?" className="h-14 bg-white border-black/5 rounded-2xl shadow-none focus:border-primary/50 text-base font-medium px-5" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 pl-1">
                    {t("message")}
                  </label>
                  <Textarea required placeholder="Please describe your inquiry in detail..." className="min-h-[180px] bg-white border-black/5 rounded-2xl shadow-none focus:border-primary/50 text-base font-medium resize-none p-5" />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-14 px-10 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                    {isSubmitting ? "Sending..." : (
                      <>
                        {t("send")}
                        <Send className="ml-2.5 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
