"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Bell, Smartphone, Loader2 } from "@/lib/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  enablePushNotifications,
  disablePushNotifications,
  getStoredFcmToken,
} from "@/lib/fcm-registration";

const accountCardClass =
  "border border-black/8 bg-white rounded-xl shadow-none overflow-hidden";

const PREF_STORAGE_KEY = "doctasimo:customer-notification-prefs";

type Prefs = {
  tipsAndOrderUpdates: boolean;
  wellnessTips: boolean;
};

const defaultPrefs: Prefs = {
  tipsAndOrderUpdates: true,
  wellnessTips: true,
};

function readPrefs(): Prefs {
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const raw = localStorage.getItem(PREF_STORAGE_KEY);
    if (!raw) return defaultPrefs;
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {
    return defaultPrefs;
  }
}

function writePrefs(p: Prefs) {
  localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify(p));
}

export function NotificationPreferences() {
  const t = useTranslations("account.notifications");
  const [mounted, setMounted] = React.useState(false);
  const [pushEnabled, setPushEnabled] = React.useState(false);
  const [pushLoading, setPushLoading] = React.useState(false);
  const [permission, setPermission] = React.useState<NotificationPermission>("default");
  const [prefs, setPrefs] = React.useState<Prefs>(defaultPrefs);

  React.useEffect(() => {
    setMounted(true);
    setPermission(
      typeof Notification !== "undefined" ? Notification.permission : "default",
    );
    setPrefs(readPrefs());
    setPushEnabled(Boolean(getStoredFcmToken()));
  }, []);

  const updatePref = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    writePrefs(next);
    toast.success(t("savedToast"));
  };

  const handlePushToggle = async (checked: boolean) => {
    if (!mounted) return;

    if (typeof Notification === "undefined") {
      toast.error(t("unsupported"));
      return;
    }

    setPushLoading(true);
    try {
      if (checked) {
        const result = await enablePushNotifications();
        setPermission(Notification.permission);

        if (result.ok) {
          setPushEnabled(true);
          toast.success(t("pushEnabled"));
        } else if (result.reason === "denied") {
          setPushEnabled(false);
          toast.error(t("pushBlocked"));
        } else if (result.reason === "no-token") {
          setPushEnabled(false);
          toast.error(t("unsupported"));
        } else {
          setPushEnabled(false);
          toast.error("Could not register this device for notifications.");
        }
      } else {
        await disablePushNotifications();
        setPushEnabled(false);
        toast.success("Push notifications turned off for this device.");
      }
    } catch {
      setPushEnabled(getStoredFcmToken() !== null);
      toast.error("Could not update push notification settings.");
    } finally {
      setPushLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={accountCardClass}>
        <CardHeader className="py-4 px-6 border-b border-black/6">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary/70" />
              {t("browserPush")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{t("browserPushHint")}</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 pr-4">
              <Label
                htmlFor="push-enabled"
                className="text-sm font-semibold cursor-pointer"
              >
                Enable push notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Registers this device and saves your token so we can send order
                updates.
              </p>
            </div>
            {mounted ? (
              <div className="flex items-center gap-2 shrink-0">
                {pushLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Switch
                  id="push-enabled"
                  checked={pushEnabled}
                  disabled={pushLoading}
                  onCheckedChange={(v) => void handlePushToggle(v)}
                />
              </div>
            ) : (
              <span
                className="h-6 w-11 rounded-full bg-muted animate-pulse shrink-0"
                aria-hidden
              />
            )}
          </div>
          {mounted && (
            <p className="text-xs text-muted-foreground mt-4">
              {t("status")}:{" "}
              <span className="font-medium text-foreground capitalize">
                {permission === "default" ? t("statusDefault") : permission}
              </span>
              {pushEnabled && getStoredFcmToken() ? (
                <span className="text-emerald-600 font-medium"> · Device registered</span>
              ) : null}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className={accountCardClass}>
        <CardHeader className="py-4 px-6 border-b border-black/6">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary/70" />
            {t("prefsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-black/6">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="space-y-0.5">
                <Label htmlFor="pref-orders" className="text-sm font-medium cursor-pointer">
                  {t("prefOrders")}
                </Label>
                <p className="text-xs text-muted-foreground">{t("prefOrdersHint")}</p>
              </div>
              {mounted ? (
                <Switch
                  id="pref-orders"
                  checked={prefs.tipsAndOrderUpdates}
                  onCheckedChange={(v) => updatePref("tipsAndOrderUpdates", v)}
                />
              ) : (
                <span className="h-6 w-11 rounded-full bg-muted animate-pulse" aria-hidden />
              )}
            </div>
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="space-y-0.5">
                <Label htmlFor="pref-wellness" className="text-sm font-medium cursor-pointer">
                  {t("prefWellness")}
                </Label>
                <p className="text-xs text-muted-foreground">{t("prefWellnessHint")}</p>
              </div>
              {mounted ? (
                <Switch
                  id="pref-wellness"
                  checked={prefs.wellnessTips}
                  onCheckedChange={(v) => updatePref("wellnessTips", v)}
                />
              ) : (
                <span className="h-6 w-11 rounded-full bg-muted animate-pulse" aria-hidden />
              )}
            </div>
          </div>
          <div className="px-6 py-3 border-t border-black/6 bg-muted/20">
            <p className="text-xs text-muted-foreground">{t("inAppHint")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
