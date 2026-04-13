"use client";

import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/user.service";
import { UserRole } from "@/lib/rbac/types";

export function useUsers(params?: {
  role?: UserRole;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => UserService.getAll(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserService.getById(id),
    enabled: !!id,
  });
}
