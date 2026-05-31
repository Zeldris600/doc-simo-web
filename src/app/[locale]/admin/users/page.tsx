"use client";

import React, { useMemo, useState } from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef, PaginationState, Updater } from "@tanstack/react-table";
import { User } from "@/types/auth";
import { useUsers, useUpdateUserRole } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { UserRole } from "@/lib/rbac/types";
import { Loader2, Mail, Phone, Shield, User as UserIcon } from "@/lib/icons";
import { useCan } from "@/hooks/use-can";

export default function AdminUsersPage() {
  const { can } = useCan();
  const canManageRoles = can("users:manage_roles");

  const [params, setParams] = useState<{
    page: number;
    limit: number;
    role?: UserRole;
  }>({ page: 1, limit: 10 });
  const { data: usersResponse, isLoading } = useUsers(params);
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateRole(
      { id: userId, role: newRole },
      {
        onSuccess: () => toast.success("User role updated successfully."),
        onError: () => toast.error("Failed to update user role."),
      },
    );
  };

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    setParams((prev) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: prev.page - 1, pageSize: prev.limit })
          : updater;
      return {
        ...prev,
        page: next.pageIndex + 1,
        limit: next.pageSize,
      };
    });
  };

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        id: "avatar",
        header: "",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <Avatar className="h-10 w-10 border border-gray-100 rounded-lg">
              <AvatarImage src={user.image} alt={user.name || ""} />
              <AvatarFallback className="bg-primary/5 text-primary text-sm font-medium rounded-lg">
                {(user.name || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.name || "Anonymous User"}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 max-w-[220px]">
            <Mail className="h-4 w-4 shrink-0 text-black/35" />
            <span className="truncate">{row.original.email || "—"}</span>
          </div>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-black/35" />
            <span>{row.original.phoneNumber || "—"}</span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const user = row.original;
          const roles = Object.values(UserRole);

          return (
            <div className="flex items-center gap-2">
              {canManageRoles ? (
                <Select
                  defaultValue={user.role}
                  onValueChange={(val) =>
                    handleRoleChange(user.id, val as UserRole)
                  }
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[140px] h-9 text-sm">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r} className="text-sm">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {user.role}
                </Badge>
              )}
              {user.role === UserRole.ADMIN && (
                <Shield className="h-4 w-4 text-primary" />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {row.original.createdAt
              ? new Date(row.original.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: () => (
          <Badge className="bg-green-50 text-green-700 border-none text-xs px-3 py-1">
            Active
          </Badge>
        ),
      },
    ],
    [canManageRoles, isUpdating],
  );

  const users = usersResponse?.data || [];
  const totalCount = usersResponse?.total || 0;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="User Registry"
        description="Monitor and manage all synchronized patient and staff accounts."
      />

      <div className="rounded-xl border border-black/8 bg-white shadow-sm overflow-hidden p-4 sm:p-6">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          searchKeys={["name", "email", "phoneNumber", "role"]}
          searchPlaceholder="Search users…"
          filterSlot={
              <Select
                value={params.role || "ALL"}
                onValueChange={(value) =>
                  setParams((prev) => ({
                    ...prev,
                    page: 1,
                    role: value === "ALL" ? undefined : (value as UserRole),
                  }))
                }
              >
                <SelectTrigger className="h-10 w-[160px] shrink-0 text-sm" aria-label="Role">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All roles</SelectItem>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          }
          pagination={{
            pageIndex: params.page - 1,
            pageSize: params.limit,
          }}
          pageCount={Math.ceil(totalCount / params.limit) || 1}
          onPaginationChange={handlePaginationChange}
          action={
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg border border-black/5">
              <UserIcon className="h-4 w-4 text-black/40" />
              <span className="text-sm font-medium text-black/60">
                Total users: {totalCount}
              </span>
            </div>
          }
        />
      </div>

      {isUpdating && (
        <div className="fixed bottom-8 right-8 bg-black text-white px-6 py-4 rounded-xl flex items-center gap-4 shadow-2xl">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Updating role…</span>
        </div>
      )}
    </div>
  );
}
