"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCreateDiscount } from "@/hooks/use-discount";

import DashboardHeader from "@/components/dashboard-header";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const discountSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().min(1, "Value must be at least 1"),
  expiresAt: z.string().optional(),
  maxUses: z.coerce.number().optional(),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

export default function AdminAddDiscountPage() {
  const router = useRouter();
  const { mutate: createDiscount, isPending: isCreating } = useCreateDiscount();

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      type: "PERCENT",
      value: 10,
      expiresAt: "",
      maxUses: undefined,
    },
  });

  const onSubmit = (values: DiscountFormValues) => {
    createDiscount(
      {
        code: values.code.toUpperCase(),
        type: values.type,
        value: values.value,
        expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
        maxUses: values.maxUses || undefined,
      },
      {
        onSuccess: () => {
          router.push("/admin/discounts");
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl px-4 py-8 mx-auto">
      <DashboardHeader
        title="Create Discount"
        description="Add a new promotional code for customers."
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl border border-gray-100"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. SUMMER25"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    className="uppercase tracking-widest font-bold"
                  />
                </FormControl>
                <FormDescription>
                  Customers will enter this code at checkout.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                      <SelectItem value="FIXED">Fixed Amount (XAF)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date (optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Leave empty for no expiry.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxUses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Uses (optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 100" {...field} />
                  </FormControl>
                  <FormDescription>Leave empty for unlimited.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/discounts")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
              ) : (
                "Create Discount"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
