"use client";

import * as React from "react";
import { User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signOut } from "next-auth/react";
import { useMe } from "@/hooks/use-user";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import Image from "next/image";
import { ProfileForm } from "@/components/account/profile-form";

import { Skeleton } from "@/components/ui/skeleton";

export default function AccountPage() {
  const { data: user, isPending } = useMe();

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

  if (isPending) {
    return (
      <div className="container mx-auto max-w-4xl px-4 pt-24 md:pt-32 pb-16 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-black/5">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>
            </div>
          </div>
          <Skeleton className="h-11 w-28 rounded-xl" />
        </div>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Card className="p-8 border-black/5 rounded-3xl bg-white shadow-sm border">
            <div className="space-y-8">
              <div className="flex justify-center">
                <Skeleton className="h-32 w-32 rounded-2xl" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 pt-24 md:pt-32 pb-16 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Simple Profile Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-black/5">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative h-24 w-24 rounded-full overflow-hidden bg-primary flex items-center justify-center">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                fill
                className="object-cover rounded-xl"
              />
            ) : (
              <UserIcon className="h-10 w-10 text-white" />
            )}
          </div>
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-black leading-none">
              {user?.name || "Member Profile"}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-1">
              <Badge className="bg-primary/5 text-primary rounded-full px-3 py-0.5 text-xs font-bold border border-primary/10">
                {typeof user?.role === "string" ? user.role : "Customer"}
              </Badge>
              <span className="text-black/30 font-bold text-xs flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Verified
                account
              </span>
            </div>
          </div>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="h-4 w-4" /> Log out
        </Button>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold  text-black">
            Profile Details
          </h2>
          <p className="text-sm font-medium text-black/40">
            Manage your personal information and contact preferences.
          </p>
        </div>

        <Card className="p-4 md:p-8 border-black/5 rounded-3xl bg-white">
          <ProfileForm user={user} />
        </Card>
      </div>
    </div>
  );
}
