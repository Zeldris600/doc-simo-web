"use client";

import * as React from "react";
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  ArrowRight,
  PhoneCall,
  Send,
} from "@/lib/icons";
import { Link } from "@/i18n/routing";

const AFRICAN_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none'%3E%3Cpolygon points='30,4 56,18 56,42 30,56 4,42 4,18' stroke='%23ffffff' stroke-width='0.6' fill='none' opacity='0.05'/%3E%3Cpolygon points='30,12 48,22 48,38 30,48 12,38 12,22' stroke='%23f2c94c' stroke-width='0.4' fill='none' opacity='0.04'/%3E%3C/g%3E%3C/svg%3E")`;

const NAV_SHOP = [
  { label: "All Formulations", href: "/products" },
  { label: "Antiviral Remedies", href: "/products?category=antiviral" },
  { label: "Immune Support", href: "/products?category=immune" },
  { label: "Detox & Cleanse", href: "/products?category=detox" },
  { label: "Special Offers", href: "/products?isPromotion=true" },
];

const NAV_CLINIC = [
  { label: "Book Consultation", href: "/consultation" },
  { label: "Meet Dr. Simo", href: "/about" },
  { label: "Health Videos", href: "/#videos" },
  { label: "Our Process", href: "/#how-it-works" },
  { label: "Clinical Research", href: "/about#research" },
];

const NAV_SUPPORT = [
  { label: "FAQ", href: "/faq" },
  { label: "Track My Order", href: "/orders" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "#", color: "hover:bg-[#1877f2]" },
  {
    icon: Instagram,
    label: "Instagram",
    href: "#",
    color: "hover:bg-[#e1306c]",
  },
  { icon: Youtube, label: "YouTube", href: "#", color: "hover:bg-[#ff0000]" },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/237600000000",
    color: "hover:bg-[#25d366]",
  },
];

export function StorefrontFooter() {
  const [email, setEmail] = React.useState("");

  return (
    <footer className="relative bg-primary overflow-hidden text-white">
      {/* African geometric pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: AFRICAN_PATTERN,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#f2c94c]/5 -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* ── Newsletter banner ── */}
        <div className="border-b border-white/10 py-10 px-4 sm:px-6 lg:px-12">
          <div className="container max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
                Stay in the loop
              </p>
              <h3 className="text-xl font-black text-white leading-tight">
                Get 15% off your first order 🌿
              </h3>
              <p className="text-xs text-white/50 font-medium">
                Clinic updates, herbal health tips &amp; exclusive subscriber
                deals.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex w-full max-w-md gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 h-11 rounded-xl bg-white/10 border border-white/15 px-4 text-sm text-white placeholder:text-white/35 font-medium outline-none focus:border-[#f2c94c]/50 transition-colors"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-[#f2c94c] text-[#142c1b] text-xs font-black hover:bg-[#f0c040] transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ── Main columns ── */}
        <div className="px-4 sm:px-6 lg:px-12 pt-16 pb-10">
          <div className="container max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="p-1.5 rounded-xl bg-white/10 group-hover:bg-[#f2c94c] transition-colors">
                  <Leaf className="h-5 w-5 text-white group-hover:text-[#142c1b] transition-colors" />
                </div>
                <span className="font-black text-xl tracking-tight text-white">
                  DOCTASIMO
                </span>
              </Link>

              <p className="text-sm text-white/55 leading-relaxed font-medium max-w-xs">
                Rooted in African botanical tradition since 1994 — bridging
                ancestral herbal wisdom with modern clinical science for
                lasting, natural healing.
              </p>

              {/* Book consultation CTA */}
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 bg-[#f2c94c] text-[#142c1b] px-5 py-2.5 rounded-full text-xs font-black hover:bg-[#f0c040] transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                Book Free Consultation
              </Link>

              {/* Contact */}
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3 text-xs text-white/50 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-[#f2c94c] shrink-0 mt-0.5" />
                  <span>Doctasimo Clinical Centre · Douala, Cameroon</span>
                </li>
                <li className="flex items-center gap-3 text-xs text-white/50 font-medium">
                  <Phone className="h-3.5 w-3.5 text-[#f2c94c] shrink-0" />
                  <a
                    href="tel:+237600000000"
                    className="hover:text-white transition-colors"
                  >
                    +237 600 000 000
                  </a>
                </li>
                <li className="flex items-center gap-3 text-xs text-white/50 font-medium">
                  <Mail className="h-3.5 w-3.5 text-[#f2c94c] shrink-0" />
                  <a
                    href="mailto:support@doctasimo.com"
                    className="hover:text-white transition-colors"
                  >
                    support@doctasimo.com
                  </a>
                </li>
              </ul>

              {/* Socials */}
              <div className="flex items-center gap-2 pt-1">
                {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center ${color} hover:text-white transition-all duration-300`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop column */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#f2c94c]">
                Shop
              </h4>
              <ul className="space-y-3">
                {NAV_SHOP.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-white/50 hover:text-white font-medium transition-colors flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinic column */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#f2c94c]">
                Clinic
              </h4>
              <ul className="space-y-3">
                {NAV_CLINIC.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-white/50 hover:text-white font-medium transition-colors flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support column */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#f2c94c]">
                Support
              </h4>
              <ul className="space-y-3">
                {NAV_SUPPORT.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-white/50 hover:text-white font-medium transition-colors flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/8 px-4 sm:px-6 lg:px-12 py-6">
          <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Copyright + legal links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] text-white/30 font-bold uppercase tracking-wider">
              <span>
                © {new Date().getFullYear()} Doctasimo · All rights reserved
              </span>
              <span className="text-white/15">·</span>
              <Link
                href="/privacy"
                className="hover:text-white/60 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white/60 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/faq"
                className="hover:text-white/60 transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* ── Health disclaimer ── */}
        <div className="border-t border-white/5 px-4 sm:px-6 lg:px-12 py-5 bg-black/20">
          <p className="container max-w-7xl mx-auto text-[10px] text-white/20 font-medium leading-relaxed text-center">
            ⚕️ <strong className="text-white/30">Health Disclaimer:</strong>{" "}
            Doctasimo products are traditional African herbal &amp; antiviral
            formulations. They are not intended to diagnose, treat, cure, or
            replace prescribed medical treatment. Always consult a licensed
            healthcare provider before use. Results may vary.
          </p>
        </div>
      </div>
    </footer>
  );
}
