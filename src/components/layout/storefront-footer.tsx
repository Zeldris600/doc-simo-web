import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
} from "lucide-react";
import Link from "next/link";

export function StorefrontFooter() {
  return (
    <footer className="bg-white text-black pt-24 pb-12 border-t border-black/5">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 text-center md:text-left">
          {/* Brand Info */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-xl bg-primary">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight uppercase text-primary">
                DOCTASIMO
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
              Pioneering clinical herbal excellence since 1994. We bring the
              healing power of tropical papaya and rare botanicals to your
              doorstep.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="p-2.5 rounded-full bg-gray-50 text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="p-2.5 rounded-full bg-gray-50 text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-8 text-black">
              Shop Selection
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-500 hover:text-primary transition-colors font-medium"
                >
                  All Formulations
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-500 hover:text-primary transition-colors font-medium"
                >
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-primary transition-colors font-medium"
                >
                  Clinical Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-8 text-black">
              Care & Support
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-500 hover:text-primary transition-colors font-medium"
                >
                  F.A.Q.
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-500 hover:text-primary transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-8 text-black">
              Get In Touch
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500 leading-relaxed font-bold">
                  Clinical Center
                  <br />
                  Douala, Cameroon
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-gray-500 font-bold">
                  +237 600 000 000
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-gray-500 font-bold">
                  support@doctasimo.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] text-gray-400 tracking-tight uppercase font-bold text-center md:text-left">
            © {new Date().getFullYear()} DOCTASIMO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-8 opacity-40 grayscale flex-wrap justify-center">
            <span className="text-[10px] text-black font-black px-3 py-1 border border-black/10 rounded">
              VISA
            </span>
            <span className="text-[10px] text-black font-black px-3 py-1 border border-black/10 rounded">
              MASTERCARD
            </span>
            <span className="text-[10px] text-black font-black px-3 py-1 border border-black/10 rounded">
              PAYPAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
