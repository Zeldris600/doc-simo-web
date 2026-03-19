"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { 
 User as UserIcon, 
 ShoppingBag, 
 Settings, 
 LogOut, 
 Camera,
 CheckCircle2,
 AlertCircle,
 Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useMe, useUpdateMe } from "@/hooks/use-user";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export function AccountClient() {
 const t = useTranslations("account");
 const { data: userData, isLoading: isUserLoading } = useMe();
 const updateMeMutation = useUpdateMe();

 const [formData, setFormData] = React.useState({
 name: "",
 email: "",
 phoneNumber: "",
 });

 React.useEffect(() => {
 if (userData) {
 setFormData({
 name: userData.name || "",
 email: userData.email || "",
 phoneNumber: userData.phoneNumber || "",
 });
 }
 }, [userData]);

 const handleUpdateProfile = async (e: React.FormEvent) => {
 e.preventDefault();
 updateMeMutation.mutate({ name: formData.name }, {
 onSuccess: () => {
 toast.success(t("profile.saveSuccess") || "Profile updated successfully");
 },
 onError: () => {
 toast.error("Failed to update profile");
 }
 });
 };

 if (isUserLoading) {
 return (
 <div className="flex items-center justify-center min-h-[400px]">
 <Loader2 className="h-8 w-8 animate-spin text-primary" />
 </div>
 );
 }

 const initials = formData.name
 ?.split(" ")
 .map((n) => n[0])
 .join("")
 .toUpperCase() || "JD";

 return (
 <div className="container mx-auto max-w-6xl px-4 py-8 md:py-16">
 <div className="flex flex-col md:flex-row gap-8">
 {/* Sidebar / Profile Summary */}
 <aside className="w-full md:w-80 space-y-6">
 <Card className="border-none bg-primary text-white overflow-hidden">
 <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
 <div className="relative group mb-4">
 <Avatar className="h-24 w-24 border-4 border-white/20 ">
 <AvatarImage src={userData?.image} />
 <AvatarFallback className="bg-white/10 text-2xl font-bold">
 {initials}
 </AvatarFallback>
 </Avatar>
 <button className="absolute bottom-0 right-0 p-1.5 bg-white text-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
 <Camera className="h-4 w-4" />
 </button>
 </div>
 <h2 className="text-xl font-bold tracking-tight">{formData.name}</h2>
 <p className="text-white/60 text-sm mb-4">{formData.email}</p>
 <Badge variant="secondary" className="bg-white/10 text-white border-none hover:bg-white/20">
 {userData?.role || "CUSTOMER"}
 </Badge>
 </CardContent>
 <div className="px-6 pb-6">
 <Button 
 variant="ghost" 
 className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 border-t border-white/5 rounded-none pt-4"
 onClick={() => signOut()}
 >
 <LogOut className="mr-3 h-4 w-4" />
 {t("logout") || "Log out"}
 </Button>
 </div>
 </Card>

 {/* Quick Stats or Extra Info */}
 <Card className="border-black/5 bg-white ">
 <CardHeader className="pb-3">
 <CardTitle className="text-xs font-bold uppercase tracking-wider text-black/40">
 Account Status
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-sm font-medium text-black/60">Email Verified</span>
 {userData?.emailVerified ? (
 <CheckCircle2 className="h-4 w-4 text-emerald-500" />
 ) : (
 <AlertCircle className="h-4 w-4 text-amber-500" />
 )}
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm font-medium text-black/60">Phone Verified</span>
 {userData?.phoneNumberVerified ? (
 <CheckCircle2 className="h-4 w-4 text-emerald-500" />
 ) : (
 <AlertCircle className="h-4 w-4 text-amber-500" />
 )}
 </div>
 </CardContent>
 </Card>
 </aside>

 {/* Main Content Areas */}
 <main className="flex-1 min-w-0">
 <Tabs defaultValue="profile" className="w-full">
 <TabsList className="bg-black/5 p-1 mb-8 w-full md:w-auto h-auto grid grid-cols-3 md:inline-flex">
 <TabsTrigger 
 value="profile" 
 className="data-[state=active]:bg-white data-[state=active]: rounded-lg px-6 py-2.5"
 >
 <UserIcon className="mr-2 h-4 w-4" />
 <span className="hidden md:inline">{t("profile.title")}</span>
 <span className="md:hidden">Profile</span>
 </TabsTrigger>
 <TabsTrigger 
 value="orders" 
 className="data-[state=active]:bg-white data-[state=active]: rounded-lg px-6 py-2.5"
 >
 <ShoppingBag className="mr-2 h-4 w-4" />
 <span className="hidden md:inline">{t("orders.title")}</span>
 <span className="md:hidden">Orders</span>
 </TabsTrigger>
 <TabsTrigger 
 value="settings" 
 className="data-[state=active]:bg-white data-[state=active]: rounded-lg px-6 py-2.5"
 >
 <Settings className="mr-2 h-4 w-4" />
 <span className="hidden md:inline">{t("settings.title")}</span>
 <span className="md:hidden">Settings</span>
 </TabsTrigger>
 </TabsList>

 <TabsContent value="profile" className="space-y-6 focus-visible:outline-none">
 <Card className="border-black/5 ">
 <CardHeader>
 <CardTitle className="text-2xl font-bold">{t("profile.title")}</CardTitle>
 <CardDescription>{t("profile.subtitle")}</CardDescription>
 </CardHeader>
 <CardContent>
 <form onSubmit={handleUpdateProfile} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <Label htmlFor="name" className="text-black/60 font-bold">{t("profile.name")}</Label>
 <Input 
 id="name" 
 value={formData.name} 
 onChange={(e) => setFormData({...formData, name: e.target.value})}
 className="bg-black/[0.02] border-black/10 focus:border-primary rounded-xl"
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="email" className="text-black/60 font-bold">{t("profile.email")}</Label>
 <Input 
 id="email" 
 value={formData.email} 
 disabled 
 className="bg-black/[0.01] border-black/5 text-black/40 rounded-xl cursor-not-allowed"
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="phone" className="text-black/60 font-bold">{t("profile.phone")}</Label>
 <Input 
 id="phone" 
 value={formData.phoneNumber} 
 disabled
 className="bg-black/[0.01] border-black/5 text-black/40 rounded-xl cursor-not-allowed"
 />
 </div>
 </div>
 <div className="pt-4">
 <Button 
 type="submit" 
 disabled={updateMeMutation.isPending}
 className="bg-primary hover:bg-primary/90 rounded-xl px-8 py-6 h-auto font-bold text-lg"
 >
 {updateMeMutation.isPending ? (
 <>
 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
 {t("profile.saving")}
 </>
 ) : (
 t("profile.save")
 )}
 </Button>
 </div>
 </form>
 </CardContent>
 </Card>
 </TabsContent>

 <TabsContent value="orders" className="space-y-6 focus-visible:outline-none">
 <Card className="border-black/5 text-center py-16">
 <div className="flex flex-col items-center justify-center space-y-4">
 <div className="p-4 bg-black/[0.02] rounded-full">
 <ShoppingBag className="h-12 w-12 text-black/20" />
 </div>
 <div>
 <CardTitle className="text-xl mb-1">{t("orders.empty")}</CardTitle>
 <CardDescription>Track your herbal journey here.</CardDescription>
 </div>
 <Button className="rounded-xl px-8 h-12 font-bold mt-4">
 {t("orders.shopNow")}
 </Button>
 </div>
 </Card>
 </TabsContent>

 <TabsContent value="settings" className="space-y-6 focus-visible:outline-none">
 <Card className="border-black/5 ">
 <CardHeader>
 <CardTitle className="text-2xl font-bold">{t("settings.title")}</CardTitle>
 <CardDescription>{t("settings.subtitle")}</CardDescription>
 </CardHeader>
 <CardContent className="space-y-6">
 <div className="flex items-center justify-between p-4 bg-black/[0.02] rounded-lg border border-black/5">
 <div>
 <p className="font-bold text-black">{t("settings.password")}</p>
 <p className="text-sm text-black/40">Keep your account safe with a strong password.</p>
 </div>
 <Button variant="outline" className="rounded-xl border-black/10 font-bold">
 Update
 </Button>
 </div>
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>
 </main>
 </div>
 </div>
 );
}
