"use client";

import { SettingsForm } from "@/components/admin/settings-form";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
 return (
 <div className="p-8 space-y-12 animate-in fade-in slide-in-from-top-4 duration-1500">
 <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-black/5">
 <div className="space-y-1">
 <h1 className="text-6xl font-black uppercase tracking-tighter text-black leading-none flex items-center gap-6">
 <Settings className="h-14 w-14 text-black/10 transition-transform hover:rotate-90 duration-1000" />
 Control Hub
 </h1>
 <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-2 inline-block px-1">Managing global application protocols and logistical constants.</p>
 </div>
 </div>
 
 <SettingsForm />
 </div>
 );
}