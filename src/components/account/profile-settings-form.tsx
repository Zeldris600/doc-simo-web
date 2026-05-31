"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useUpdateMe } from "@/hooks/use-user";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, User, MapPin, ShieldCheck, Fingerprint } from "@/lib/icons";
import type { User as AuthUser } from "@/types/auth";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

const accountCardClass =
  "border border-black/8 bg-white rounded-xl shadow-none overflow-hidden";

export function ProfileSettingsForm({ user }: { user: AuthUser }) {
  const t = useTranslations("account.profile");
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
    form.reset({
      name: user.name || "",
      image: user.image || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || user.customer?.address || "",
      city: user.city || user.customer?.city || "",
      region: user.region || user.customer?.region || "",
    });
  }, [user, form]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data, {
      onSuccess: () => toast.success(t("saveSuccess")),
      onError: () => toast.error("Could not update profile."),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="space-y-4">
          <Card className={accountCardClass}>
            <CardHeader className="py-4 px-6 border-b border-black/6">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-primary/70" />
                Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <ImageUploader
                        defaultValue={field.value}
                        onUploadSuccess={field.onChange}
                        className="rounded-xl h-44 w-44 mx-auto bg-muted/30 border-2 border-dashed border-black/10 hover:border-primary/30 transition-all"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground text-center">
                      Profile photo
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full h-11 rounded-lg font-semibold text-sm"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ShieldCheck className="h-4 w-4 mr-2" />
            )}
            {isUpdating ? t("saving") : t("save")}
          </Button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className={accountCardClass}>
            <CardHeader className="py-4 px-6 border-b border-black/6">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary/70" />
                {t("title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {t("name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. John Doe"
                        {...field}
                        className="h-11 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {t("phone")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+237 …"
                          {...field}
                          className="h-11 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel className="text-sm font-medium">{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      value={user.email || ""}
                      disabled
                      className="h-11 rounded-lg bg-muted/40"
                    />
                  </FormControl>
                </FormItem>
              </div>
            </CardContent>
          </Card>

          <Card className={accountCardClass}>
            <CardHeader className="py-4 px-6 border-b border-black/6">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/70" />
                Delivery address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Street address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main Street"
                        {...field}
                        className="h-11 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Yaoundé"
                          {...field}
                          className="h-11 rounded-lg"
                        />
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
                      <FormLabel className="text-sm font-medium">Region</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Centre"
                          {...field}
                          className="h-11 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
