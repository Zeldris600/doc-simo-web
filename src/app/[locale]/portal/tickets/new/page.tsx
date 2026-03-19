"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateSupportThread } from "@/hooks/use-support";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Loader2, LifeBuoy } from "lucide-react";
import { toast } from "sonner";

export default function NewTicketPage() {
  const router = useRouter();
  const [firstMessage, setFirstMessage] = useState("");

  const createThreadMutation = useCreateSupportThread({
    onSuccess: (data) => {
      toast.success("Consultation synchronization established.");
      router.push(`/portal/tickets/${data.thread.id}`);
    },
    onError: () => {
      toast.error("Failed to establish clinical synchronization.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstMessage.trim() || createThreadMutation.isPending) return;
    createThreadMutation.mutate(firstMessage);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-black text-black uppercase tracking-widest flex items-center gap-2">
          <LifeBuoy className="h-5 w-5 text-primary" />
          Request Consultation
        </h2>
      </div>

      <Card className="border-none shadow-2xl shadow-black/5 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-black/60">
            Initial Message
          </CardTitle>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-2">
            Describe your inquiry to connect with our clinical team.
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              placeholder="How can our experts assist you today?"
              className="min-h-[200px] border-gray-100 bg-gray-50/30 focus-visible:ring-primary/20 rounded-xl font-medium p-4"
              required
            />
            <Button
              type="submit"
              disabled={!firstMessage.trim() || createThreadMutation.isPending}
              className="w-full h-14 bg-black text-white hover:bg-black/90 font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02]"
            >
              {createThreadMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Initialize Synchronization
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
