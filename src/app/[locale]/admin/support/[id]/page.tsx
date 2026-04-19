"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSupportMessages, useSendSupportMessage, useSupportThreads } from "@/hooks/use-support";
import { useSupportTypingEmit } from "@/hooks/use-support-typing-emit";
import { useRemoteSupportPresence } from "@/hooks/use-remote-support-presence";
import { SupportPresenceTypingRow } from "@/components/consultation/support-presence-typing-row";
import { useCan } from "@/hooks/use-can";
import { getPusherClient } from "@/lib/pusher";
import {
  SupportMessage,
  SupportAttachment,
  SupportService,
  MessagesResponse,
  getSupportThreadDisplayName,
  getSupportThreadInitials,
} from "@/services/support.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, MessageSquare, LifeBuoy, Paperclip, X, FileText } from "@/lib/icons";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUploadMultipleMedia } from "@/hooks/use-media";
import Image from "next/image";

export default function AdminThreadPage() {
 const t = useTranslations("supportChat.admin");
 const tCust = useTranslations("supportChat.customer");
 const tDate = useTranslations("supportChat.date");
 const tPresence = useTranslations("supportChat.presence");
 const locale = useLocale();
 const { id: threadId } = useParams() as { id: string };
 const queryClient = useQueryClient();
 const { user } = useCan();
 const [messageBody, setMessageBody] = useState("");
 const [attachments, setAttachments] = useState<SupportAttachment[]>([]);
 const scrollRef = useRef<HTMLDivElement>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const filePickerSessionRef = useRef(false);
 const uploadMutation = useUploadMultipleMedia();

 const { statusLine: presenceStatusLine } = useRemoteSupportPresence(
 threadId,
 user?.token,
 user?.id,
 );

 useSupportTypingEmit(threadId, messageBody, Boolean(threadId));

 useEffect(() => {
 const onWinFocus = () => {
 if (!filePickerSessionRef.current || !threadId) return;
 filePickerSessionRef.current = false;
 SupportService.emitUploading(threadId, false).catch(() => {});
 };
 window.addEventListener("focus", onWinFocus);
 return () => window.removeEventListener("focus", onWinFocus);
 }, [threadId]);

 const {
 data,
 fetchNextPage,
 hasNextPage,
 isFetchingNextPage,
 isLoading,
 } = useSupportMessages(threadId);

 const { data: threadsList = [] } = useSupportThreads({ limit: 100 });
 const threadMeta = threadsList.find((thread) => thread.id === threadId);

 const sendMessageMutation = useSendSupportMessage(threadId, {
 onSuccess: () => {
 setMessageBody("");
 setAttachments([]);
 },
 onError: () => {
 toast.error(t("toastSendFailed"));
 }
 });

 const messages = data?.pages.flatMap((page) => page.data).reverse() || [];

 const unnamedThread = (suffix: string) => tCust("unnamedThread", { suffix });
 const customerTitle =
 threadMeta
 ? getSupportThreadDisplayName(threadMeta, unnamedThread)
 : messages.find((m) => m.senderRole === "CUSTOMER")?.senderUserId.substring(0, 16) ||
 t("supportThreadFallback");
 const peerOnlineLabel = tPresence("peerOnline", { name: customerTitle });
 const headerAvatarUrl = threadMeta?.customer?.image;
 const headerInitials = threadMeta ? getSupportThreadInitials(threadMeta, unnamedThread) : null;

 // File upload handler
 const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
 filePickerSessionRef.current = false;
 SupportService.emitUploading(threadId, false).catch(() => {});
 const files = Array.from(e.target.files || []);
 if (!files.length) return;

 uploadMutation.mutate(
 { files },
 {
 onSuccess: (res) => {
 const newAttachments: SupportAttachment[] = res.map((item, i) => ({
 url: item.url,
 publicId: item.publicId,
 mimeType: files[i]?.type || "application/octet-stream",
 originalName: files[i]?.name || "file",
 sizeBytes: files[i]?.size || 0,
 }));
 setAttachments(prev => [...prev, ...newAttachments]);
 toast.success(t("toastFilesReady", { count: res.length }));
 },
 onError: () => toast.error(t("toastUploadFailed")),
 }
 );
 if (fileInputRef.current) fileInputRef.current.value = "";
 };

 const removeAttachment = (index: number) => {
 setAttachments(prev => prev.filter((_, i) => i !== index));
 };

 // Realtime
 useEffect(() => {
 if (!threadId || !user?.token) return;
 const pusher = getPusherClient(user.token);
 if (!pusher) return;
 const channel = pusher.subscribe(`private-thread-${threadId}`);

 const onMessageNew = (newMessage: SupportMessage) => {
 queryClient.setQueryData<InfiniteData<MessagesResponse>>(["support-messages", threadId], (oldData) => {
 if (!oldData) return oldData;
 const allMessages = oldData.pages.flatMap((page) => page.data);
 if (allMessages.some((m) => m.id === newMessage.id)) return oldData;
 return {
 ...oldData,
 pages: oldData.pages.map((page, index) => {
 if (index === 0) return { ...page, data: [newMessage, ...page.data] };
 return page;
 })
 };
 });
 queryClient.invalidateQueries({ queryKey: ["support-messages", threadId] });
 if (newMessage.senderUserId !== user?.id) {
 toast.info(t("toastNewMessage"));
 }
 };

 channel.bind("support.message.new", onMessageNew);

 return () => {
 channel.unbind("support.message.new", onMessageNew);
 channel.unsubscribe();
 };
 }, [threadId, queryClient, user?.id, user?.token, t]);

 useEffect(() => {
 if (scrollRef.current) {
 scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
 }
 }, [messages.length, presenceStatusLine]);

 const handleSend = async (e: React.FormEvent) => {
 e.preventDefault();
 if ((!messageBody.trim() && attachments.length === 0) || sendMessageMutation.isPending) return;
 const n = attachments.length;
 await SupportService.emitSending(threadId, true, n > 0 ? n : undefined).catch(() => {});
 try {
 await sendMessageMutation.mutateAsync({
 body: messageBody,
 attachments: attachments.length > 0 ? attachments : undefined,
 });
 } finally {
 await SupportService.emitSending(threadId, false).catch(() => {});
 }
 };

 const getDateLabel = (dateStr: string) => {
 const date = new Date(dateStr);
 const today = new Date();
 const yesterday = new Date(today);
 yesterday.setDate(yesterday.getDate() - 1);
 if (date.toDateString() === today.toDateString()) return tDate("today");
 if (date.toDateString() === yesterday.toDateString()) return tDate("yesterday");
 return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
 };

 if (isLoading) {
 return (
 <div className="flex flex-col h-full bg-white">
 <div className="flex items-center gap-3 p-4 border-b border-black/5">
 <div className="h-9 w-9 rounded-full bg-black/5 animate-pulse" />
 <div className="space-y-1.5">
 <div className="h-3 w-24 bg-black/5 rounded animate-pulse" />
 <div className="h-2 w-16 bg-black/[0.03] rounded animate-pulse" />
 </div>
 </div>
 <div className="flex-1 p-4 space-y-4">
 {[...Array(3)].map((_, i) => (
 <div key={i} className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}>
 <div className={cn("h-10 rounded-xl bg-black/[0.04] animate-pulse", i % 2 === 0 ? "w-[50%]" : "w-[40%]")} />
 </div>
 ))}
 </div>
 </div>
 );
 }

 return (
 <div className="flex flex-col h-full bg-white">
 {/* Header */}
 <div className="flex items-center gap-3 px-4 py-3 border-b border-black/5 shrink-0">
 <div className="h-9 w-9 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
 {headerAvatarUrl ? (
 <Image src={headerAvatarUrl} alt="" width={36} height={36} className="h-9 w-9 object-cover" />
 ) : headerInitials ? (
 <span className="text-[10px] font-semibold text-primary">{headerInitials}</span>
 ) : (
 <LifeBuoy className="h-4 w-4 text-primary" />
 )}
 </div>
 <div className="min-w-0">
 <h2 className="text-sm font-medium text-black truncate">
 {customerTitle}
 </h2>
 <div className="flex items-center gap-1.5 min-w-0">
 <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-500" />
 <span className="text-[10px] font-medium text-emerald-600 truncate">
 {presenceStatusLine ?? peerOnlineLabel}
 </span>
 </div>
 </div>
 </div>

 {/* Messages */}
 <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 bg-white">
 {hasNextPage && (
 <div className="flex justify-center mb-4">
 <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}
 className="text-[10px] font-medium text-black/30 h-7">
 {isFetchingNextPage ? t("loading") : t("loadOlder")}
 </Button>
 </div>
 )}

 {messages.length === 0 && (
 <div className="flex flex-col items-center justify-center py-16 text-center">
 <MessageSquare className="h-8 w-8 text-black/10 mb-3" />
 <p className="text-xs font-medium text-black/30">{t("noMessagesYet")}</p>
 </div>
 )}

 <div className="space-y-2">
 {messages.map((msg, index) => {
 const isMe = msg.senderUserId === user?.id;
 const prevMsg = messages[index - 1];
 const showDateSep = !prevMsg || getDateLabel(prevMsg.createdAt) !== getDateLabel(msg.createdAt);
 const isSameSender = prevMsg && prevMsg.senderUserId === msg.senderUserId;

 return (
 <React.Fragment key={msg.id}>
 {showDateSep && (
 <div className="flex justify-center py-3">
 <span className="text-[9px] font-medium text-black/30 bg-black/[0.03] px-2.5 py-0.5 rounded-full">
 {getDateLabel(msg.createdAt)}
 </span>
 </div>
 )}
 <div className={cn("flex flex-col", isMe ? "items-end" : "items-start", isSameSender ? "mt-0.5" : "mt-2")}>
 {!isSameSender && !isMe && (
 <span className="text-[9px] font-medium text-black/30 mb-1 ml-1">{t("customerLabel")}</span>
 )}
 <div className={cn(
 "max-w-[80%] md:max-w-[65%] rounded-xl px-3.5 py-2.5 text-sm",
 isMe
 ? "bg-primary text-white rounded-tr-md"
 : "bg-black/[0.04] text-black rounded-tl-md"
 )}>
 {msg.body && <p className="leading-relaxed font-medium whitespace-pre-wrap break-words">{msg.body}</p>}

 {/* Attachments */}
 {msg.attachments && msg.attachments.length > 0 && (
 <div className="mt-2 space-y-1.5">
 {msg.attachments.map((att, ai) => {
 const isImage = att.mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(att.url);
 if (isImage) {
 return (
 <a key={ai} href={att.url} target="_blank" rel="noopener noreferrer" className="block">
 <div className="rounded-lg overflow-hidden max-w-[200px] border border-black/5">
 <Image src={att.url} alt={att.originalName || "image"} width={200} height={120} className="object-cover w-full" />
 </div>
 </a>
 );
 }
 return (
 <a key={ai} href={att.url} target="_blank" rel="noopener noreferrer"
 className={cn("flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium",
 isMe ? "border-white/20 text-white/80 hover:bg-white/10" : "border-black/5 text-black/60 hover:bg-black/[0.02]"
 )}>
 <FileText className="h-3.5 w-3.5 shrink-0" />
 <span className="truncate">{att.originalName || t("fileFallback")}</span>
 </a>
 );
 })}
 </div>
 )}

 <div className={cn("mt-1 text-[8px] font-medium text-right", isMe ? "text-white/40" : "text-black/25")}>
 {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </div>
 </div>
 </div>
 </React.Fragment>
 );
 })}
 </div>
 </div>

 <SupportPresenceTypingRow line={presenceStatusLine} />

 {/* Attachment Preview */}
 {attachments.length > 0 && (
 <div className="px-4 py-2 border-t border-black/5 flex items-center gap-2 overflow-x-auto bg-white">
 {attachments.map((att, i) => {
 const isImage = att.mimeType?.startsWith("image/");
 return (
 <div key={i} className="relative group shrink-0 rounded-lg border border-black/5 overflow-hidden bg-black/[0.02]">
 {isImage ? (
 <div className="h-14 w-14 relative">
 <Image src={att.url} alt={att.originalName || "file"} fill className="object-cover" />
 </div>
 ) : (
 <div className="h-14 w-14 flex flex-col items-center justify-center">
 <FileText className="h-4 w-4 text-black/30" />
 <span className="text-[7px] text-black/40 truncate max-w-[50px] mt-0.5">{att.originalName}</span>
 </div>
 )}
 <button type="button" onClick={() => removeAttachment(i)}
 className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
 <X className="h-2.5 w-2.5" />
 </button>
 </div>
 );
 })}
 </div>
 )}

 {/* Input */}
 <div className="px-4 py-3 border-t border-black/5 bg-white shrink-0">
 <form onSubmit={handleSend} className="flex items-center gap-2">
 <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileSelect} className="hidden" />
 <button type="button" onClick={() => {
 filePickerSessionRef.current = true;
 SupportService.emitUploading(threadId, true).catch(() => {});
 fileInputRef.current?.click();
 }} disabled={uploadMutation.isPending}
 className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-black/40 hover:text-black/60 hover:bg-black/[0.03] transition-all">
 {uploadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
 </button>
 <Input
 value={messageBody}
 onChange={(e) => setMessageBody(e.target.value)}
 placeholder={t("placeholderMessage")}
 className="flex-1 h-10 border-black/[0.06] bg-black/[0.02] focus-visible:ring-primary/20 rounded-lg text-sm font-medium px-3"
 />
 <Button type="submit" disabled={(!messageBody.trim() && attachments.length === 0) || sendMessageMutation.isPending}
 className={cn("h-10 w-10 rounded-xl p-0 shrink-0 active:scale-95 transition-all",
 (messageBody.trim() || attachments.length > 0) ? "bg-primary hover:bg-primary/90 text-white" : "bg-black/[0.04] text-black/30"
 )}>
 {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
 </Button>
 </form>
 </div>
 </div>
 );
}
