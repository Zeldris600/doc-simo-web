"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import {
  User,
  LogOut,
  ShoppingBag,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Globe,
  ChevronDown,
} from "@/lib/icons";
import { useTranslations } from "next-intl";
import { useCart } from "@/store/use-cart";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";
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
import { NotificationBell } from "@/components/layout/notification-bell";

export function StorefrontNavbar() {
  const t = useTranslations("navigation");
  const { data: session } = useSession();
  const user = session?.user;
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/en" || pathname === "/fr";

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerActive = isScrolled || !isHome;

  return (
    <header className="fixed top-0 z-50 w-full px-4 sm:px-6 md:px-8 lg:px-12 pt-2 sm:pt-4 transition-all duration-500">
      {/* Inset pill bar */}
      <div
        className={cn(
          "mx-auto max-w-7xl w-full rounded-full transition-all duration-500 border",
          headerActive
            ? "bg-white/80 backdrop-blur-2xl border-black/8 ring-1 ring-black/4"
            : "bg-white/10 backdrop-blur-md border-white/15 sm:border-white/10",
        )}
      >
        <div className="flex h-11 sm:h-12 items-center justify-between px-2 sm:px-2.5 md:px-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 group shrink-0 min-w-0"
          >
            <span className="font-medium text-base sm:text-lg text-primary leading-none">
              Doctasimo
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-0.5 sm:gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium transition-all rounded-full cursor-pointer",
                      headerActive
                        ? "text-foreground hover:text-primary hover:bg-primary/5"
                        : "text-primary hover:bg-black/5",
                    )}
                  >
                    <Link href="/">{t("home")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium transition-all rounded-full cursor-pointer",
                      headerActive
                        ? "text-foreground hover:text-primary hover:bg-primary/5"
                        : "text-primary hover:bg-black/5",
                    )}
                  >
                    <Link href="/products">{t("shop")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium transition-all rounded-full cursor-pointer",
                      headerActive
                        ? "text-foreground hover:text-primary hover:bg-primary/5"
                        : "text-primary hover:bg-black/5",
                    )}
                  >
                    <Link href="/about">{t("about")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium transition-all rounded-full cursor-pointer",
                      headerActive
                        ? "text-foreground hover:text-primary hover:bg-primary/5"
                        : "text-primary hover:bg-black/5",
                    )}
                  >
                    <Link href="/blog">{t("blog")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium transition-all rounded-full cursor-pointer",
                      headerActive
                        ? "text-foreground hover:text-primary hover:bg-primary/5"
                        : "text-primary hover:bg-black/5",
                    )}
                  >
                    <Link href="/contact">{t("contact")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors",
                    headerActive ? "hover:bg-black/5" : "hover:bg-white/10",
                  )}
                >
                  <Globe
                    className={cn(
                      "h-3.5 w-3.5",
                      headerActive ? "text-foreground/60" : "text-white/80",
                    )}
                  />
                  <ReactCountryFlag
                    svg
                    countryCode={pathname?.startsWith("/fr") ? "FR" : "GB"}
                    aria-label={
                      pathname?.startsWith("/fr") ? "France" : "United Kingdom"
                    }
                    style={{
                      width: "1.05em",
                      height: "1.05em",
                      borderRadius: "9999px",
                    }}
                  />
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 opacity-70",
                      headerActive ? "text-foreground/60" : "text-white/80",
                    )}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-44 border-primary/10 shadow-2xl shadow-primary/5 rounded-2xl p-2 bg-white"
              >
                <DropdownMenuLabel className="text-[10px] font-black tracking-wider uppercase text-black/40 px-2 py-1.5">
                  Language
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-[#f5faf6] focus:text-primary rounded-xl mt-1 py-2 px-3 transition-colors"
                >
                  <Link
                    href="/"
                    locale="en"
                    className="flex items-center gap-3 font-bold text-sm text-black/70"
                  >
                    <ReactCountryFlag
                      svg
                      countryCode="GB"
                      aria-label="United Kingdom"
                      className="rounded-sm"
                    />
                    English
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-[#f5faf6] focus:text-primary rounded-xl py-2 px-3 transition-colors"
                >
                  <Link
                    href="/"
                    locale="fr"
                    className="flex items-center gap-3 font-bold text-sm text-black/70"
                  >
                    <ReactCountryFlag
                      svg
                      countryCode="FR"
                      aria-label="France"
                      className="rounded-sm"
                    />
                    Français
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-1.5 rounded-full bg-primary/5 hover:bg-primary/10 text-primary/80 transition-all">
                  <Menu className="h-3.5 w-3.5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white border-black/5 p-0">
                <SheetHeader className="p-6 border-b border-black/5 items-start">
                  <SheetTitle className="text-primary font-medium text-xl">
                    Doctasimo
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4 gap-2">
                  <Link
                    href="/"
                    className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {t("home")}
                  </Link>
                  <Link
                    href="/products"
                    className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {t("shop")}
                  </Link>
                  <Link
                    href="/about"
                    className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {t("about")}
                  </Link>
                  <Link
                    href="/blog"
                    className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {t("blog")}
                  </Link>
                  <Link
                    href="/contact"
                    className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {t("contact")}
                  </Link>

                  {user && (
                    <div className="mt-2 pt-2 border-t border-black/5 flex flex-col gap-1">
                      <Link
                        href="/account"
                        className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                      >
                        {t("myAccount")}
                      </Link>
                    </div>
                  )}

                  {!user && (
                    <div className="mt-4 pt-4 border-t border-black/5 flex flex-col gap-3">
                      <Link
                        href="/login"
                        className="px-4 py-3 text-sm font-medium text-primary/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                      >
                        {t("signIn")}
                      </Link>
                      <Link
                        href="/register"
                        className="px-4 py-3 text-sm font-medium bg-primary text-white rounded-xl text-center active:scale-95 transition-transform"
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
              className={cn(
                "relative p-1.5 rounded-full transition-all active:scale-90",
                headerActive
                  ? "bg-primary/5 text-primary/80 hover:bg-primary/10"
                  : "bg-black/5 text-primary hover:bg-black/10",
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 min-h-4 min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full p-0 text-[9px] font-medium border border-white bg-primary text-white leading-none">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {user ? <NotificationBell headerActive={headerActive} /> : null}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 outline-none group">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-black/10 transition-all group-hover:border-primary/50 rounded-md">
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-[10px] sm:text-xs">
                        {user.name?.slice(0, 2) || "JD"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={6}
                  className="w-53 rounded-lg border border-black/10 bg-white p-0.5 shadow-sm"
                >
                  <DropdownMenuLabel className="px-2.5 py-2">
                    <div className="flex flex-col gap-0.5">
                      <p className="truncate text-xs font-semibold leading-tight text-black">
                        {user.name}
                      </p>
                      <p className="truncate text-[11px] font-medium text-black/45">
                        {user.email || "Patient Member"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-0 bg-black/5" />
                  <DropdownMenuGroup className="py-0.5">
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-md px-2 py-1.5 text-xs focus:bg-primary/5 focus:text-primary"
                    >
                      <Link href="/account">
                        <User className="mr-2 h-3.5 w-3.5" />
                        <span className="font-medium">{t("account")}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-md bg-primary/5 px-2 py-1.5 text-xs text-primary focus:bg-primary/5 focus:text-primary"
                    >
                      <Link href="/consultation">
                        <MessageSquare className="mr-2 h-3.5 w-3.5" />
                        <span className="font-semibold">Consultation</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "ADMIN" && (
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-md px-2 py-1.5 text-xs focus:bg-primary/5 focus:text-primary"
                      >
                        <Link href="/admin">
                          <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="my-0 bg-black/5" />
                  <DropdownMenuItem
                    className="mt-0 cursor-pointer rounded-md px-2 py-1.5 text-xs text-primary focus:bg-primary/5 focus:text-primary"
                    onClick={() => signOut({ callbackUrl: "/en/login" })}
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    <span className="font-medium">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/consultation"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-primary/80 hover:text-primary transition-all rounded-full hover:bg-primary/5 border border-primary/20"
                >
                  <MessageSquare className="h-3 w-3 shrink-0" />
                  Consultation
                </Link>
                <Link
                  href="/login"
                  className="px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-primary/80 hover:text-primary transition-all rounded-full hover:bg-primary/5"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/register"
                  className="px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-white bg-primary hover:bg-[#142c1b] transition-all rounded-full active:scale-95"
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
