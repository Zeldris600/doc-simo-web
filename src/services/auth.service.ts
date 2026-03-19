import {
 SendOtpDto,
 VerifyOtpDto,
 RequestPasswordResetDto,
 ResetPasswordPhoneDto,
 AuthResponse,
 VerifyPhoneOtpResponse,
 SignUpDto,
} from "../types/auth";
import { api } from "./api";

export const AuthService = {
 // Original endpoints (if still needed)
 resetPassword: async (data: {
 newPassword: string;
 token: string | null;
 }) => {
 const response = await api.post<AuthResponse>("/auth/reset-password", data);
 return response.data;
 },
 verifyPassword: async (data: { password: string }) => {
 const response = await api.post<AuthResponse>(
 "/auth/verify-password",
 data,
 );
 return response.data;
 },

 signUp: async (data: SignUpDto) => {
 const response = await api.post<AuthResponse>("/auth/sign-up/email", data);
 return response.data;
 },

 // New Phone-based Endpoints
 sendOtp: async (data: SendOtpDto) => {
 const response = await api.post<{ message: string }>(
 "/auth/phone-number/send-otp",
 data,
 );
 return response.data;
 },

 verifyPhoneOtp: async (data: VerifyOtpDto) => {
 const response = await api.post<VerifyPhoneOtpResponse>(
 "/auth/phone-number/verify",
 data,
 );
 return response.data;
 },

 requestPasswordReset: async (data: RequestPasswordResetDto) => {
 const response = await api.post<AuthResponse>(
 "/auth/phone-number/request-password-reset",
 data,
 );
 return response.data;
 },

 resetPasswordPhone: async (data: ResetPasswordPhoneDto) => {
 const response = await api.post<AuthResponse>(
 "/auth/phone-number/reset-password",
 data,
 );
 return response.data;
 },
};
