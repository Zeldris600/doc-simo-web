import { Link } from "@/i18n/routing";
import { ArrowLeft, Home, Leaf } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16 bg-background text-foreground">
      <div className="flex flex-col items-center text-center max-w-md space-y-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Leaf className="h-7 w-7" aria-hidden />
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Error 404
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button asChild className="rounded-full font-semibold gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full font-semibold gap-2">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
              Browse products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
