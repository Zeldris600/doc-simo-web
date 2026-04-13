/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosError } from "axios";

export interface WrappedData<T> {
  data: T;
}

export interface StandardResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  take: number;
  skip: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string | number;
  currency?: string;
  image?: string;
  images: string[];
  videos?: string[];
  inventoryLevel?: number;
  active: boolean;
  isHot?: boolean;
  isPromotion?: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
  availability?: boolean; // Legacy fallback
  /** From catalog API when product reviews are enabled */
  reviewCount?: number;
  averageRating?: number | null;
}

export interface ProductReviewUser {
  id: string;
  name: string;
  image: string | null;
}

export interface ProductReview {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user: ProductReviewUser;
}

export interface ProductReviewStats {
  reviewCount: number;
  averageRating: number | null;
}

export interface CreateProductReviewDto {
  rating: number;
  comment?: string;
}

export interface UpdateProductReviewDto {
  rating?: number;
  /** Omit to leave unchanged; send "" to clear */
  comment?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
}

export interface CustomerProfile {
  id: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  otpChannelPreference?: "whatsapp" | "sms";
  fcmTokens?: string[];
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
}

export interface UpdateCustomerProfileDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  region?: string;
  otpChannelPreference?: "whatsapp" | "sms";
  fcmTokens?: string[];
  metadata?: Record<string, unknown>;
}

export interface Discount {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: string | number;
  currency?: string;
  minOrderAmount?: number | null;
  maxUses?: number | null;
  usedCount?: number;
  startsAt?: string | null;
  expiresAt?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountDto {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  expiresAt?: string;
  maxUses?: number;
  minOrderAmount?: number;
}

export interface UpdateDiscountDto extends Partial<CreateDiscountDto> {
  active?: boolean;
}

export interface OrderLocation {
  id: string;
  lat: number;
  lng: number;
  source?: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  customerId?: string | null;
  amount: string | number;
  total?: number; // Legacy/fallback
  currency: string;
  status: OrderStatus;
  assignedToUserId?: string | null;
  shippingProofUrl?: string | null;
  deliveryAddress?: {
    address?: string;
    city?: string;
    region?: string;
    phone?: string;
  };
  discountId?: string | null;
  discountAmount?: string | number | null;
  metadata?: Record<string, unknown> | null;
  items: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
  customer?: CustomerProfile | null;
  locations?: OrderLocation[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number | string;
  metadata?: Record<string, unknown> | null;
  product?: Product;
}

export interface CreateOrderDto {
  items: { productId: string; quantity: number }[];
  deliveryAddress?: {
    address?: string;
    city?: string;
    region?: string;
    phone?: string;
  };
  code?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface AssignOrderDto {
  assigneeUserId: string;
}

export interface ShippingProofDto {
  proofUrl: string;
}

export interface PushOrderLocationDto {
  lat: number;
  lng: number;
  source?: string;
}

export interface Document {
  id: string;
  key: string;
  url: string;
  category: "image" | "video" | "pdf" | "invoice" | "other";
  isPublic: boolean;
  label?: string;
  createdAt: string;
}

export interface AnalyticsQueryDto {
  from?: string;
  to?: string;
  limit?: number;
}

export interface AnalyticsOverview {
  totalOrders: number;
  totalRevenue?: number;
  totalSpent?: number;
  currency: string;
  ordersByStatus: Record<string, number>;
  paymentsByStatus?: Record<string, number>;
  notificationsCount: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  productSlug?: string;
  quantitySold: number;
  revenue: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  currency: string;
  paidOrdersCount: number;
}

export interface OrdersAnalytics {
  totalOrders: number;
  ordersByStatus: Record<string, number>;
}

export interface RevenueBucket {
  period: string;
  revenue: number;
  paidOrders: number;
}

export interface DeliveryBucket {
  period: string;
  processing: number;
  shipped: number;
  delivered: number;
  gpsUpdates: number;
}

export interface UnifiedBucket {
  period: string;
  orders: number;
  revenue: number;
  paidOrders: number;
  delivery: {
    processing: number;
    shipped: number;
    delivered: number;
    gpsUpdates: number;
  };
}

export interface TimeSeriesResponse<T> {
  granularity: string;
  currency?: string;
  from: string;
  to: string;
  buckets: T[];
  totals: {
    orders?: number;
    revenue?: number;
    paidOrders?: number;
    delivery?: {
      processing: number;
      shipped: number;
      delivered: number;
      gpsUpdates: number;
    };
    [key: string]: any;
  };
}

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  status: "pending" | "success" | "failed";
  amount: number | string;
  currency: string;
  provider: string;
  transId: string;
  metadata?: {
    link?: string;
    dateInitiated?: string;
    [key: string]: unknown;
  } | null;
  createdAt: string;
  updatedAt: string;
  orderStatus: OrderStatus;
}

export type ApiResponse<T> = StandardResponse<T>;

export type ApiError = AxiosError<StandardResponse<never>>;
