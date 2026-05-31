"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import {
  ShoppingBag,
  Menu,
  MessageSquare,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
} from "@/lib/icons";
import { useTranslations } from "next-intl";
import { useCart } from "@/store/use-cart";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useSession, signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationBell } from "@/components/layout/notification-bell";
import { UserRole } from "@/lib/rbac/types";

const STAFF_ROLES = new Set<UserRole>([
  UserRole.ADMIN,
  UserRole.SALES,
  UserRole.DELIVERY,
]);

function isStaffRole(role: string | undefined): boolean {
  if (!role) return false;
  return STAFF_ROLES.has(role.toUpperCase() as UserRole);
}

function ProfileSkeleton() {
  return (
    <Skeleton
      className="h-9 w-9 shrink-0 rounded-full"
      aria-hidden
      aria-label="Loading profile"
    />
  );
}

export function StorefrontNavbar() {
  const t = useTranslations("navigation");
  const { data: session, status } = useSession();
  const isSessionLoading = status === "loading";
  const user = session?.user;
  const isStaff = isStaffRole(user?.role);
  const isCustomer =
    !!user && (user.role === UserRole.CUSTOMER || !isStaff);

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

  const signInClassName = cn(
    "px-5 py-2.5 text-[11px] font-semibold transition-all rounded-full border",
    headerActive
      ? "bg-primary text-white border-primary"
      : "bg-white/10 text-primary border-primary/20 hover:bg-white/20",
  );

  return (
    <header className="fixed top-0 z-50 w-full px-4 sm:px-6 md:px-8 lg:px-12 pt-2 sm:pt-4 transition-all duration-500">
      <div
        className={cn(
          "mx-auto max-w-7xl w-full rounded-full transition-all duration-500 border overflow-hidden",
          headerActive
            ? "bg-white/80 backdrop-blur-2xl border-black/8 ring-1 ring-black/4"
            : "bg-white/10 backdrop-blur-md border-white/15 sm:border-white/10",
        )}
      >
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 md:px-6">
          <div className="flex-1 flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "p-2.5 rounded-full transition-colors",
                    headerActive
                      ? "hover:bg-primary/5 text-primary"
                      : "hover:bg-white/10 text-primary",
                  )}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white border-black/5 p-0">
                <SheetHeader className="p-6 border-b border-black/5 items-start">
                  <SheetTitle className="text-primary font-bold text-xl tracking-tight">
                    Doctasimo
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4 gap-2">
                  {[
                    { name: t("home"), href: "/" },
                    { name: t("shop"), href: "/products" },
                    { name: t("about"), href: "/about" },
                    { name: t("blog"), href: "/blog" },
                    { name: t("contact"), href: "/contact" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-3 text-sm font-semibold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                    >
                      {link.name}
                    </Link>
                  ))}

                  {isSessionLoading && (
                    <div className="mt-2 pt-2 border-t border-black/5 space-y-2 px-4">
                      <Skeleton className="h-10 w-full rounded-xl" />
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                  )}

                  {!isSessionLoading && user && (
                    <div className="mt-2 pt-2 border-t border-black/5 space-y-1">
                      {isStaff && (
                        <Link
                          href="/admin"
                          className="px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition-all flex items-center gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          {t("dashboard")}
                        </Link>
                      )}
                      <Link
                        href="/account"
                        className="px-4 py-3 text-sm font-semibold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all block"
                      >
                        {t("myAccount")}
                      </Link>
                      <Link
                        href="/account/settings"
                        className="px-4 py-3 text-sm font-semibold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        {t("profileSettings")}
                      </Link>
                      {isCustomer && (
                        <Link
                          href="/consultation"
                          className="px-4 py-3 text-sm font-semibold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all block"
                        >
                          {t("consultation")}
                        </Link>
                      )}
                    </div>
                  )}

                  {!isSessionLoading && !user && (
                    <div className="mt-4 pt-4 border-t border-black/5 flex flex-col gap-3">
                      <Link
                        href="/login"
                        className="px-4 py-3 text-sm font-semibold text-primary/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                      >
                        {t("signIn")}
                      </Link>
                      <Link
                        href="/register"
                        className="px-4 py-3 text-sm font-semibold bg-primary text-white rounded-xl text-center active:scale-95 transition-transform"
                      >
                        {t("signUp")}
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/products"
                className="px-3 py-1.5 text-sm font-semibold text-black rounded-full transition-colors hover:text-primary"
              >
                {t("shop")}
              </Link>
              <Link
                href="/blog"
                className="px-3 py-1.5 text-sm font-semibold text-black rounded-full transition-colors hover:text-primary"
              >
                {t("blog")}
              </Link>
              {!isSessionLoading && user && isStaff && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 text-sm font-semibold text-black rounded-full transition-colors hover:text-primary inline-flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {t("dashboard")}
                </Link>
              )}
            </nav>
          </div>

          <div className="flex-none flex justify-center absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center group">
              <img
                src="/logo-minimized.png"
                alt="Doctasimo Logo"
                className="h-11 sm:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4">
            <Link
              href="/cart"
              className={cn(
                "relative p-2.5 rounded-full transition-all active:scale-90",
                headerActive
                  ? "bg-primary/5 text-primary hover:bg-primary/10"
                  : "bg-white/10 text-primary hover:bg-white/20",
              )}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 min-h-4 min-w-4 h-4 px-1 flex items-center justify-center rounded-full p-0 text-[8px] font-semibold border border-white bg-primary text-white leading-none">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {isSessionLoading ? (
              <ProfileSkeleton />
            ) : user ? (
              <>
                <NotificationBell headerActive={headerActive} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center outline-none group"
                      aria-label={t("account")}
                    >
                      <Avatar className="h-9 w-9 border-2 border-black/10 transition-all group-hover:border-primary/50">
                        <AvatarImage
                          src={user.image || undefined}
                          alt={user.name || ""}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-[10px]">
                          {user.name?.slice(0, 2).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-lg border border-black/8 bg-white p-2 shadow-sm"
                  >
                    <DropdownMenuLabel className="px-2 py-2">
                      {user.name ? (
                        <p className="text-xs font-semibold text-black">
                          {user.name}
                        </p>
                      ) : (
                        <Skeleton className="h-3.5 w-24 rounded" />
                      )}
                      {user.email ? (
                        <p className="text-[10px] font-medium text-black/40 truncate">
                          {user.email}
                        </p>
                      ) : (
                        <Skeleton className="h-3 w-32 rounded mt-1.5" />
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-black/5" />
                    <DropdownMenuGroup className="p-1">
                      {isStaff && (
                        <DropdownMenuItem
                          asChild
                          className="rounded-md px-2 py-2 text-xs font-semibold focus:bg-primary/5 focus:text-primary"
                        >
                          <Link href="/admin">
                            <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
                            {t("dashboard")}
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        asChild
                        className="rounded-md px-2 py-2 text-xs font-semibold focus:bg-primary/5 focus:text-primary"
                      >
                        <Link href="/account">
                          <User className="mr-2 h-3.5 w-3.5" />
                          {t("myAccount")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="rounded-md px-2 py-2 text-xs font-semibold focus:bg-primary/5 focus:text-primary"
                      >
                        <Link href="/account/settings">
                          <Settings className="mr-2 h-3.5 w-3.5" />
                          {t("profileSettings")}
                        </Link>
                      </DropdownMenuItem>
                      {isCustomer && (
                        <DropdownMenuItem
                          asChild
                          className="rounded-md px-2 py-2 text-xs font-semibold bg-primary/5 text-primary focus:bg-primary/5 focus:text-primary"
                        >
                          <Link href="/consultation">
                            <MessageSquare className="mr-2 h-3.5 w-3.5" />
                            {t("consultation")}
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-black/5" />
                    <DropdownMenuItem
                      className="rounded-md px-2 py-2 text-xs font-semibold text-primary focus:bg-primary/5 focus:text-primary"
                      onClick={() => signOut({ callbackUrl: "/en/login" })}
                    >
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login" className={signInClassName}>
                {t("signIn")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
