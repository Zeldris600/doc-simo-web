"use client";

import { MessageSquare, Headphones } from "lucide-react";

export default function AdminSupportDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 md:p-20 text-center bg-white">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <MessageSquare className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border-4 border-white">
          <Headphones className="h-4 w-4 text-emerald-600" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 max-w-sm">
        <h3 className="text-xl font-bold text-black">
          Welcome to Support
        </h3>
        <p className="text-sm text-black/40 leading-relaxed">
          Select a conversation from the sidebar to view messages and respond to customer inquiries.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mt-10 flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-700">Online</span>
        </div>
        <div className="px-3 py-1.5 bg-black/[0.03] rounded-full">
          <span className="text-[11px] font-bold text-black/40">Ready for messages</span>
        </div>
      </div>
    </div>
  );
}
