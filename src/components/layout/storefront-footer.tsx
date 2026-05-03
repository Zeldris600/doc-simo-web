"use client";

import * as React from "react";
import {
 Facebook,
 Instagram,
 Youtube,
 MessageCircle,
} from "@/lib/icons";
import { Link } from "@/i18n/routing";

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
 return (
 <footer className="bg-white border-t border-black/5 py-12 px-4 sm:px-6 lg:px-12">
 <div className="container max-w-7xl mx-auto space-y-10">
 <div className="flex flex-col md:flex-row items-center justify-between gap-8">
 <Link href="/" className="inline-flex items-center gap-2">
 <img 
   src="/logo-minimized.png" 
   alt="Doctasimo Logo" 
   className="h-8 w-auto object-contain grayscale"
 />
 <span className="font-bold text-xl tracking-tight text-primary">
 DOCTASIMO
 </span>
 </Link>

 <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-foreground/60">
 <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
 <Link href="/about" className="hover:text-primary transition-colors">About</Link>
 <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
 <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
 </nav>

 <div className="flex items-center gap-4">
 {SOCIALS.map(({ icon: Icon, label, href }) => (
 <a
 key={label}
 href={href}
 target="_blank"
 rel="noopener noreferrer"
 aria-label={label}
 className="text-foreground/40 hover:text-primary transition-colors"
 >
 <Icon className="h-5 w-5" />
 </a>
 ))}
 </div>
 </div>

 <div className="pt-10 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest font-bold text-foreground/30">
 <p>© {new Date().getFullYear()} Doctasimo. Natural Health Platform.</p>
 <div className="flex items-center gap-6">
 <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
 <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
 </div>
 </div>

 <p className="text-[10px] text-foreground/20 font-medium leading-relaxed text-center max-w-3xl mx-auto pt-4">
 ⚕️ Health Disclaimer: Doctasimo products are traditional African herbal formulations. 
 They are not intended to diagnose, treat, cure, or replace prescribed medical treatment. 
 Always consult a licensed healthcare provider before use.
 </p>
 </div>
 </footer>
 );
}
