"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { 
 ChevronLeft, 
 Package, 
 Truck, 
 CheckCircle2, 
 Clock, 
 XCircle, 
 MapPin, 
 Phone, 
 User as UserIcon,
 CreditCard,
 History,
 AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrder, useUpdateOrderStatus } from "@/hooks/use-order";
import { OrderStatus } from "@/types/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string; bg: string }> = {
 PENDING: { label: "PENDING", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
 PROCESSING: { label: "PROCESSING", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
 SHIPPED: { label: "SHIPPED", icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50" },
 DELIVERED: { label: "DELIVERED", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
 CANCELLED: { label: "CANCELLED", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
};

export default function AdminOrderDetailsPage() {
 const params = useParams();
 const router = useRouter();
 const id = params.id as string;
 const { data: order, isLoading } = useOrder(id);
 const updateStatusMutation = useUpdateOrderStatus();

 const handleStatusUpdate = (newStatus: OrderStatus) => {
 updateStatusMutation.mutate(
 { id, data: { status: newStatus } },
 {
 onSuccess: () => {
 toast.success(`Manifest status escalated to ${newStatus}.`);
 },
 }
 );
 };

 if (isLoading) {
 return (
 <div className="p-8 space-y-8 animate-in fade-in duration-1000">
 <div className="flex items-center gap-4">
 <Skeleton className="h-12 w-12 rounded-full" />
 <Skeleton className="h-10 w-[300px] rounded-xl" />
 </div>
 <div className="grid lg:grid-cols-3 gap-8">
 <Skeleton className="h-[400px] lg:col-span-2 rounded-lg" />
 <Skeleton className="h-[400px] rounded-lg" />
 </div>
 </div>
 );
 }

 if (!order) {
 return (
 <div className="flex flex-col items-center justify-center h-[600px] space-y-6">
 <AlertCircle className="h-20 w-20 text-black/10" />
 <h2 className="text-3xl font-black uppercase tracking-tighter ">Batch data nullified</h2>
 <Button variant="outline" onClick={() => router.back()} className="rounded-lg h-12 px-8 border-black/10 uppercase font-black text-[10px] tracking-widest">Return to Operations</Button>
 </div>
 );
 }

 const currentStatus = statusConfig[order.status];

 return (
 <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
 {/* Header */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-black/5">
 <div className="flex items-center gap-4">
 <Button 
 variant="outline" 
 size="icon" 
 className="rounded-full h-12 w-12 border-black/10 hover:bg-black hover:text-white transition-all group "
 onClick={() => router.back()}
 >
 <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
 </Button>
 <div>
 <h1 className="text-4xl font-black uppercase tracking-tighter text-black leading-none">Manifest: {order.id.slice(0, 8)}</h1>
 <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">Botanical batch deployment log.</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <Badge className={`rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none ${currentStatus.bg} ${currentStatus.color}`}>
 {currentStatus.label}
 </Badge>
 <span className="text-black/20 font-black uppercase text-[10px] tracking-widest">
 {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: '2-digit' }).format(new Date(order.createdAt))}
 </span>
 </div>
 </div>

 <div className="grid lg:grid-cols-3 gap-10">
 <div className="lg:col-span-2 space-y-10">
 {/* Order Items */}
 <Card className="border-black/5 rounded-lg overflow-hidden bg-white/50 backdrop-blur-md">
 <CardHeader className="bg-black text-white p-8">
 <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
 <Package className="h-6 w-6 text-white/40" />
 Batch Inventory
 </CardTitle>
 <CardDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest">
 Items secured for clinical delivery.
 </CardDescription>
 </CardHeader>
 <CardContent className="p-8 space-y-6">
 {order.items.map((item) => (
 <div key={item.id} className="flex items-center justify-between py-4 border-b border-black/5 last:border-0">
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 rounded-lg bg-black/[0.02] border border-black/5 flex items-center justify-center p-2 relative">
 {item.product?.image ? (
 <img src={item.product.image} alt="" className="object-contain h-full w-full" />
 ) : (
 <Package className="h-6 w-6 text-black/10" />
 )}
 <span className="absolute -top-2 -right-2 bg-black text-white h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black ">
 {item.quantity}
 </span>
 </div>
 <div>
 <h4 className="font-black uppercase tracking-tight text-lg">{item.product?.name || "Unknown Formulation"}</h4>
 <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Price Unit: ${item.price?.toFixed(2)}</p>
 </div>
 </div>
 <span className="text-xl font-black tracking-tighter text-black">${(item.price * item.quantity).toFixed(2)}</span>
 </div>
 ))}
 <div className="mt-10 p-8 rounded-lg bg-black text-white flex justify-between items-center transition-transform hover:scale-[1.01]">
 <div>
 <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Manifest Total Value</p>
 <h3 className="text-4xl font-black tracking-tighter ">Calculated Protocols</h3>
 </div>
 <span className="text-5xl font-black tracking-tighter">${order.total?.toFixed(2)}</span>
 </div>
 </CardContent>
 </Card>

 {/* Logistics Form */}
 <Card className="border-black/5 rounded-lg overflow-hidden bg-white">
 <CardHeader className="p-8 border-b border-black/5">
 <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
 <Truck className="h-6 w-6 text-black/20" />
 Logistics Command
 </CardTitle>
 </CardHeader>
 <CardContent className="p-8 grid grid-cols-2 md:grid-cols-5 gap-3">
 {(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as OrderStatus[]).map((status) => {
 const config = statusConfig[status];
 const isActive = order.status === status;
 return (
 <Button
 key={status}
 onClick={() => handleStatusUpdate(status)}
 disabled={updateStatusMutation.isPending}
 variant={isActive ? "default" : "outline"}
 className={`rounded-lg h-16 flex flex-col items-center justify-center gap-1 transition-all group active:scale-95 ${isActive ? "bg-black text-white " : "border-black/5 hover:border-black/20"}`}
 >
 <config.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-black/20 group-hover:text-black"} transition-colors`} />
 <span className="text-[8px] font-black uppercase tracking-widest">{config.label}</span>
 </Button>
 );
 })}
 </CardContent>
 </Card>
 </div>

 <div className="space-y-10">
 {/* Patient Details */}
 <Card className="border-black/5 rounded-lg overflow-hidden bg-white p-8 space-y-8">
 <div className="flex items-center gap-4">
 <div className="h-12 w-12 rounded-lg bg-black/[0.02] border border-black/5 flex items-center justify-center">
 <UserIcon className="h-6 w-6 text-black/20" />
 </div>
 <div>
 <CardTitle className="text-xl font-black uppercase tracking-tight ">Recipient Node</CardTitle>
 <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest leading-none mt-1 ">Verified Wellness Seeker</p>
 </div>
 </div>
 
 <div className="space-y-6">
 <div className="flex items-start gap-4">
 <MapPin className="h-4 w-4 text-black/20 mt-1" />
 <div className="space-y-1">
 <p className="text-black font-bold text-sm leading-snug">{order.deliveryAddress?.address || "No active coordinates specified."}</p>
 <p className="text-[10px] text-black/40 font-black uppercase tracking-widest">
 {order.deliveryAddress?.city}, {order.deliveryAddress?.region}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <Phone className="h-4 w-4 text-black/20" />
 <p className="text-sm font-black tracking-tight">{order.deliveryAddress?.phone || "N/A"}</p>
 </div>
 </div>

 <Button className="w-full bg-black hover:bg-black/90 text-white rounded-lg h-14 font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] ">
 Trace Location Protocol
 </Button>
 </Card>

 {/* Internal Manifest History (Mock) */}
 <Card className="border-black/5 rounded-lg overflow-hidden bg-black text-white p-8 space-y-8">
 <div className="flex items-center gap-4">
 <History className="h-6 w-6 text-white/40" />
 <CardTitle className="text-xl font-black uppercase tracking-tight ">Manifest Timeline</CardTitle>
 </div>
 <div className="space-y-6 relative before:absolute before:inset-0 before:left-2 before:w-px before:bg-white/10 ml-2 pl-8">
 <div className="relative before:absolute before:-left-[37px] before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-white before:">
 <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Protocol Initiated</p>
 <p className="text-xs font-bold mt-1">{new Intl.DateTimeFormat('en-US').format(new Date(order.createdAt))}</p>
 </div>
 <div className="relative before:absolute before:-left-[37px] before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-white/20">
 <p className="text-[8px] font-black text-white/40 uppercase tracking-widest ">Manifest Scaled to {order.status}</p>
 <p className="text-xs font-bold mt-1">Manual admin intervention</p>
 </div>
 </div>
 </Card>
 </div>
 </div>
 </div>
 );
}