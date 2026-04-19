"use client";

import { useParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard-header";
import { BlogAdminForm } from "@/components/blog/blog-admin-form";
import { useAdminBlogPost } from "@/hooks/use-blog";
import { Loader2 } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function AdminEditBlogPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const { data: post, isLoading, isFetched } = useAdminBlogPost(id || undefined);

  if (!id) {
    return <p className="text-sm text-destructive">Invalid post.</p>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isFetched && !post) {
    return (
      <div className="space-y-4 max-w-lg">
        <p className="text-sm text-muted-foreground">
          Post not found, or it is not visible in the admin list.
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/blog">Back to blog</Link>
        </Button>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <DashboardHeader title="Edit post" description={post.title} />
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <BlogAdminForm mode="edit" initial={post} />
      </div>
    </div>
  );
}
