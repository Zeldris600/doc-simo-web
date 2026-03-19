"use client";

import * as React from "react";
import {
  LifeBuoy,
  MessageSquare,
  Settings2,
  SquareTerminal,
  Ticket,
  User,
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

const data = {
  user: {
    name: "Support Agent",
    email: "agent@support.com",
    avatar: "/avatars/support.jpg",
  },
  teams: [
    {
      name: "Support Desk",
      logo: LifeBuoy,
      plan: "Pro",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/portal",
      icon: SquareTerminal,
      isActive: true,
      items: [], // Flat link
    },
    {
      title: "Tickets",
      url: "/portal/tickets",
      icon: Ticket,
      items: [], // Flat link
    },
    {
      title: "Messages",
      url: "/portal/messages",
      icon: MessageSquare,
      items: [], // Flat link
    },
    {
      title: "Customers",
      url: "/portal/customers",
      icon: User,
      items: [], // Flat link
    },
    {
      title: "Settings",
      url: "/portal/settings",
      icon: Settings2,
      items: [], // Flat link
    },
  ],
  projects: [], // No projects for portal needed, or we can add some if required
};

export function PortalSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent">
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg overflow-hidden">
                <Image src="/icon.png" alt="Doctasimo" width={40} height={40} className="object-contain scale-110" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-black uppercase text-primary tracking-tight">
                  DOCTASIME
                </span>
                <span className="truncate text-[10px] font-bold text-muted-foreground uppercase">
                  Support Portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.projects.length > 0 && <NavProjects projects={data.projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
