import { PortalSidebar } from "@/components/layout/portal-sidebar";
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

export default function PortalLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <SidebarProvider>
 <PortalSidebar />
 <SidebarInset>
 <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-none bg-white px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
 href="/portal"
 className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
 >
 Portal
 </BreadcrumbLink>
 </BreadcrumbItem>
 <BreadcrumbSeparator className="hidden md:block">
 <span className="text-gray-300">/</span>
 </BreadcrumbSeparator>
 <BreadcrumbItem>
 <BreadcrumbPage className="text-xs font-bold uppercase tracking-wider text-black">
 Dashboard
 </BreadcrumbPage>
 </BreadcrumbItem>
 </BreadcrumbList>
 </Breadcrumb>
 </div>
 <div className="flex items-center gap-4">
 <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 px-3 py-1.5 rounded">
 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
 System Status:
 </span>
 <span className="ml-2 flex h-2 w-2 rounded-full bg-green-500"></span>
 <span className="ml-2 text-[10px] font-bold text-green-600 uppercase">
 Operational
 </span>
 </div>
 </div>
 </header>
 <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
 </SidebarInset>
 </SidebarProvider>
 );
}
