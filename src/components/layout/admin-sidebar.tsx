"use client";

import * as React from "react";
import {
  BookOpen,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  LineChart,
  Package,
  PlusCircle,
  FolderTree,
  Warehouse,
  ShoppingBag,
  FileText,
  Percent,
  Users,
  Settings,
  Truck,
  MapPin,
  Globe,
} from "lucide-react";

import Image from "next/image";

import { NavMain } from "@/components/layout/nav-main";
import { NavProjects } from "@/components/layout/nav-projects";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Admin User",
    email: "admin@ecommerce.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "My Store",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
          icon: LineChart,
        },
      ],
    },
    {
      title: "Catalog",
      url: "/admin/products",
      icon: BookOpen,
      items: [
        {
          title: "Products",
          url: "/admin/products",
          icon: Package,
        },
        {
          title: "Add Product",
          url: "/admin/products/new",
          icon: PlusCircle,
        },
        {
          title: "Categories",
          url: "/admin/categories",
          icon: FolderTree,
        },
        {
          title: "Inventory",
          url: "/admin/inventory",
          icon: Warehouse,
        },
      ],
    },
    {
      title: "Sales",
      url: "/admin/orders",
      icon: PieChart,
      items: [
        {
          title: "Orders",
          url: "/admin/orders",
          icon: ShoppingBag,
        },
        {
          title: "Invoices",
          url: "/admin/invoices",
          icon: FileText,
        },
        {
          title: "Discounts",
          url: "/admin/discounts",
          icon: Percent,
        },
      ],
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: Users,
      items: [
        {
          title: "All Customers",
          url: "/admin/customers",
          icon: Users,
        },
        {
          title: "Segments",
          url: "/admin/customers/segments",
          icon: Users,
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/settings",
          icon: Settings,
        },
        {
          title: "Shipping",
          url: "/admin/settings/shipping",
          icon: Truck,
        },
        {
          title: "Taxes",
          url: "/admin/settings/taxes",
          icon: Globe,
        },
        {
          title: "Locations",
          url: "/admin/settings/locations",
          icon: MapPin,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Storefront",
      url: "/",
      icon: Frame,
    },
    {
      name: "Marketing",
      url: "/admin/marketing",
      icon: PieChart,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent">
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg overflow-hidden">
                <Image 
                  src="/icon.png" 
                  alt="Doctasimo" 
                  width={40} 
                  height={40} 
                  className="object-contain scale-110"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-black uppercase text-primary tracking-tight">
                  DOCTASIME
                </span>
                <span className="truncate text-[10px] font-bold text-muted-foreground uppercase">
                  Management
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
