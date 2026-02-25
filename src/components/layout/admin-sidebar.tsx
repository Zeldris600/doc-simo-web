"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { Leaf } from "lucide-react";

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
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
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
        },
        {
          title: "Add Product",
          url: "/admin/products/new",
        },
        {
          title: "Categories",
          url: "/admin/categories",
        },
        {
          title: "Inventory",
          url: "/admin/inventory",
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
        },
        {
          title: "Invoices",
          url: "/admin/invoices",
        },
        {
          title: "Discounts",
          url: "/admin/discounts",
        },
      ],
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: Bot,
      items: [
        {
          title: "All Customers",
          url: "/admin/customers",
        },
        {
          title: "Segments",
          url: "/admin/customers/segments",
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
        },
        {
          title: "Shipping",
          url: "/admin/settings/shipping",
        },
        {
          title: "Taxes",
          url: "/admin/settings/taxes",
        },
        {
          title: "Locations",
          url: "/admin/settings/locations",
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
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Leaf className="size-5" />
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
