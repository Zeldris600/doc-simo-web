
import { AxiosError } from "axios";

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
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string | null;
  city?: string;
  region?: string;
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

export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  deliveryAddress?: {
    address?: string;
    city?: string;
    region?: string;
    phone?: string;
  };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
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
}

export interface AnalyticsOverview {
  revenue: number;
  total_orders: number;
  notifications_count: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: { name: string } | string;
  salesCount: number;
  totalRevenue: number;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export type ApiError = AxiosError<{
  status: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
}>;
