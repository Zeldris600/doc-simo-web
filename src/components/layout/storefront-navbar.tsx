"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import {
  User,
  LogOut,
  Facebook,
  Instagram,
  ShoppingBag,
  LayoutDashboard,
  Menu,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCart } from "@/store/use-cart";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-500",
      headerActive ? "translate-y-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5" : ""
    )}>
      {/* Top Bar */}
      <div className={cn(
        "w-full transition-all duration-500 overflow-hidden",
        headerActive ? "h-0 opacity-0 py-0 border-none" : "bg-black/5 backdrop-blur-sm text-primary/60 py-2 border-b border-primary/5"
      )}>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[10px] font-bold">
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-[#173b27] transition-colors">
              <Facebook className="h-3.5 w-3.5 fill-current" />
            </Link>
            <Link href="#" className="hover:text-[#173b27] transition-colors">
              <Instagram className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                locale="en"
                className="hover:text-[#173b27] transition-colors"
              >
                EN
              </Link>
              <span className="text-[#173b27]/20 font-normal">|</span>
              <Link
                href="/"
                locale="fr"
                className="hover:text-[#173b27] transition-colors"
              >
                FR
              </Link>
            </div>
            <div className="flex items-center gap-1.5 hover:text-[#173b27] transition-colors">
              <span>XAF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={cn(
        "w-full transition-all duration-500 border-b",
        headerActive 
          ? "bg-white/70 backdrop-blur-2xl py-0 border-black/5" 
          : "bg-transparent py-2 border-transparent"
      )}>
        <div className="container mx-auto max-w-7xl flex h-20 items-center justify-between px-2 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1 rounded-xl bg-primary/5 transition-all group-hover:scale-110 active:scale-95 overflow-hidden">
              <Image
                src="/icon.png"
                alt="Doctasimo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="font-black text-xl tracking-tighter text-primary">
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
                    className={cn(
                      "px-5 py-2.5 text-xs font-bold transition-all rounded-full cursor-pointer",
                      headerActive 
                        ? "text-foreground hover:text-primary hover:bg-primary/5" 
                        : "text-primary hover:bg-black/5"
                    )}
                  >
                    <Link href="/">{t("home")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "px-5 py-2.5 text-xs font-bold transition-all rounded-full cursor-pointer",
                      headerActive 
                        ? "text-foreground hover:text-primary hover:bg-primary/5" 
                        : "text-primary hover:bg-black/5"
                    )}
                  >
                    <Link href="/products">{t("shop")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "px-5 py-2.5 text-xs font-bold transition-all rounded-full cursor-pointer",
                      headerActive 
                        ? "text-foreground hover:text-primary hover:bg-primary/5" 
                        : "text-primary hover:bg-black/5"
                    )}
                  >
                    <Link href="/about">{t("about")}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "px-5 py-2.5 text-xs font-bold transition-all rounded-full cursor-pointer",
                      headerActive 
                        ? "text-foreground hover:text-primary hover:bg-primary/5" 
                        : "text-primary hover:bg-black/5"
                    )}
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
                <button className="md:hidden p-2.5 rounded-full bg-primary/5 hover:bg-primary/10 text-primary/80 transition-all">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-white border-black/5 p-0"
              >
                <SheetHeader className="p-6 border-b border-black/5 items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-xl bg-primary/5 overflow-hidden">
                      <Image
                        src="/icon.png"
                        alt="Doctasimo"
                        width={32}
                        height={32}
                      />
                    </div>
                    <SheetTitle className="text-primary font-black tracking-tighter text-xl">
                      Doctasimo
                    </SheetTitle>
                  </div>
                </SheetHeader>
                <div className="flex flex-col p-4 gap-2">
                  <Link
                    href="/"
                    className="px-4 py-3 text-sm font-bold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {t("home")}
                  </Link>
                  <Link
                    href="/products"
                    className="px-4 py-3 text-sm font-bold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {t("shop")}
                  </Link>
                  <Link
                    href="/account/orders"
                    className="px-4 py-3 text-sm font-bold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {t("orders")}
                  </Link>
                  <Link
                    href="/about"
                    className="px-4 py-3 text-sm font-bold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {t("about")}
                  </Link>
                  <Link
                    href="/contact"
                    className="px-4 py-3 text-sm font-bold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                  >
                    {t("contact")}
                  </Link>


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
                "relative p-2.5 rounded-full transition-all active:scale-90",
                headerActive ? "bg-primary/5 text-primary/80 hover:bg-primary/10" : "bg-black/5 text-primary hover:bg-black/10"
              )}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px] font-bold border-2 border-white bg-primary text-white">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 outline-none group">
                    <Avatar className="h-10 w-10 border border-black/10 transition-all group-hover:border-primary/50 rounded-xl">
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {user.name?.slice(0, 2) || "JD"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl p-1 shadow-xl border-black/5 bg-white"
                >
                  <DropdownMenuLabel className="px-3 py-3">
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
                  <DropdownMenuGroup className="py-1">
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg px-3 py-2 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                    >
                      <Link href="/account">
                        <User className="mr-3 h-4 w-4" />
                        <span className="font-medium text-sm">{t("account")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg px-3 py-2 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                    >
                      <Link href="/account/orders">
                        <ShoppingBag className="mr-3 h-4 w-4" />
                        <span className="font-medium text-sm">{t("orders")}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="rounded-lg px-3 py-2 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors text-primary bg-primary/5"
                    >
                      <Link href="/consultation">
                        <MessageSquare className="mr-3 h-4 w-4" />
                        <span className="font-bold text-sm">Consultation</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "ADMIN" && (
                      <DropdownMenuItem
                        asChild
                        className="rounded-lg px-3 py-2 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
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
                    className="text-primary focus:bg-primary/5 focus:text-primary cursor-pointer rounded-lg px-3 py-2 mt-0.5 transition-colors"
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
                  className="px-6 py-2.5 text-xs font-bold text-primary/80 hover:text-primary transition-all rounded-full hover:bg-primary/5"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-primary hover:bg-[#142c1b] transition-all rounded-full active:scale-95 shadow-lg shadow-primary/20"
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
