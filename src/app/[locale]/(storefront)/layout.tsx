import { StorefrontNavbar } from "@/components/layout/storefront-navbar";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { FloatingConsultation } from "@/components/shared/floating-consultation";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <StorefrontNavbar />
      <main className="flex-1 w-full flex flex-col">{children}</main>
      <StorefrontFooter />
      <FloatingConsultation />
    </div>
  );
}
