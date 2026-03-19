"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateMe } from "@/hooks/use-user";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { User } from "@/types/auth";
import { ImageUploader } from "@/components/ui/image-uploader";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  otpChannelPreference: z.enum(["whatsapp", "sms"]).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User | undefined;
  onSuccess?: () => void;
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const updateMutation = useUpdateMe();

  console.log(user);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      firstName: user?.customer?.firstName || "",
      lastName: user?.customer?.lastName || "",
      email: user?.customer?.email || user?.email || "",
      image: user?.image || "",
      phoneNumber: user?.customer?.phoneNumber || user?.phoneNumber || "",
      address: user?.customer?.address || user?.address || "",
      city: user?.customer?.city || user?.city || "",
      region: user?.customer?.region || user?.region || "",
      otpChannelPreference: user?.customer?.otpChannelPreference || "whatsapp",
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        firstName: user.customer?.firstName || "",
        lastName: user.customer?.lastName || "",
        email: user.customer?.email || user.email || "",
        image: user.image || "",
        phoneNumber: user.customer?.phoneNumber || user.phoneNumber || "",
        address: user.customer?.address || user.address || "",
        city: user.customer?.city || user.city || "",
        region: user.customer?.region || user.region || "",
        otpChannelPreference: user.customer?.otpChannelPreference || "whatsapp",
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Profile updated successfully.");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Failed to update profile.");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-center">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full max-w-[140px]">
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <ImageUploader
                    className="rounded-xl"
                    defaultValue={field.value}
                    onUploadSuccess={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otpChannelPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP Preference</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <Loader2 className="mr-3 h-4 w-4 animate-spin text-white" />
          ) : null}
          Update Profile
        </Button>
      </form>
    </Form>
  );
}
