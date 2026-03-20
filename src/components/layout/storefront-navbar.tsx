"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import {
  User,
  LogOut,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ShoppingBag,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCart } from "@/store/use-cart";
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
import { useSession, signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function StorefrontNavbar() {
  const t = useTranslations("navigation");
  const { data: session } = useSession();
  const user = session?.user;
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Top Bar */}
      <div className="w-full bg-[#173b27] text-white/40 py-2 border-b border-white/5">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[10px] font-bold">
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-white transition-colors">
              <Twitter className="h-3.5 w-3.5 fill-current" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Facebook className="h-3.5 w-3.5 fill-current" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Instagram className="h-3.5 w-3.5" />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Linkedin className="h-3.5 w-3.5 fill-current" />
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                locale="en"
                className="hover:text-white transition-colors"
              >
                EN
              </Link>
              <span className="text-white/10 font-normal">|</span>
              <Link
                href="/"
                locale="fr"
                className="hover:text-white transition-colors"
              >
                FR
              </Link>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span>XAF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full bg-primary text-white border-b border-white/5">
        <div className="container mx-auto max-w-7xl flex h-20 items-center justify-between px-2 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1 rounded-xl bg-white transition-all group-hover:scale-110 active:scale-95 overflow-hidden">
              <Image
                src="/icon.png"
                alt="Doctasimo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="font-black text-xl tracking-tighter text-white">
              Doctasimo
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className="px-5 py-2.5 text-xs font-medium text-white hover:text-white hover:bg-white/5 rounded-full transition-all"
                  >
                    <Link href="/">{t("home")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className="px-5 py-2.5 text-xs font-medium text-white hover:text-white hover:bg-white/5 rounded-full transition-all"
                  >
                    <Link href="/products">{t("shop")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className="px-5 py-2.5 text-xs font-medium text-white hover:text-white hover:bg-white/5 rounded-full transition-all "
                  >
                    <Link href="/about">{t("about")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className="px-5 py-2.5 text-xs font-medium text-white hover:text-white hover:bg-white/5 rounded-full transition-all"
                  >
                    <Link href="/contact">{t("contact")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-5">
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 transition-all">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-primary border-white/5 p-0"
              >
                <SheetHeader className="p-6 border-b border-white/5 items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-xl bg-white overflow-hidden">
                      <Image
                        src="/icon.png"
                        alt="Doctasimo"
                        width={32}
                        height={32}
                      />
                    </div>
                    <SheetTitle className="text-white font-black tracking-tighter text-xl">
                      Doctasimo
                    </SheetTitle>
                  </div>
                </SheetHeader>
                <div className="flex flex-col p-4 gap-2">
                  <Link
                    href="/"
                    className="px-4 py-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    {t("home")}
                  </Link>
                  <Link
                    href="/products"
                    className="px-4 py-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    {t("shop")}
                  </Link>
                  <Link
                    href="/about"
                    className="px-4 py-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    {t("about")}
                  </Link>
                  <Link
                    href="/contact"
                    className="px-4 py-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    {t("contact")}
                  </Link>
                  {!user && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                      <Link
                        href="/login"
                        className="px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        {t("signIn")}
                      </Link>
                      <Link
                        href="/register"
                        className="px-4 py-3 text-sm font-medium bg-white text-primary rounded-xl text-center active:scale-95 transition-transform"
                      >
                        {t("signUp")}
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10  hover:text-white transition-all active:scale-90"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px] font-bold border-2 border-primary bg-white text-primary">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 outline-none group">
                    <Avatar className="h-10 w-10 border border-white/20 transition-all group-hover:border-white/50 rounded-xl">
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="bg-white/10 text-white font-bold text-xs">
                        {user.name?.slice(0, 2) || "JD"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-xl p-2 shadow-xl border-black/5 bg-white"
                >
                  <DropdownMenuLabel className="px-3 py-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-black leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs font-medium text-black/40">
                        {user.email || "Patient Member"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black/5" />
                  <DropdownMenuGroup className="py-2">
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg px-3 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                    >
                      <Link href="/account">
                        <User className="mr-3 h-4 w-4" />
                        <span className="font-medium text-sm">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "ADMIN" && (
                      <DropdownMenuItem
                        asChild
                        className="rounded-lg px-3 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                      >
                        <Link href="/admin">
                          <LayoutDashboard className="mr-3 h-4 w-4" />
                          <span className="font-medium text-sm">Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-black/5" />
                  <DropdownMenuItem
                    className="text-primary focus:bg-primary/5 focus:text-primary cursor-pointer rounded-lg px-3 py-2.5 mt-1 transition-colors"
                    onClick={() => signOut({ callbackUrl: "/en/login" })}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium text-sm">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-xs font-bold text-white/80 hover:text-white transition-all rounded-full hover:bg-white/5"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-xs font-bold text-primary bg-white hover:bg-gray-50 transition-all rounded-full active:scale-95"
                >
                  {t("signUp")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
