"use client";

import { useParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import DashboardHeader from "@/components/dashboard-header";
import { useCustomer } from "@/hooks/use-customer";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Calendar,
} from "@/lib/icons";
import {
  customerEmail,
  customerFullName,
  customerImage,
  customerInitials,
  customerPhone,
} from "@/lib/customer-display";
import { useSupportThreads } from "@/hooks/use-support";
import { useCan } from "@/hooks/use-can";
import { toast } from "sonner";

export default function AdminCustomerProfilePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { can } = useCan();
  const canMessage = can("support:read");
  const { data: customer, isLoading } = useCustomer(id);
  const { data: threads = [] } = useSupportThreads(undefined, {
    enabled: canMessage,
  });

  const handleMessage = () => {
    if (!customer) return;
    const thread = threads.find((t) => t.customerUserId === customer.userId);
    if (thread) {
      router.push(`/admin/support/${thread.id}`);
      return;
    }
    toast.info(
      "No support conversation yet. The customer can start one from Consultation.",
    );
    router.push("/admin/support");
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          title="Customer not found"
          description="This profile may have been removed."
        />
        <Button asChild variant="outline" className="rounded-lg">
          <Link href="/admin/customers">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to customers
          </Link>
        </Button>
      </div>
    );
  }

  const name = customerFullName(customer);
  const email = customerEmail(customer);
  const phone = customerPhone(customer);
  const image = customerImage(customer);
  const location = [customer.city, customer.region].filter(Boolean).join(", ");

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="rounded-lg -ml-2">
          <Link href="/admin/customers">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Customers
          </Link>
        </Button>
      </div>

      <DashboardHeader
        title={name}
        description="Customer profile and contact details."
        action={
          canMessage ? (
            <Button
              type="button"
              className="rounded-lg h-10"
              onClick={handleMessage}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Message customer
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 border border-black/8 shadow-sm rounded-xl">
          <CardHeader className="items-center text-center pb-2">
            <Avatar className="h-20 w-20 border border-black/8 rounded-xl">
              {image ? <AvatarImage src={image} alt={name} /> : null}
              <AvatarFallback className="bg-primary/5 text-primary text-xl font-semibold rounded-xl">
                {customerInitials(customer)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg font-semibold pt-2">{name}</CardTitle>
            <p className="text-xs text-muted-foreground font-mono">
              ID {customer.id.slice(0, 12)}…
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-2 pb-6">
            {customer.otpChannelPreference && (
              <span className="inline-block text-xs font-medium uppercase bg-muted px-2.5 py-1 rounded-md">
                OTP: {customer.otpChannelPreference}
              </span>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-black/8 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <DetailRow icon={Mail} label="Email" value={email} />
            <DetailRow icon={Phone} label="Phone" value={phone} />
            <DetailRow icon={MapPin} label="Location" value={location || null} />
            {customer.address && (
              <DetailRow icon={MapPin} label="Address" value={customer.address} />
            )}
            <DetailRow
              icon={Calendar}
              label="Joined"
              value={new Date(customer.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 shrink-0 text-black/35 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground break-all">{value ?? "—"}</p>
      </div>
    </div>
  );
}
