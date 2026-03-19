"use client";

import * as React from "react";
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  ShieldCheck, 
  Settings, 
  ChevronRight,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signOut } from "next-auth/react";
import { useMe } from "@/hooks/use-user";
import { useRouter, Link } from "@/i18n/routing";
import { toast } from "sonner";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AccountPage() {
  const t = useTranslations("account");
  const { data: user } = useMe();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Signed out successfully.");
      router.push("/login");
    } catch {
      toast.error("An error occurred during sign out.");
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 pb-10 border-b border-black/5">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative h-32 w-32 rounded-xl overflow-hidden bg-primary/5 border border-primary/10 group transition-all duration-300">
            {user?.image ? (
              <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary">
                <User className="h-12 w-12 text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] font-bold text-white tracking-wider">Update</span>
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-primary uppercase leading-none">
              {user?.name || "Patient Member"}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-4 py-0.5 text-[10px] font-black tracking-widest border-none uppercase">
                {typeof user?.role === "string" ? user.role.toLowerCase() : "customer"}
              </Badge>
              <span className="text-black/40 font-bold text-[10px] tracking-wide flex items-center gap-1.5 uppercase">
                <ShieldCheck className="h-3 w-3 text-primary/40" /> Verified Account
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button 
            variant="outline" 
            asChild
            className="flex-1 md:flex-initial rounded-xl h-12 px-6 border-black/10 hover:bg-black/5 transition-all font-black text-[10px] tracking-widest active:scale-95 transition-all"
          >
            <Link href="/account/profile">
               <Settings className="mr-2 h-4 w-4" /> Profile Specs
            </Link>
          </Button>
          <Button 
            onClick={handleLogout}
            className="flex-1 md:flex-initial bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-black text-[10px] tracking-widest active:scale-95 transition-all"
          >
            <LogOut className="mr-2 h-4 w-4" /> Exit
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Content: Registry Details */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tighter text-black uppercase">{t("profile.title")}</h2>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest">{t("profile.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 border-black/5 rounded-2xl bg-white space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">{t("profile.name")}</p>
                  <p className="text-lg font-black text-black">{user?.name || "Patient Member"}</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-black/5 rounded-2xl bg-white space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <Settings className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">{t("profile.phone")}</p>
                  <p className="text-lg font-black text-black">{user?.phoneNumber || "No phone linked"}</p>
                </div>
              </div>
            </Card>

            <Card className="md:col-span-2 p-8 border-black/5 rounded-2xl bg-white space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">Active Coordinates</p>
                    <p className="text-lg font-black text-black">
                      {user?.profile?.address || "No delivery address provided in registry."}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl h-10 px-6 font-black text-[10px] tracking-widest border-black/10 hover:bg-black/5 active:scale-95 transition-all">
                  Update
                </Button>
              </div>
            </Card>
          </div>

          <div className="pt-6 border-t border-black/5">
             <div className="bg-black/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                 <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                   <Package className="h-8 w-8 text-primary" />
                 </div>
                 <div className="space-y-1">
                   <h3 className="text-xl font-black text-black tracking-tight leading-none">Access Inventory Logs</h3>
                   <p className="text-xs font-medium text-black/40">Track and manage your medical procurement history.</p>
                 </div>
               </div>
               <Button asChild className="rounded-xl h-12 px-8 font-black text-xs tracking-widest bg-black text-white hover:bg-black/80 active:scale-95 shadow-xl shadow-black/10">
                 <Link href="/account/orders">
                   Entry Registry <ChevronRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="p-8 border-black/5 rounded-2xl bg-black/[0.02] space-y-8 border shadow-none">
            <div className="space-y-2">
              <h3 className="text-lg font-black text-black uppercase tracking-tighter">Wellness Matrix</h3>
              <p className="text-[11px] font-medium text-black/40">Your clinical standing and registry status.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black text-black/60 uppercase tracking-widest">Account Status</span>
                </div>
                <Badge className="bg-primary/10 text-primary rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-wider border-none">
                  Verified
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-black/60 uppercase tracking-widest">Medical Access</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-wider border-none">
                  Active
                </Badge>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-black/5">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-black/40" />
                  <span className="text-[11px] font-black text-black/60 uppercase tracking-widest">Batch Alerts</span>
                </div>
                <div className="h-5 w-10 rounded-full bg-primary/10 flex items-center px-1">
                  <div className="h-3.5 w-3.5 rounded-full bg-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-black/5 space-y-4">
              <h4 className="text-[10px] font-black text-black/30 uppercase tracking-widest">Official Support</h4>
              <p className="text-[11px] font-bold text-black/60 leading-relaxed">Need help with your botanical formulations? Our portal is open 24/7.</p>
              <Button asChild variant="link" className="text-primary font-black text-[10px] uppercase tracking-widest p-0 h-auto">
                 <Link href="/contact">Open Comms</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
