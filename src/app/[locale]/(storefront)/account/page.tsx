"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMe, useUpdateMe } from "@/hooks/use-user";
import { useMyOrders } from "@/hooks/use-order";
import { useFavouriteProducts } from "@/hooks/use-favourites";
import { useCart } from "@/store/use-cart";
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
import {
  Loader2,
  User,
  MapPin,
  ShieldCheck,
  Fingerprint,
  ShoppingBag,
  Heart,
  RotateCcw,
  ExternalLink,
  Package,
  ArrowRight,
  ArrowUpRight,
  Bell,
} from "@/lib/icons";
import { NotificationPreferences } from "@/components/account/notification-preferences";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import type { Order, Product } from "@/types/api";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function formatMoney(n: number, currency = "XAF") {
  return `XAF ${n.toLocaleString()}`;
}

export default function AccountDashboardPage() {
  const t = useTranslations("account.dashboard");
  const { data: user, isLoading: isLoadingUser } = useMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMe();
  const { data: ordersPage, isLoading: loadingOrders } = useMyOrders();
  const { favourites, isLoading: loadingFavourites } = useFavouriteProducts();
  const { addItem } = useCart();

  const [reorderingId, setReorderingId] = useState<string | null>(null);

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

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfile(data, {
      onSuccess: () => toast.success("Profile updated successfully."),
      onError: () => toast.error("Could not update profile."),
    });
  };

  const handleReorder = (order: Order) => {
    setReorderingId(order.id);
    try {
      for (const item of order.items || []) {
        if (item.product) {
          addItem(item.product as Product, item.quantity);
        }
      }
      toast.success("Items added to cart");
    } catch {
      toast.error("Failed to reorder");
    } finally {
      setTimeout(() => setReorderingId(null), 800);
    }
  };

  if (isLoadingUser || loadingOrders || loadingFavourites) {
    return (
      <div className="container mx-auto max-w-6xl px-4 pt-28 pb-12">
        <PageSkeleton />
      </div>
    );
  }

  // OrderService.getMe() already unwraps to Order[] via response.data.data.data
  const orders: Order[] = Array.isArray(ordersPage) ? ordersPage : (ordersPage?.data || []);
  const totalSpent = orders.reduce((sum: number, o: Order) => sum + Number(o.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F5F7F5]">
      <div className="container mx-auto max-w-6xl px-4 pt-36 pb-20">
        {/* Page Header — matches admin DashboardHeader style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-medium text-black">My Account</h1>
            <p className="text-[10px] font-medium text-gray-400 mt-0.5">
              Manage your orders, saved items, and delivery details.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/products">
              <Button className="font-medium rounded-xl h-9 px-4 text-xs">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Stats — same pattern as admin stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {[
            {
              title: "Total Orders",
              value: orders.length.toString(),
              description: "Placed to date",
              icon: ShoppingBag,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              title: "Total Spent",
              value: formatMoney(totalSpent),
              description: "Lifetime value",
              icon: ArrowUpRight,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              title: "Saved Items",
              value: favourites.length.toString(),
              description: "In your wishlist",
              icon: Heart,
              color: "text-rose-600",
              bg: "bg-rose-50",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden group hover:shadow-md transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium text-black">{stat.value}</div>
                <p className="text-[10px] font-medium text-gray-400 mt-1 flex items-center gap-1">
                  {stat.description}
                  <ArrowUpRight className="h-2 w-2 text-emerald-500" />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs — clean, left-aligned, understated */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="bg-white border-none rounded-xl h-10 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.02)] w-auto mb-6">
            <TabsTrigger
              value="orders"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-xs gap-1.5 px-4 transition-all"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Orders
            </TabsTrigger>
            <TabsTrigger
              value="favourites"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-xs gap-1.5 px-4 transition-all"
            >
              <Heart className="h-3.5 w-3.5" /> Favourites
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-xs gap-1.5 px-4 transition-all"
            >
              <User className="h-3.5 w-3.5" /> Profile
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-xs gap-1.5 px-4 transition-all"
            >
              <Bell className="h-3.5 w-3.5" /> Alerts
            </TabsTrigger>
          </TabsList>

          {/* ─── Orders ─── */}
          <TabsContent value="orders">
            <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-gray-50 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-black">
                    Order History
                  </CardTitle>
                  <p className="text-[10px] font-medium text-gray-400">
                    Your recent purchases and their status
                  </p>
                </div>
                <span
                  className="text-[10px] font-medium text-primary"
                >
                  All orders shown below
                </span>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                      <Package className="h-7 w-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">
                      No orders yet
                    </p>
                    <p className="text-[10px] font-medium text-gray-300 mt-1">
                      Your order history will appear here
                    </p>
                    <Button asChild className="mt-4 rounded-xl font-medium h-9 px-4 text-xs">
                      <Link href="/products">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 py-3 text-[11px] font-semibold text-black">
                            Product
                          </th>
                          <th className="px-6 py-3 text-[11px] font-semibold text-black">
                            Status
                          </th>
                          <th className="px-6 py-3 text-[11px] font-semibold text-black text-right">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-[11px] font-semibold text-black text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 10).map((order: Order) => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-black text-xs truncate max-w-[200px]">
                                    {order.items?.[0]?.product?.name ||
                                      "Order #" +
                                        (order.orderNumber?.slice(-8) ||
                                          order.id.slice(0, 8))}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString(
                                      undefined,
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={cn(
                                  "border-none font-medium text-[9px] px-2 py-0 h-5 rounded-full text-white",
                                  order.status === "DELIVERED"
                                    ? "bg-[#166534]"
                                    : order.status === "PENDING"
                                    ? "bg-[#D97706]"
                                    : order.status === "SHIPPED"
                                    ? "bg-[#EA580C]"
                                    : order.status === "PROCESSING"
                                    ? "bg-blue-600"
                                    : "bg-gray-400"
                                )}
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-medium text-black text-xs">
                                {formatMoney(Number(order.amount))}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {order.status === "PENDING" ? (
                                  <Button
                                    asChild
                                    size="sm"
                                    className="h-7 px-3 text-[10px] font-medium rounded-lg"
                                  >
                                    <Link href={`/checkout/${order.id}`}>
                                      Complete Payment
                                    </Link>
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-[10px] font-medium text-gray-500 hover:text-primary rounded-lg"
                                      onClick={() => handleReorder(order)}
                                      disabled={reorderingId === order.id}
                                    >
                                      {reorderingId === order.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <RotateCcw className="h-3 w-3" />
                                      )}
                                      <span className="ml-1">Reorder</span>
                                    </Button>
                                    <Link
                                      href={`/checkout/${order.id}`}
                                      className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-primary transition-colors"
                                    >
                                      <ArrowRight className="h-3 w-3" />
                                    </Link>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Favourites ─── */}
          <TabsContent value="favourites">
            <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-gray-50 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-black">
                    Saved Items
                  </CardTitle>
                  <p className="text-[10px] font-medium text-gray-400">
                    Products you&apos;ve added to your wishlist
                  </p>
                </div>
                <Link
                  href="/products"
                  className="text-[10px] font-medium text-primary hover:underline"
                >
                  Browse Products
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {favourites.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                      <Heart className="h-7 w-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">
                      No saved items
                    </p>
                    <p className="text-[10px] font-medium text-gray-300 mt-1">
                      Tap the heart icon on products to save them here
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 py-3 text-[11px] font-semibold text-black">
                            Product
                          </th>
                          <th className="px-6 py-3 text-[11px] font-semibold text-black text-right">
                            Price
                          </th>
                          <th className="px-6 py-3 text-[11px] font-semibold text-black text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {favourites.map((product: Product) => (
                          <tr
                            key={product.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                  <Image
                                    src={
                                      product.images?.[0] ||
                                      product.image ||
                                      "/placeholder.png"
                                    }
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="object-cover h-full w-full"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-black text-xs truncate max-w-[220px]">
                                    {product.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {product.category?.name || "Product"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-medium text-black text-xs">
                                {formatMoney(Number(product.price))}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                href={`/products/${product.id}`}
                                className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-primary transition-colors inline-flex"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Profile ─── */}
          <TabsContent value="profile">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onProfileSubmit)}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Left: Avatar */}
                <div className="space-y-6">
                  <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                    <CardHeader className="py-4 px-6 border-b border-gray-50">
                      <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-gray-400" /> Photo
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
                                className="rounded-xl h-48 w-48 mx-auto bg-gray-50 border-2 border-dashed border-gray-100 hover:border-primary/30 transition-all"
                              />
                            </FormControl>
                            <FormDescription className="text-[10px] font-medium text-gray-400 text-center">
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
                    className="w-full h-10 rounded-xl font-medium text-xs"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>

                {/* Right: Forms */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                    <CardHeader className="py-4 px-6 border-b border-gray-50">
                      <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" /> Personal
                        Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-medium text-gray-400">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. John Doe"
                                {...field}
                                className="bg-gray-50/50 border-gray-100 rounded-lg h-10 text-sm"
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
                              <FormLabel className="text-[10px] font-medium text-gray-400">
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+237 ..."
                                  {...field}
                                  className="bg-gray-50/50 border-gray-100 rounded-lg h-10 text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormItem>
                          <FormLabel className="text-[10px] font-medium text-gray-400">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              value={user?.email || ""}
                              disabled
                              className="bg-gray-100 border-gray-100 rounded-lg h-10 text-sm text-gray-400"
                            />
                          </FormControl>
                        </FormItem>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                    <CardHeader className="py-4 px-6 border-b border-gray-50">
                      <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" /> Delivery
                        Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-5">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-medium text-gray-400">
                              Street Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main Street"
                                {...field}
                                className="bg-gray-50/50 border-gray-100 rounded-lg h-10 text-sm"
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
                              <FormLabel className="text-[10px] font-medium text-gray-400">
                                City
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Yaoundé"
                                  {...field}
                                  className="bg-gray-50/50 border-gray-100 rounded-lg h-10 text-sm"
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
                              <FormLabel className="text-[10px] font-medium text-gray-400">
                                Region
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Centre"
                                  {...field}
                                  className="bg-gray-50/50 border-gray-100 rounded-lg h-10 text-sm"
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
          </TabsContent>

          {/* ─── Alerts ─── */}
          <TabsContent value="alerts">
            <NotificationPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
