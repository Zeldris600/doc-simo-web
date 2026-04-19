"use client";

import * as React from "react";
import Image from "next/image";
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
  LifeBuoy,
  MessageSquare,
  Send,
  type IconType,
} from "@/lib/icons";

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
import { useCan } from "@/hooks/use-can";
import { Permission } from "@/lib/rbac/types";

type NavItem = {
  title: string;
  url: string;
  icon?: IconType;
  isActive?: boolean;
  permission?: Permission;
  items?: {
    title: string;
    url: string;
    icon?: IconType;
    permission?: Permission;
  }[];
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, can } = useCan();

  const navUser = {
    name: user?.name || "System User",
    email: user?.email || "user@doctasimo.com",
    avatar: user?.image || "/avatars/admin.jpg",
  };

  const navMain: NavItem[] = [
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
          permission: "analytics:read",
        },
      ],
    },
    {
      title: "Catalog",
      url: "/admin/products",
      icon: BookOpen,
      permission: "products:read",
      items: [
        {
          title: "Products",
          url: "/admin/products",
          icon: Package,
          permission: "products:read",
        },
        {
          title: "Add Product",
          url: "/admin/products/new",
          icon: PlusCircle,
          permission: "products:write",
        },
        {
          title: "Categories",
          url: "/admin/categories",
          icon: FolderTree,
          permission: "categories:read",
        },
      ],
    },
    {
      title: "Sales",
      url: "/admin/orders",
      icon: PieChart,
      permission: "orders:read",
      items: [
        {
          title: "Orders",
          url: "/admin/orders",
          icon: ShoppingBag,
          permission: "orders:read",
        },
        {
          title: "Discounts",
          url: "/admin/discounts",
          icon: Percent,
          permission: "discounts:read",
        },
      ],
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: Users,
      permission: "customers:read",
      items: [
        {
          title: "All Customers",
          url: "/admin/customers",
          icon: Users,
          permission: "customers:read",
        },
      ],
    },
    {
      title: "Support",
      url: "/admin/support",
      icon: LifeBuoy,
      permission: "support:read",
      items: [
        {
          title: "Threads",
          url: "/admin/support",
          icon: MessageSquare,
          permission: "support:read",
        },
      ],
    },
    {
      title: "Content",
      url: "/admin/blog",
      icon: FileText,
      permission: "blog:write",
      items: [
        {
          title: "Blog posts",
          url: "/admin/blog",
          icon: FileText,
          permission: "blog:write",
        },
        {
          title: "New post",
          url: "/admin/blog/new",
          icon: PlusCircle,
          permission: "blog:write",
        },
      ],
    },
    {
      title: "Broadcasts",
      url: "/admin/broadcasts",
      icon: Send,
      permission: "notifications:write",
      items: [
        {
          title: "Notify users",
          url: "/admin/broadcasts",
          icon: Send,
          permission: "notifications:write",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Settings2,
      permission: "users:read",
      items: [
        {
          title: "Registry",
          url: "/admin/users",
          icon: Users,
          permission: "users:read",
        },
      ],
    },
  ];

  const projects = [
    {
      name: "Storefront",
      url: "/",
      icon: Globe,
    },
  ];

  // Helper function to filter recursive items
  const filterNavItems = (items: NavItem[]) => {
    return items
      .filter((item) => !item.permission || can(item.permission))
      .map((item) => ({
        ...item,
        items: item.items?.filter(
          (sub) => !sub.permission || can(sub.permission),
        ),
      }))
      .filter((item) => (item.items ? item.items.length > 0 : true));
  };

  const filteredNavMain = filterNavItems(navMain);

  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader className="bg-[#1A4D2E] text-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-white">
                  DOCTASIMO
                </span>
                <span className="truncate text-[10px] font-medium text-white/50">
                  Management
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#1A4D2E] text-white/70">
        <NavMain items={filteredNavMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter className="bg-[#1A4D2E] border-t border-white/5">
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
