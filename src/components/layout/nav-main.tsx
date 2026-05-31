"use client";

import * as React from "react";
import { ChevronRight, type IconType } from "@/lib/icons";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type NavSubItem = {
  title: string;
  url: string;
  icon?: IconType;
};

type NavMainItem = {
  title: string;
  url: string;
  icon?: IconType;
  isActive?: boolean;
  items?: NavSubItem[];
};

const collapsedMenuContentClass =
  "min-w-[11rem] rounded-lg border border-white/10 bg-[#1A4D2E] text-white p-1 shadow-md";

const collapsedMenuItemClass =
  "cursor-pointer rounded-md text-white/90 focus:bg-white/10 focus:text-white data-[highlighted]:bg-white/10 data-[highlighted]:text-white";

function isPathActive(pathname: string, href: string) {
  const path = pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
  if (href === "/admin") {
    return path === "/admin" || path === "/admin/";
  }
  return path === href || path.startsWith(`${href}/`);
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const pathname = usePathname() ?? "";
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const subItems = item.items ?? [];
          const hasSubItems = subItems.length > 0;
          const sectionActive =
            item.isActive ||
            subItems.some((sub) => isPathActive(pathname, sub.url));

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={sectionActive}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          if (isCollapsed) {
            return (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      isActive={sectionActive}
                      className={cn(
                        "text-white/70 hover:bg-white/10 hover:text-white",
                        sectionActive && "bg-white/10 text-white",
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span className="sr-only">{item.title}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    sideOffset={8}
                    className={collapsedMenuContentClass}
                  >
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-white/50">
                      {item.title}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10 -mx-1" />
                    {subItems.map((subItem) => {
                      const subActive = isPathActive(pathname, subItem.url);
                      return (
                        <DropdownMenuItem
                          key={subItem.title}
                          asChild
                          className={cn(
                            collapsedMenuItemClass,
                            subActive && "bg-white/10 text-white",
                          )}
                        >
                          <Link
                            href={subItem.url}
                            className="flex w-full items-center gap-2"
                          >
                            {subItem.icon && (
                              <subItem.icon className="h-4 w-4 shrink-0 opacity-80" />
                            )}
                            <span>{subItem.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={sectionActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={sectionActive}
                    className="text-white/70 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="border-white/10">
                    {subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isPathActive(pathname, subItem.url)}
                          className="text-white/70 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white"
                        >
                          <Link href={subItem.url}>
                            {subItem.icon && (
                              <subItem.icon className="h-4 w-4" />
                            )}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
