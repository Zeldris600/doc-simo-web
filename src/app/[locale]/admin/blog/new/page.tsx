"use client";

import DashboardHeader from "@/components/dashboard-header";
import { BlogAdminForm } from "@/components/blog/blog-admin-form";

export default function AdminNewBlogPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <DashboardHeader
        title="New blog post"
        description="Drafts stay private until you publish."
      />
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <BlogAdminForm mode="create" />
      </div>
    </div>
  );
}
