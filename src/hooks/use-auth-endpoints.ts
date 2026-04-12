import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { 
 SendOtpDto, 
 VerifyOtpDto, 
 RequestPasswordResetDto, 
 ResetPasswordPhoneDto,
 SignUpDto
} from "@/types/auth";
import { ApiError } from "@/types/api";

export const useSendOtp = <TError = ApiError>(opt?: UseMutationOptions<Awaited<ReturnType<typeof AuthService.sendOtp>>, TError, SendOtpDto>) => {
 return useMutation({
 mutationFn: (data: SendOtpDto) => AuthService.sendOtp(data),
 ...opt,
 });
};

export const useVerifyPhoneOtp = <TError = ApiError>(opt?: UseMutationOptions<Awaited<ReturnType<typeof AuthService.verifyPhoneOtp>>, TError, VerifyOtpDto>) => {
 return useMutation({
 mutationFn: (data: VerifyOtpDto) => AuthService.verifyPhoneOtp(data),
 ...opt,
 });
};

export const useRequestPasswordReset = <TError = ApiError>(opt?: UseMutationOptions<Awaited<ReturnType<typeof AuthService.requestPasswordReset>>, TError, RequestPasswordResetDto>) => {
 return useMutation({
 mutationFn: (data: RequestPasswordResetDto) => AuthService.requestPasswordReset(data),
 ...opt,
 });
};

export const useResetPasswordPhone = <TError = ApiError>(opt?: UseMutationOptions<Awaited<ReturnType<typeof AuthService.resetPasswordPhone>>, TError, ResetPasswordPhoneDto>) => {
 return useMutation({
 mutationFn: (data: ResetPasswordPhoneDto) => AuthService.resetPasswordPhone(data),
 ...opt,
 });
};

export const useSignUp = <TError = ApiError>(opt?: UseMutationOptions<Awaited<ReturnType<typeof AuthService.signUp>>, TError, SignUpDto>) => {
 return useMutation({
 mutationFn: (data: SignUpDto) => AuthService.signUp(data),
 ...opt,
 });
};

type AuthSessionData = Awaited<ReturnType<typeof AuthService.getSession>>;

/** GET `/api/auth/get-session` — Better Auth session (cookies or Bearer). */
export function useBetterAuthGetSession(
  options?: Omit<
    UseQueryOptions<AuthSessionData, ApiError>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<AuthSessionData, ApiError>({
    queryKey: ["better-auth", "session"],
    queryFn: () => AuthService.getSession() as Promise<AuthSessionData>,
    ...options,
  });
}
