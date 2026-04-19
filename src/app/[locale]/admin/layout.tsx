import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminPermissionShell } from "@/components/rbac/admin-permission-shell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminNotifications } from "@/components/layout/admin-notifications";
import { SalesOrdersPusherBridge } from "@/components/realtime/sales-orders-pusher-bridge";
import { User } from "@/lib/icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-none bg-white px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-black transition-colors" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 h-4 bg-gray-200"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/admin"
                    className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block">
                  <span className="text-gray-300">/</span>
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-medium text-black">
                    Management
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <AdminNotifications />
            <div className="hidden h-8 w-px bg-gray-100 md:block" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-xs font-medium text-black">System Admin</span>
                <span className="text-[10px] font-medium text-green-500">Online</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-8 p-8 pt-6 bg-[#F5F7F5] min-h-[calc(100vh-4rem)]">
          <SalesOrdersPusherBridge />
          <AdminPermissionShell>{children}</AdminPermissionShell>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
