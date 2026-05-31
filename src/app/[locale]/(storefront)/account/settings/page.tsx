"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useMe } from "@/hooks/use-user";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { ProfileSettingsForm } from "@/components/account/profile-settings-form";
import { NotificationPreferences } from "@/components/account/notification-preferences";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from "@/lib/icons";

export default function AccountSettingsPage() {
  const t = useTranslations("account.settingsPage");
  const tNav = useTranslations("navigation");
  const { data: user, isLoading } = useMe();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#EEF2EE]">
        <div className="container mx-auto max-w-6xl px-4 pt-32 pb-16">
          <PageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF2EE]">
      <div className="container mx-auto max-w-6xl px-4 pt-32 pb-20">
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-lg -ml-2 mb-4 text-muted-foreground"
          >
            <Link href="/account">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {tNav("myAccount")}
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Settings className="h-5 w-5" />
                <span className="text-sm font-semibold">{tNav("settings")}</span>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-base font-semibold mb-4">{t("profileSection")}</h2>
            <ProfileSettingsForm user={user} />
          </section>

          <section id="notifications">
            <h2 className="text-base font-semibold mb-4">{t("notificationsSection")}</h2>
            <NotificationPreferences />
          </section>
        </div>
      </div>
    </div>
  );
}
