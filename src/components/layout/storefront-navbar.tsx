"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  LogOut,
  Settings,
  ShoppingCart,
  Leaf,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface StorefrontNavbarProps {
  isAuthenticated?: boolean;
}

export function StorefrontNavbar({
  isAuthenticated = false,
}: StorefrontNavbarProps) {
  // Use state or props to toggle auth state for demonstration
  const [isAuth, setIsAuth] = React.useState(isAuthenticated);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#0b1f14] text-white/60 py-2 border-b border-white/5">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">
              <Twitter className="h-4 w-4 fill-current" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Facebook className="h-4 w-4 fill-current" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Linkedin className="h-4 w-4 fill-current" />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="?lang=en"
                className="hover:text-white transition-colors"
              >
                EN
              </Link>
              <span className="text-white/20">|</span>
              <Link
                href="?lang=fr"
                className="hover:text-white transition-colors"
              >
                FR
              </Link>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <span className="font-semibold">USD</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full bg-primary text-white shadow-sm border-b border-white/5">
        <div className="container mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-3 h-20 items-center px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-xl bg-white transition-transform group-hover:rotate-12">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight uppercase whitespace-nowrap text-white">
                DOCTASIME
              </span>
            </Link>
          </div>

          {/* Center: Navigation Menu */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/products" legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all">
                      Shop
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all">
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all">
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Cart and Auth */}
          <div className="flex items-center justify-end gap-6">
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all"
            >
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px] font-bold border-2 border-primary bg-white text-primary">
                2
              </Badge>
            </Link>

            {isAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 outline-none group">
                    <Avatar className="h-10 w-10 ring-2 ring-transparent transition-all group-hover:ring-white/50 rounded-full">
                      <AvatarImage src="/avatars/user.jpg" alt="User" />
                      <AvatarFallback className="bg-white/10 text-white">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-2xl p-2 shadow-2xl border-border/50"
                >
                  <DropdownMenuLabel className="px-3 py-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">Jane Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        jane.doe@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup className="py-2">
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl px-3 py-2.5 cursor-pointer"
                    >
                      <Link href="/account">
                        <User className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl px-3 py-2.5 cursor-pointer"
                    >
                      <Link href="/account/orders">
                        <ShoppingCart className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl px-3 py-2.5 cursor-pointer"
                    >
                      <Link href="/account/settings">
                        <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-xl px-3 py-2.5 mt-1"
                    onClick={() => setIsAuth(false)}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-bold">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-sm font-medium text-white/80 hover:text-white transition-all rounded-full hover:bg-white/10"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAuth(true); // For demo purposes
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-sm font-medium text-primary bg-white hover:bg-gray-50 hover:shadow-lg transition-all rounded-full"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
