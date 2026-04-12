import { UserRole } from "@/lib/rbac/types";

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  role?: UserRole | string;
  customer?: {
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
    metadata?: unknown;
    createdAt?: string;
    updatedAt?: string;
  };
  address?: string | null;
  city?: string | null;
  region?: string | null;
  deliveryAddress?: {
    phone?: string;
  };
  token?: string;
}

export interface Session {
 id: string;
 expiresAt: string;
 token: string;
 createdAt: string;
 updatedAt: string;
 ipAddress?: string;
 userAgent?: string;
 userId: string;
}

export interface AuthResponse {
 status: boolean;
 message?: string;
}

export interface VerifyPhoneOtpResponse extends AuthResponse {
 token: string;
 user: User;
}

/** Axios `response.data` for `POST .../phone-number/verify`. */
export type PhoneSessionApiBody = VerifyPhoneOtpResponse;

export interface SendOtpDto {
 phoneNumber: string;
}

export interface VerifyOtpDto {
  phoneNumber: string;
  code: string;
  /** Better Auth: verify only, no session */
  disableSession?: boolean;
  /** Better Auth: when logged in, verifying a new number */
  updatePhoneNumber?: boolean;
}

export interface RequestPasswordResetDto {
 phoneNumber: string;
}

export interface ResetPasswordPhoneDto {
 phoneNumber: string;
 otp: string;
 newPassword: string;
}

export interface SignUpDto {
  name: string;
  email: string;
  /** Omit for phone-first signup; backend should accept users without a password. */
  password?: string;
  phoneNumber: string;
  rememberMe?: boolean;
}

