"use client";

import { useMutation, useQuery, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { UpdateUserDto, UserService } from "@/services/user.service";
import { User } from "@/types/auth";

export function useMe() {
 return useQuery({
 queryKey: ["user", "me"],
 queryFn: UserService.getMe,
 });
}

export function useUpdateMe<TError = Error>(opt?: UseMutationOptions<User, TError, UpdateUserDto>) {
 const queryClient = useQueryClient();
 
 return useMutation({
 mutationFn: (data: UpdateUserDto) => UserService.updateMe(data),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["user", "me"] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}

export function useUsers(params?: { role?: string; page?: number; limit?: number }) {
 return useQuery({
 queryKey: ["users", params],
 queryFn: () => UserService.getAll(params as any),
 });
}

export function useUser(id: string) {
 return useQuery({
 queryKey: ["user", id],
 queryFn: () => UserService.getById(id),
 enabled: !!id,
 });
}

export function useUpdateUserRole<TError = Error>(opt?: UseMutationOptions<User, TError, { id: string; role: string }>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: ({ id, role }) => UserService.updateRole(id, role),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["users"] });
 queryClient.invalidateQueries({ queryKey: ["user", data.id] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}
