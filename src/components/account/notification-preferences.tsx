"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Bell, Smartphone } from "@/lib/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "doctasimo:customer-notification-prefs";

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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPrefs;
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {
    return defaultPrefs;
  }
}

function writePrefs(p: Prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function NotificationPreferences() {
  const t = useTranslations("account.notifications");
  const [permission, setPermission] = React.useState<NotificationPermission>("default");
  const [prefs, setPrefs] = React.useState<Prefs>(defaultPrefs);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setPermission(typeof Notification !== "undefined" ? Notification.permission : "default");
    setPrefs(readPrefs());
  }, []);

  const updatePref = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    writePrefs(next);
    toast.success(t("savedToast"));
  };

  const requestPush = async () => {
    if (typeof Notification === "undefined") {
      toast.error(t("unsupported"));
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      toast.success(t("pushEnabled"));
    } else if (result === "denied") {
      toast.error(t("pushBlocked"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Push Notifications */}
      <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-gray-50 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-gray-400" /> {t("browserPush")}
            </CardTitle>
            <p className="text-[10px] font-medium text-gray-400">
              {t("browserPushHint")}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              size="sm"
              className="h-9 rounded-xl font-medium text-xs"
              onClick={() => void requestPush()}
            >
              {t("allowBrowser")}
            </Button>
            {mounted && (
              <span className="text-[10px] font-medium text-gray-400">
                {t("status")}:{" "}
                <span className="text-black font-semibold capitalize">
                  {permission === "default" ? t("statusDefault") : permission}
                </span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-gray-50">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-400" /> {t("prefsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
              <div className="space-y-0.5">
                <Label htmlFor="pref-orders" className="text-xs font-medium text-black cursor-pointer">
                  {t("prefOrders")}
                </Label>
                <p className="text-[10px] font-medium text-gray-400">{t("prefOrdersHint")}</p>
              </div>
              {mounted ? (
                <Switch
                  id="pref-orders"
                  checked={prefs.tipsAndOrderUpdates}
                  onCheckedChange={(v) => updatePref("tipsAndOrderUpdates", v)}
                />
              ) : (
                <span className="h-5 w-9 rounded-full bg-gray-100 animate-pulse" aria-hidden />
              )}
            </div>
            <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
              <div className="space-y-0.5">
                <Label htmlFor="pref-wellness" className="text-xs font-medium text-black cursor-pointer">
                  {t("prefWellness")}
                </Label>
                <p className="text-[10px] font-medium text-gray-400">{t("prefWellnessHint")}</p>
              </div>
              {mounted ? (
                <Switch
                  id="pref-wellness"
                  checked={prefs.wellnessTips}
                  onCheckedChange={(v) => updatePref("wellnessTips", v)}
                />
              ) : (
                <span className="h-5 w-9 rounded-full bg-gray-100 animate-pulse" aria-hidden />
              )}
            </div>
          </div>
          <div className="px-6 py-3 border-t border-gray-50">
            <p className="text-[10px] font-medium text-gray-300">{t("localNote")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
