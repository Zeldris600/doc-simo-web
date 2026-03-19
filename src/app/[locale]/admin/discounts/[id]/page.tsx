"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { useDiscount, useUpdateDiscount } from "@/hooks/use-discount";
import { useEffect } from "react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const discountSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().min(1, "Value must be at least 1"),
  expiresAt: z.string().optional(),
  active: z.boolean(),
  maxUses: z.number().optional(),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

export default function AdminEditDiscountPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: discount, isLoading: isLoadingDiscount } = useDiscount(id);
  const { mutate: updateDiscount, isPending: isUpdating } = useUpdateDiscount();

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      type: "PERCENT",
      value: 10,
      expiresAt: "",
      active: true,
      maxUses: undefined,
    },
  });

  useEffect(() => {
    if (discount) {
      form.reset({
        code: discount.code || "",
        type: (discount.type as "PERCENT" | "FIXED") || "PERCENT",
        value: Number(discount.value) || 0,
        expiresAt: discount.expiresAt
          ? new Date(discount.expiresAt).toISOString().split("T")[0]
          : "",
        active: discount.active ?? true,
        maxUses: discount.maxUses ?? undefined,
      });
    }
  }, [discount, form]);

  const onSubmit = (values: DiscountFormValues) => {
    updateDiscount(
      {
        id,
        data: {
          code: values.code.toUpperCase(),
          type: values.type,
          value: values.value,
          expiresAt: values.expiresAt
            ? new Date(values.expiresAt).toISOString()
            : undefined,
          active: values.active,
          maxUses: values.maxUses || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Discount updated successfully");
          router.push("/admin/discounts");
        },
      },
    );
  };

  if (isLoadingDiscount) {
    return (
      <div className="p-8 text-center text-muted-foreground font-bold animate-pulse uppercase tracking-widest text-xs">
        Loading Discount...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl px-4 py-8 mx-auto">
      <DashboardHeader
        title="Edit Discount"
        description="Update existing promotional discount code."
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
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    className="uppercase tracking-widest font-bold"
                  />
                </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel className="text-sm font-bold">Active</FormLabel>
                  <FormDescription>
                    Toggle to activate or deactivate this discount code.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/discounts")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Discount"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
