"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Ticket } from "@/lib/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useCreateDiscount, useUpdateDiscount } from "@/hooks/use-discount";
import { toast } from "sonner";
import { Discount } from "@/types/api";

const discountSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().min(1, "Value must be positive"),
  expiresAt: z.string().min(1, "Expiry date is required"),
  active: z.boolean(),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

interface DiscountFormProps {
  initialData?: Discount;
  onSuccess?: () => void;
}

export function DiscountForm({ initialData, onSuccess }: DiscountFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateDiscount();
  const updateMutation = useUpdateDiscount();

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: initialData?.code || "",
      type: (initialData?.type as "PERCENT" | "FIXED") || "PERCENT",
      value: Number(initialData?.value || 0),
      expiresAt: initialData?.expiresAt
        ? new Date(initialData.expiresAt).toISOString().split("T")[0]
        : "",
      active: initialData?.active ?? true,
    },
  });

  const onSubmit = (data: DiscountFormValues) => {
    const payload = {
      ...data,
      expiresAt: new Date(data.expiresAt).toISOString(),
    };

    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Voucher logic updated.");
            onSuccess?.();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Voucher deployed to network.");
          form.reset();
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-black/5 rounded-3xl overflow-hidden">
          <CardHeader className="bg-black text-white p-8">
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Ticket className="h-6 w-6 text-white/40" />
              {isEditing ? "Modify Voucher" : "Generate Voucher"}
            </CardTitle>
            <CardDescription className="text-white/40 font-medium uppercase text-[10px] tracking-widest">
              Economic stimulus for botanical procurement.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black/60 font-bold uppercase tracking-widest text-[10px]">
                      Voucher Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.G. DOCTASIMO20"
                        {...field}
                        className="bg-black/[0.02] border-black/10 focus:border-black rounded-xl py-6 h-auto transition-all font-mono font-bold uppercase"
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] uppercase font-bold text-black/20 ">
                      Case-insensitive alphanumeric key.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-black/5 bg-black/[0.01] p-6">
                    <div className="space-y-0.5">
                      <FormLabel className="text-black/60 font-bold uppercase tracking-widest text-[10px]">
                        Active Status
                      </FormLabel>
                      <FormDescription className="text-[10px] uppercase font-bold text-black/20 ">
                        Enable/disable voucher immediately.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 data-[state=checked]:bg-black"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black/60 font-bold uppercase tracking-widest text-[10px]">
                      Reduction Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-black/[0.02] border-black/10 focus:border-black rounded-xl h-14 transition-all">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-black/10">
                        <SelectItem value="PERCENT">PERCENTAGE (%)</SelectItem>
                        <SelectItem value="FIXED">FIXED AMOUNT ($)</SelectItem>
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
                    <FormLabel className="text-black/60 font-bold uppercase tracking-widest text-[10px]">
                      Incentive Value
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                        className="bg-black/[0.02] border-black/10 focus:border-black rounded-xl py-6 h-auto transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black/60 font-bold uppercase tracking-widest text-[10px]">
                      Termination Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="bg-black/[0.02] border-black/10 focus:border-black rounded-xl py-6 h-auto transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="bg-black/[0.02] p-8 flex justify-between gap-4 border-t border-black/5">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-black/10 hover:bg-black hover:text-white px-8 h-12 transition-all font-bold uppercase text-[10px] tracking-widest"
              onClick={() => form.reset()}
            >
              Flush Form
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-black hover:bg-black/90 text-white rounded-xl px-12 h-12 font-black transition-all group active:scale-95 uppercase text-[10px] tracking-widest"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Processing...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Logic" : "Deploy Voucher"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
