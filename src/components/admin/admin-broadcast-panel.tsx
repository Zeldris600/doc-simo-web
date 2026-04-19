"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Info, Loader2 } from "@/lib/icons";
import { toast } from "sonner";
import {
  useAdminBroadcastPoll,
  useSendAdminTopicBroadcast,
  useSendTargetedAdminNotification,
  useStartAdminBroadcast,
} from "@/hooks/use-admin-broadcast";
import type { AdminBroadcastAudience } from "@/types/admin-broadcast";
import type { ApiError } from "@/types/api";

function parseUserIds(raw: string): string[] {
  return raw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseOptionalJsonObject(
  raw: string,
): Record<string, unknown> | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  let v: unknown;
  try {
    v = JSON.parse(t) as unknown;
  } catch {
    throw new Error("Invalid JSON in data field");
  }
  if (!v || typeof v !== "object" || Array.isArray(v)) {
    throw new Error("Data must be a JSON object");
  }
  return v as Record<string, unknown>;
}

function parseOptionalStringMap(
  raw: string,
): Record<string, string> | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  let v: unknown;
  try {
    v = JSON.parse(t) as unknown;
  } catch {
    throw new Error("Invalid JSON in data field");
  }
  if (!v || typeof v !== "object" || Array.isArray(v)) {
    throw new Error("Data must be a JSON object");
  }
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v)) {
    if (typeof val !== "string") {
      throw new Error(`FCM data: value for "${k}" must be a string`);
    }
    out[k] = val;
  }
  return out;
}

function errMessage(e: unknown): string {
  const ax = e as ApiError;
  const m = ax.response?.data?.message as string | string[] | undefined;
  if (typeof m === "string") return m;
  if (Array.isArray(m)) return m.join(", ");
  if (e instanceof Error) return e.message;
  return "Request failed";
}

