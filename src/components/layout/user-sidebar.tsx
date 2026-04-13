"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  User,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
  Globe,
  ShoppingBag,
  Bell,
  Trash2,
  List
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
import { useSession } from "next-auth/react";

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = session?.user;

  const navUser = {
    name: user?.name || "Member",
    email: user?.email || "patient@doctasimo.com",
    avatar: user?.image || "/avatars/user.jpg",
  };

  const navMain = [
    {
      title: "Dashboard",
      url: "/account",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/account",
          icon: LayoutDashboard,
        },
        {
          title: "Orders",
          url: "/account/orders",
          icon: Package,
        },
        {
          title: "Favourites",
          url: "/account", // Anchored to dashboard for now
          icon: Heart,
        },
      ],
    },
    {
      title: "Wellness",
      url: "/consultation",
      icon: MessageSquare,
      items: [
        {
          title: "Consultations",
          url: "/consultation",
          icon: MessageSquare,
        },
      ],
    },
    {
      title: "Settings",
      url: "/account/profile",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/account/profile",
          icon: User,
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
    {
      name: "Cart",
      url: "/cart",
      icon: ShoppingBag,
    },
    {
      name: "More",
      url: "#",
      icon: List,
    }
  ];

  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader className="bg-[#1A4D2E] text-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-white uppercase tracking-wider">
                  DOCTASIMO
                </span>
                <span className="truncate text-[10px] font-medium text-white/50">
                  User Dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#1A4D2E] text-white/70">
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter className="bg-[#1A4D2E] border-t border-white/5">
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
