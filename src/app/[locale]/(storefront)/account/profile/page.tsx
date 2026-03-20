"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMe, useUpdateMe } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { toast } from "sonner";
import { Loader2, User, MapPin, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
  const { data: user, isLoading: isLoadingUser } = useMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMe();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      image: "",
      phoneNumber: "",
      address: "",
      city: "",
      region: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        image: user.image || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || user.customer?.address || "",
        city: user.city || user.customer?.city || "",
        region: user.region || user.customer?.region || "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success("Profile updated on Cloudinary and Node registry.");
      },
      onError: () => {
        toast.error("Failed to synchronize profile changes.");
      },
    });
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase text-black">Registry Profile Specs</h1>
        <p className="text-xs font-bold text-black/40 uppercase tracking-widest">Update your identity and delivery coordinates.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Col: Avatar */}
            <div className="lg:col-span-4 space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black/40">Identification Image</FormLabel>
                    <FormControl>
                      <ImageUploader 
                        defaultValue={field.value}
                        onUploadSuccess={field.onChange}
                        className="rounded-3xl h-64 w-64 mx-auto lg:mx-0"
                      />
                    </FormControl>
                    <FormDescription className="text-[9px] font-bold text-black/20 uppercase text-center lg:text-left mt-4 ">
                      PNG, JPG or WebP. Synchronized via Cloudinary.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Col: Fields */}
            <div className="lg:col-span-8 space-y-8">
              <Card className="border-none shadow-none bg-black/[0.02] rounded-3xl p-2">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-black/60 flex items-center gap-2">
                    <User className="h-4 w-4" /> Personal Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Joram Abayo" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+237 ..." {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input value={user?.email || ""} disabled className="bg-gray-100 border-none opacity-50 font-bold" />
                      </FormControl>
                      <FormDescription className="text-[9px] uppercase font-bold text-black/20">Registry locked email.</FormDescription>
                    </FormItem>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-black/[0.02] rounded-3xl p-2">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-black/60 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Delivery Coordinates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Quartier Fouda, Street 123" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Yaoundé" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <FormControl>
                            <Input placeholder="Centre" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-6">
                <Button type="submit" disabled={isUpdating} className="h-14 px-10 rounded-2xl font-black uppercase text-xs tracking-widest bg-black text-white hover:bg-black/90 active:scale-95 transition-all shadow-xl shadow-black/10">
                  {isUpdating ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <ShieldCheck className="h-5 w-5 mr-3" />}
                  {isUpdating ? "Synchronizing Profile..." : "Seal Identity Registry"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
