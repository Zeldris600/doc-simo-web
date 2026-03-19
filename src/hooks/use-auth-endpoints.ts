import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { 
 SendOtpDto, 
 VerifyOtpDto, 
 RequestPasswordResetDto, 
 ResetPasswordPhoneDto,
 SignUpDto
} from "@/types/auth";

export const useSendOtp = <TError = Error>(opt?: UseMutationOptions<Awaited<ReturnType<typeof AuthService.sendOtp>>, TError, SendOtpDto>) => {
 return useMutation({
 mutationFn: (data: SendOtpDto) => AuthService.sendOtp(data),
 ...opt,
 });
};

export const useVerifyPhoneOtp = <TError = Error>(opt?: UseMutationOptions<Awaited<ReturnType<typeof AuthService.verifyPhoneOtp>>, TError, VerifyOtpDto>) => {
 return useMutation({
 mutationFn: (data: VerifyOtpDto) => AuthService.verifyPhoneOtp(data),
 ...opt,
 });
};

export const useRequestPasswordReset = <TError = Error>(opt?: UseMutationOptions<Awaited<ReturnType<typeof AuthService.requestPasswordReset>>, TError, RequestPasswordResetDto>) => {
 return useMutation({
 mutationFn: (data: RequestPasswordResetDto) => AuthService.requestPasswordReset(data),
 ...opt,
 });
};

export const useResetPasswordPhone = <TError = Error>(opt?: UseMutationOptions<Awaited<ReturnType<typeof AuthService.resetPasswordPhone>>, TError, ResetPasswordPhoneDto>) => {
 return useMutation({
 mutationFn: (data: ResetPasswordPhoneDto) => AuthService.resetPasswordPhone(data),
 ...opt,
 });
};

export const useSignUp = <TError = Error>(opt?: UseMutationOptions<Awaited<ReturnType<typeof AuthService.signUp>>, TError, SignUpDto>) => {
 return useMutation({
 mutationFn: (data: SignUpDto) => AuthService.signUp(data),
 ...opt,
 });
};
