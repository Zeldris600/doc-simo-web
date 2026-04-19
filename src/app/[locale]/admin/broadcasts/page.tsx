"use client";

import DashboardHeader from "@/components/dashboard-header";
import { AdminBroadcastPanel } from "@/components/admin/admin-broadcast-panel";

export default function AdminBroadcastsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Broadcasts"
        description="In-app and push only — no email."
      />
      <AdminBroadcastPanel />
    </div>
  );
}
