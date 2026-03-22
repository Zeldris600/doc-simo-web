"use client";

import { MessageSquare } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

export function FloatingConsultation() {
  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      <Link href="/consultation">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-3 bg-primary text-white p-4 px-6 rounded-full shadow-2xl shadow-primary/40 group relative overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 -skew-y-12 transition-transform duration-500 group-hover:translate-y-full" />
          
          <MessageSquare className="w-5 h-5" />
          <span className="font-bold text-sm tracking-tight">
            Medical Consultation
          </span>
          
          {/* Notification dot */}
          <span className="absolute top-3 left-4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </motion.div>
      </Link>
    </div>
  );
}
