"use client";

import React, { useState } from "react";
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
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { UserRole } from "@/lib/rbac/types";
import { Loader2, Mail, Shield, User as UserIcon } from "lucide-react";

export default function AdminUsersPage() {
  const [params, setParams] = useState<{ page: number; limit: number; role?: UserRole }>({ page: 1, limit: 10 });
  const { data: usersResponse, isLoading } = useUsers(params);
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateRole(
      { id: userId, role: newRole },
      {
        onSuccess: () => {
          toast.success("User role updated successfully.");
        },
        onError: () => {
          toast.error("Failed to update user role.");
        },
      }
    );
  };

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    setParams(prev => {
      const next = typeof updater === 'function' 
        ? updater({ pageIndex: prev.page - 1, pageSize: prev.limit }) 
        : updater;
      return {
        ...prev,
        page: next.pageIndex + 1,
        limit: next.pageSize
      };
    });
  };

  const handleRoleFilter = (value: string) => {
    setParams(prev => ({
      ...prev,
      page: 1,
      role: value === "ALL" ? undefined : value as UserRole
    }));
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-gray-100 shadow-none rounded-lg ">
              <AvatarImage src={user.image} alt={user.name || ""} />
              <AvatarFallback className="bg-primary/5 text-primary font-black rounded-lg">
                {(user.name || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-black text-black uppercase text-[11px] tracking-tight">{user.name || "Anonymous User"}</span>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Mail className="h-3 w-3" />
                <span className="text-[10px] font-bold lowercase tracking-tighter">{user.email}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Registry Role",
      cell: ({ row }) => {
        const user = row.original;
        const roles = Object.values(UserRole);
        
        return (
          <div className="flex items-center gap-4">
            <Select 
              defaultValue={user.role} 
              onValueChange={(val) => handleRoleChange(user.id, val as UserRole)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[140px] h-9 bg-white border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest ">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100">
                {roles.map((r) => (
                  <SelectItem key={r} value={r} className="text-[10px] font-bold uppercase tracking-widest ">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {user.role === UserRole.ADMIN && (
              <Shield className="h-3 w-3 text-primary animate-pulse" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Enlisted On",
      cell: ({ row }) => (
        <span className="text-[10px] font-bold text-black/40 tracking-tight uppercase">
          {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : "Initial Sync"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: () => (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-none font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full">
          Active
        </Badge>
      ),
    },
  ];

  const users = usersResponse?.data || [];
  const totalCount = usersResponse?.total || 0;

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto px-4">
      <DashboardHeader
        title="User Registry"
        description="Monitor and manage all synchronized patient and staff accounts."
      />

      <div className="bg-white border-none rounded-2xl p-2">
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mr-2">Filter by Role:</span>
           <Select
             value={params.role || "ALL"}
             onValueChange={handleRoleFilter}
           >
             <SelectTrigger className="w-[180px] h-9 bg-white border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest">
               <SelectValue placeholder="All Roles" />
             </SelectTrigger>
             <SelectContent className="rounded-xl border-gray-100">
               <SelectItem value="ALL" className="text-[10px] font-bold uppercase tracking-widest">All Roles</SelectItem>
               {Object.values(UserRole).map((role) => (
                 <SelectItem key={role} value={role} className="text-[10px] font-bold uppercase tracking-widest">
                   {role}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
        </div>

        <DataTable 
          columns={columns} 
          data={users} 
          isLoading={isLoading}
          searchKey="name"
          pagination={{
            pageIndex: params.page - 1,
            pageSize: params.limit
          }}
          pageCount={Math.ceil(totalCount / params.limit)}
          onPaginationChange={handlePaginationChange}
          action={
            <div className="flex items-center gap-2 bg-black/[0.02] px-4 py-2 rounded-xl border border-black/5">
               <UserIcon className="h-4 w-4 text-black/40" />
               <span className="text-[10px] font-black uppercase tracking-widest text-black/40"> Total Users: {totalCount}</span>
            </div>
          }
        />
      </div>
      
      {isUpdating && (
        <div className="fixed bottom-8 right-8 bg-black text-white px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-10">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest ">Updating Registry Node...</span>
        </div>
      )}
    </div>
  );
}
