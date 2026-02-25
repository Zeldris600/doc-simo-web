const fs = require("fs");
const path = require("path");

const baseDir = "/home/sundicode/Documents/doctasimo/web/src/app";

const routes = [
  // Storefront
  { path: "(storefront)/layout.tsx", isLayout: true, role: "store" },
  { path: "(storefront)/page.tsx", title: "Home" },
  { path: "(storefront)/products/page.tsx", title: "Products" },
  { path: "(storefront)/products/[id]/page.tsx", title: "Product Details" },
  { path: "(storefront)/categories/page.tsx", title: "Categories" },
  { path: "(storefront)/categories/[id]/page.tsx", title: "Category Details" },
  { path: "(storefront)/cart/page.tsx", title: "Cart" },
  { path: "(storefront)/checkout/page.tsx", title: "Checkout" },
  { path: "(auth)/login/page.tsx", title: "Login" },
  { path: "(auth)/register/page.tsx", title: "Register" },

  // Admin
  { path: "admin/page.tsx", title: "Admin Dashboard" },
  { path: "admin/products/page.tsx", title: "Admin Products" },
  { path: "admin/products/new/page.tsx", title: "Admin Add Product" },
  { path: "admin/products/[id]/page.tsx", title: "Admin Edit Product" },
  { path: "admin/categories/page.tsx", title: "Admin Categories" },
  { path: "admin/orders/page.tsx", title: "Admin Orders" },
  { path: "admin/orders/[id]/page.tsx", title: "Admin Order Details" },
  { path: "admin/customers/page.tsx", title: "Admin Customers" },
  { path: "admin/settings/page.tsx", title: "Admin Settings" },
  { path: "admin/analytics/page.tsx", title: "Admin Analytics" },
];

routes.forEach((route) => {
  const fullPath = path.join(baseDir, route.path);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let content = "";

  if (route.isLayout && route.role === "store") {
    content = `import Link from "next/link";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex gap-6 items-center">
          <Link href="/" className="font-bold text-xl text-primary">Store</Link>
          <nav className="flex gap-4">
            <Link href="/products" className="text-muted-foreground hover:text-foreground">Products</Link>
            <Link href="/categories" className="text-muted-foreground hover:text-foreground">Categories</Link>
          </nav>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/cart" className="text-muted-foreground hover:text-foreground">Cart</Link>
          <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Login</Link>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">{children}</main>
      <footer className="p-6 border-t text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} My Ecommerce Store
      </footer>
    </div>
  );
}`;
  } else {
    // Basic formatting for names
    const componentName = route.title.replace(/\W/g, "") + "Page";
    content = `export default function ${componentName}() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">${route.title}</h1>
      <div className="p-8 border rounded-lg bg-card text-card-foreground shadow-sm flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">Placeholder content for ${route.path}</p>
      </div>
    </div>
  );
}`;
  }

  // Rewrite standard page.tsx
  fs.writeFileSync(fullPath, content);
});

console.log("Routes generated successfully!");