export function AdminBroadcastPanel() {
  const targetedMut = useSendTargetedAdminNotification();
  const batchedMut = useStartAdminBroadcast();
  const topicMut = useSendAdminTopicBroadcast();

  const [activeBroadcastId, setActiveBroadcastId] = useState<string | null>(
    null,
  );
  const poll = useAdminBroadcastPoll(activeBroadcastId);

  /* Targeted */
  const [targetUserIds, setTargetUserIds] = useState("");
  const [targetTitle, setTargetTitle] = useState("");
  const [targetBody, setTargetBody] = useState("");
  const [targetDataJson, setTargetDataJson] = useState("");

  /* Batched */
  const [batchedAudience, setBatchedAudience] =
    useState<AdminBroadcastAudience>("CUSTOMERS");
  const [batchedTitle, setBatchedTitle] = useState("");
  const [batchedBody, setBatchedBody] = useState("");
  const [batchedDataJson, setBatchedDataJson] = useState("");
  const [chInApp, setChInApp] = useState(true);
  const [chPush, setChPush] = useState(true);

  /* Topic */
  const [topicTitle, setTopicTitle] = useState("");
  const [topicBody, setTopicBody] = useState("");
  const [topicDataJson, setTopicDataJson] = useState("");

  const onTargetedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userIds = parseUserIds(targetUserIds);
    if (userIds.length === 0) {
      toast.error("Enter at least one user ID");
      return;
    }
    let data: Record<string, unknown> | undefined;
    try {
      data = parseOptionalJsonObject(targetDataJson);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid data JSON");
      return;
    }
    targetedMut.mutate(
      { userIds, title: targetTitle, body: targetBody, data },
      {
        onSuccess: ({ sent }) => {
          toast.success(`Sent to ${sent} user(s)`);
        },
        onError: (err) => toast.error(errMessage(err)),
      },
    );
  };

  const onBatchedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const channels: ("in_app" | "push")[] = [];
    if (chInApp) channels.push("in_app");
    if (chPush) channels.push("push");
    if (channels.length === 0) {
      toast.error("Select at least one channel (in-app or push)");
      return;
    }
    let data: Record<string, unknown> | undefined;
    try {
      data = parseOptionalJsonObject(batchedDataJson);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid data JSON");
      return;
    }
    batchedMut.mutate(
      {
        audience: batchedAudience,
        title: batchedTitle,
        body: batchedBody,
        channels,
        data,
      },
      {
        onSuccess: (res) => {
          setActiveBroadcastId(res.broadcastId);
          toast.success("Broadcast started — tracking progress below.");
        },
        onError: (err) => toast.error(errMessage(err)),
      },
    );
  };

  const onTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let data: Record<string, string> | undefined;
    try {
      data = parseOptionalStringMap(topicDataJson);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid data JSON");
      return;
    }
    topicMut.mutate(
      { title: topicTitle, body: topicBody, data },
      {
        onSuccess: (res) => {
          toast.success(
            res.messageId
              ? `Topic push sent (message ${res.messageId})`
              : "Topic push sent",
          );
        },
        onError: (err) => toast.error(errMessage(err)),
      },
    );
  };

  const status = poll.data?.status;
  const statusBadge =
    status === "COMPLETED" ? (
      <Badge className="bg-green-100 text-green-800 border-0">Completed</Badge>
    ) : status === "FAILED" ? (
      <Badge variant="destructive">Failed</Badge>
    ) : status === "RUNNING" ? (
      <Badge className="bg-blue-50 text-blue-800 border-0">Running</Badge>
    ) : status === "PENDING" ? (
      <Badge className="bg-amber-50 text-amber-800 border-0">Pending</Badge>
    ) : null;

  const targetCount = poll.data?.targetCount;
  const processed = poll.data?.processedCount ?? 0;
  const progressPct =
    targetCount != null && targetCount > 0
      ? Math.min(100, Math.round((processed / targetCount) * 100))
      : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 rounded-xl border border-primary/15 bg-primary/4 p-4 text-sm text-foreground/80">
        <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
        <p>
          Admin notifications use <strong>in-app</strong> and/or{" "}
          <strong>push (FCM)</strong> only. Email is not supported for these
          flows. Topic sends reach subscribed customer devices without creating
          per-user inbox rows.
        </p>
      </div>

      <Tabs defaultValue="batched" className="w-full">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="batched">Audience broadcast</TabsTrigger>
          <TabsTrigger value="targeted">Targeted (IDs)</TabsTrigger>
          <TabsTrigger value="topic">FCM topic</TabsTrigger>
        </TabsList>

        <TabsContent value="targeted" className="mt-6">
          <form
            onSubmit={onTargetedSubmit}
            className="space-y-4 max-w-2xl bg-white p-6 rounded-xl border border-gray-100"
          >
            <p className="text-sm text-muted-foreground">
              Socket.IO event <code className="text-xs">notifications.admin.send</code>{" "}
              — best for small explicit user lists. Creates in-app rows (
              <code className="text-xs">kind: admin</code>) and queues push.
            </p>
            <div className="space-y-2">
              <Label>User IDs (comma or newline separated)</Label>
              <Textarea
                rows={4}
                className="font-mono text-sm"
                value={targetUserIds}
                onChange={(e) => setTargetUserIds(e.target.value)}
                placeholder="user_cuid_1, user_cuid_2"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Body</Label>
                <Textarea
                  rows={3}
                  value={targetBody}
                  onChange={(e) => setTargetBody(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data (optional JSON object)</Label>
              <Textarea
                rows={3}
                className="font-mono text-xs"
                value={targetDataJson}
                onChange={(e) => setTargetDataJson(e.target.value)}
                placeholder='{"screen":"orders","orderId":"…"}'
              />
            </div>
            <Button type="submit" disabled={targetedMut.isPending}>
              {targetedMut.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Send now
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="batched" className="mt-6 space-y-6">
          <form
            onSubmit={onBatchedSubmit}
            className="space-y-4 max-w-2xl bg-white p-6 rounded-xl border border-gray-100"
          >
            <p className="text-sm text-muted-foreground">
              Async job with progress. In-app rows use{" "}
              <code className="text-xs">kind: admin_broadcast</code>.
            </p>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select
                value={batchedAudience}
                onValueChange={(v) =>
                  setBatchedAudience(v as AdminBroadcastAudience)
                }
              >
                <SelectTrigger className="max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMERS">Customers only</SelectItem>
                  <SelectItem value="ALL_USERS">All users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ch-inapp"
                  checked={chInApp}
                  onCheckedChange={(c) => setChInApp(c === true)}
                />
                <Label htmlFor="ch-inapp" className="font-normal cursor-pointer">
                  In-app
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ch-push"
                  checked={chPush}
                  onCheckedChange={(c) => setChPush(c === true)}
                />
                <Label htmlFor="ch-push" className="font-normal cursor-pointer">
                  Push (FCM)
                </Label>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input
                  value={batchedTitle}
                  onChange={(e) => setBatchedTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Body</Label>
                <Textarea
                  rows={3}
                  value={batchedBody}
                  onChange={(e) => setBatchedBody(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data (optional JSON object)</Label>
              <Textarea
                rows={3}
                className="font-mono text-xs"
                value={batchedDataJson}
                onChange={(e) => setBatchedDataJson(e.target.value)}
                placeholder='{"screen":"promo"}'
              />
            </div>
            <Button type="submit" disabled={batchedMut.isPending}>
              {batchedMut.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Start broadcast
            </Button>
          </form>

          {activeBroadcastId && (
            <div className="max-w-2xl space-y-3 rounded-xl border border-gray-100 bg-white p-6">
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <h3 className="text-sm font-semibold text-black">Job status</h3>
                {statusBadge}
              </div>
              <p className="text-xs font-mono text-muted-foreground break-all">
                ID: {activeBroadcastId}
              </p>
              {poll.isFetching && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Refreshing…
                </p>
              )}
              {targetCount != null && targetCount > 0 && (
                <>
                  <p className="text-sm text-foreground">
                    Processed {processed} / {targetCount}
                  </p>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progressPct ?? 0}%` }}
                    />
                  </div>
                </>
              )}
              {targetCount == null &&
                (status === "PENDING" || status === "RUNNING") && (
                  <p className="text-sm text-muted-foreground">
                    Waiting for target count…
                  </p>
                )}
              {poll.data?.lastError && (
                <p className="text-sm text-destructive">{poll.data.lastError}</p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveBroadcastId(null)}
              >
                Clear status
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="topic" className="mt-6">
          <form
            onSubmit={onTopicSubmit}
            className="space-y-4 max-w-2xl bg-white p-6 rounded-xl border border-gray-100"
          >
            <p className="text-sm text-muted-foreground">
              One FCM message to topic{" "}
              <code className="text-xs">doctasimo_customers</code>. No in-app
              inbox rows. <code className="text-xs">data</code> values must be
              strings.
            </p>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Body</Label>
              <Textarea
                rows={3}
                value={topicBody}
                onChange={(e) => setTopicBody(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Data (optional JSON object, string values only)</Label>
              <Textarea
                rows={3}
                className="font-mono text-xs"
                value={topicDataJson}
                onChange={(e) => setTopicDataJson(e.target.value)}
                placeholder='{"deeplink":"/products"}'
              />
            </div>
            <Button type="submit" disabled={topicMut.isPending}>
              {topicMut.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Send topic push
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
