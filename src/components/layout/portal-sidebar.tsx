"use client";

import * as React from "react";
import {
  MessageSquare,
  Settings2,
  SquareTerminal,
  Ticket,
} from "@/lib/icons";

import Image from "next/image";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { useCan } from "@/hooks/use-can";
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


export function SupportSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useCan();
  
  const portalUser = {
    name: user?.name || "Customer User",
    email: user?.email || "customer@doctasimo.com",
    avatar: user?.image || "/avatars/customer.jpg",
  };

  const navMain = [
    {
      title: "Dashboard",
      url: "/support",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Support Tickets",
      url: "/support/tickets",
      icon: Ticket,
    },
    {
      title: "Messages",
      url: "/support/messages",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      url: "/support/settings",
      icon: Settings2,
    },
  ];

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
                  DOCTASIMO
                </span>
                <span className="truncate text-[10px] font-bold text-muted-foreground uppercase">
                  Support Center
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={portalUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
