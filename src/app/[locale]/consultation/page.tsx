"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useSupportThreads,
  useSupportMessages,
  useCreateSupportThread,
  useSendSupportMessage,
} from "@/hooks/use-support";
import { useCan } from "@/hooks/use-can";
import { getPusherClient } from "@/lib/pusher";
import { SupportMessage, SupportAttachment } from "@/services/support.service";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Loader2, ShieldPlus, Paperclip, X, FileText, ChevronLeft, Plus, Search, Camera, Mic, UploadCloud, Square, Volume2 } from "lucide-react";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MessagesResponse } from "@/services/support.service";
import { useUploadMultipleMedia } from "@/hooks/use-media";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ConsultationSkeleton } from "@/components/skeletons/consultation-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ConsultationPage() {
  const { user, isLoading: isLoadingAuth } = useCan();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [messageBody, setMessageBody] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [attachments, setAttachments] = useState<SupportAttachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMultipleMedia();

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const params = useParams();
  const locale = params.locale as string || "en";

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showThreadList, setShowThreadList] = useState(true);

  // Auth Redirect
  useEffect(() => {
    if (!user && !isLoadingAuth) {
      router.push(`/${locale}/login`);
    }
  }, [user, isLoadingAuth, router, locale]);

  const { data: threadsData, isLoading: isLoadingThreads } = useSupportThreads({ limit: 50 });
  
  // Set initial active thread when records arrive
  useEffect(() => {
    if (threadsData?.length && !activeThreadId) {
      const defaultId = threadsData[0].id;
      // We set this in a microtask to avoid synchronous cascading renders during mount/load
      Promise.resolve().then(() => {
        setActiveThreadId(defaultId);
      });
    }
  }, [threadsData, activeThreadId]);

  const activeThread = threadsData?.find(t => t.id === activeThreadId) || threadsData?.[0];
  const threadId = activeThread?.id;

  const createThreadMutation = useCreateSupportThread({
    onSuccess: (newThread) => {
      toast.success("Consultation successfully started.");
      setActiveThreadId(newThread.thread.id);
      setShowThreadList(false);
    },
    onError: () => {
      toast.error("Failed to start consultation.");
    }
  });

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = useSupportMessages(threadId as string, { limit: 50 });

  const sendMessageMutation = useSendSupportMessage(threadId as string, {
    onSuccess: () => {
      setMessageBody("");
      setAttachments([]);
      setIsRecording(false);
    },
    onError: () => {
      toast.error("Failed to send message.");
    }
  });

  const messages = messagesData?.pages.flatMap((page) => page.data).reverse() || [];

  const filteredThreads = threadsData?.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerUserId.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // File upload handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    uploadMutation.mutate({ files }, {
      onSuccess: (res) => {
        const newAttachments: SupportAttachment[] = res.map((item, i) => ({
          url: item.url,
          publicId: item.publicId,
          mimeType: files[i]?.type || "application/octet-stream",
          originalName: files[i]?.name || "attached_file",
          sizeBytes: files[i]?.size || 0,
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
        toast.success("Attachment ready");
      },
      onError: () => toast.error("Upload failed"),
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Voice recording handler
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        
        uploadMutation.mutate({ files: [file] }, {
          onSuccess: (res) => {
            const att: SupportAttachment = {
              url: res[0].url,
              publicId: res[0].publicId,
              mimeType: 'audio/webm',
              originalName: 'Voice Note',
              sizeBytes: audioBlob.size,
            };
            setAttachments(prev => [...prev, att]);
            toast.success("Audio recorded");
          },
          onError: () => toast.error("Audio upload failed")
        });
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!threadId || !user?.token) return;
    const pusher = getPusherClient(user.token);
    const channel = pusher.subscribe(`private-thread-${threadId}`);

    channel.bind("support.message.new", (newMessage: SupportMessage) => {
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
        toast.info("Clinical update received");
      }
    });

    return () => { channel.unbind_all(); channel.unsubscribe(); };
  }, [threadId, queryClient, user?.id, user?.token]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageBody.trim() && attachments.length === 0) || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate({
      body: messageBody,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  if (isLoadingAuth || isLoadingThreads || user === undefined) {
    return <ConsultationSkeleton />;
  }

  return (
    <div className="fixed inset-0 bg-white flex overflow-hidden pt-20">
      {/* Sidebar */}
      <aside className={cn(
        "w-full md:w-[320px] lg:w-[380px] border-r border-black/5 bg-white flex flex-col shrink-0 transition-all z-30",
        !showThreadList && "hidden md:flex"
      )}>
        <header className="px-6 h-16 flex flex-col justify-center border-b border-black/5 bg-white shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black text-black/40 tracking-[0.2em] uppercase">Registry</h2>
            <Button size="icon" variant="ghost" onClick={() => createThreadMutation.mutate(undefined)} disabled={createThreadMutation.isPending} className="h-7 w-7 rounded-sm">
              {createThreadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/20" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-9 text-[10px] bg-black/[0.02] border-none rounded-none focus-visible:ring-0"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredThreads.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveThreadId(t.id);
                setShowThreadList(false);
              }}
              className={cn(
                "w-full p-4 rounded-none text-left transition-all border-l-2",
                activeThreadId === t.id ? "bg-[#1f3d2b] border-primary text-white" : "hover:bg-black/[0.02] border-transparent text-black"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase">Session #{t.id.slice(-4)}</span>
                    <span className={cn("text-[8px] font-black uppercase", activeThreadId === t.id ? "text-white/40" : "text-black/20")}>
                      {getDateLabel(t.updatedAt || t.createdAt)}
                    </span>
                  </div>
                  <p className={cn("text-[9px] font-black truncate mt-1 uppercase tracking-wider opacity-60", activeThreadId === t.id ? "text-white" : "text-black")}>
                    Secure record active
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Support Panel */}
      <main className={cn(
        "flex-1 flex flex-col bg-white transition-all",
        showThreadList && "hidden md:flex"
      )}>
        <header className="flex items-center justify-between px-6 h-16 border-b border-black/5 bg-white shrink-0 z-20">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => setShowThreadList(true)} className="md:hidden h-8 w-8 flex items-center justify-center rounded-sm hover:bg-black/5 text-black/40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-8 w-8 rounded-full bg-black/[0.03] flex items-center justify-center border border-black/5">
              <ShieldPlus className="h-4 w-4 text-black" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[11px] font-black text-black tracking-[0.1em] uppercase">Clinical Support Channel</h1>
              <div className="flex items-center gap-1.5 leading-none">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">Live session</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="px-3 py-1.5 bg-black/[0.02] text-[8px] font-black text-black/40 border border-black/5 rounded-sm uppercase tracking-widest">Secure Room</div>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-12 py-8 flex flex-col gap-6 bg-white/[0.98]">
          {hasNextPage && (
            <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="text-[9px] font-black uppercase tracking-widest self-center text-black/20 mb-6">
              {isFetchingNextPage ? "Accessing Records..." : "Load Earlier Communication"}
            </Button>
          )}

          <div className="space-y-3 max-w-4xl mx-auto w-full">
            {messages.map((msg, index) => {
              const isMe = msg.senderUserId === user?.id;
              const prevMsg = messages[index - 1];
              const showDateSep = !prevMsg || getDateLabel(prevMsg.createdAt) !== getDateLabel(msg.createdAt);
              
              return (
                <React.Fragment key={msg.id}>
                  {showDateSep && (
                    <div className="flex justify-center py-6">
                      <span className="text-[8px] font-black uppercase tracking-widest text-black/20 bg-black/[0.01] px-4 py-1 border border-black/5 rounded-sm">{getDateLabel(msg.createdAt)}</span>
                    </div>
                  )}
                  <div className={cn("flex flex-col", isMe ? "items-end" : "items-start", index > 0 && messages[index-1].senderUserId === msg.senderUserId ? "mt-1" : "mt-6")}>
                    {!isMe && index > 0 && messages[index-1].senderUserId !== msg.senderUserId && (
                      <span className="text-[8px] font-black text-black/40 mb-2 ml-2 uppercase tracking-widest">Medical Team</span>
                    )}
                    <div className={cn("max-w-[85%] md:max-w-[70%] rounded-none px-5 py-4 text-xs md:text-sm font-black shadow-none border-l-2", isMe ? "bg-[#1f3d2b] text-white border-primary" : "bg-black/[0.02] text-black border-black/10")}>
                      {msg.body && <p className="whitespace-pre-wrap leading-relaxed">{msg.body}</p>}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {msg.attachments.map((att, ai) => {
                            const isImage = att.mimeType?.startsWith("image/");
                            const isAudio = att.mimeType?.startsWith("audio/");
                            if (isImage) {
                              return (
                                <a key={ai} href={att.url} target="_blank" rel="noopener noreferrer" className="block border border-black/5 rounded-sm overflow-hidden max-w-[320px]">
                                  <Image src={att.url} alt="Clinical Image" width={400} height={240} className="object-cover w-full" />
                                </a>
                              );
                            }
                            if (isAudio) {
                              return (
                                <div key={ai} className={cn("flex flex-col gap-2 p-3 rounded-sm border", isMe ? "border-white/10 bg-white/5" : "border-black/5 bg-white")}>
                                  <div className="flex items-center gap-2">
                                    <Volume2 className="h-3.5 w-3.5" />
                                    <span className="text-[9px] font-black uppercase">Voice Note</span>
                                  </div>
                                  <audio controls src={att.url} className="w-full h-8" />
                                </div>
                              );
                            }
                            return (
                              <a key={ai} href={att.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-3 px-4 py-3 rounded-sm border text-[10px] font-black uppercase tracking-widest", isMe ? "border-white/10 bg-white/5" : "border-black/10 bg-white")}>
                                <FileText className="h-4 w-4" />
                                <span className="truncate">{att.originalName}</span>
                              </a>
                            );
                          })}
                        </div>
                      )}
                      <div className="mt-2 text-[8px] font-black opacity-30 text-right uppercase tracking-[0.2em]">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Active Attachment Previews - Clean Flat UI */}
        {attachments.length > 0 && (
          <div className="px-6 py-4 border-t border-black/5 flex items-center gap-4 overflow-x-auto bg-black/[0.01]">
            {attachments.map((att, i) => {
              const isImage = att.mimeType?.startsWith("image/");
              return (
                <div key={i} className="relative group shrink-0 rounded-sm border border-black/10 overflow-hidden bg-white h-20 w-20 flex items-center justify-center">
                  {isImage ? (
                    <Image src={att.url} alt="preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <FileText className="h-5 w-5 text-black/20" />
                      <span className="text-[7px] font-black uppercase truncate max-w-[60px]">{att.originalName}</span>
                    </div>
                  )}
                  <button onClick={() => removeAttachment(i)} className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Input Footer */}
        <div className="px-4 md:px-12 py-6 border-t border-black/5 bg-white shrink-0">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-3">
            <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileSelect} className="hidden" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="h-11 w-11 p-0 rounded-sm bg-black/[0.01] border-black/10 text-black/20 shadow-none">
                  {uploadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 rounded-sm border-black/10 shadow-2xl p-1 bg-white">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest p-3 cursor-pointer">
                  <UploadCloud className="mr-3 h-4 w-4" /> Upload Document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={isRecording ? stopRecording : startRecording} className={cn("text-[10px] font-black uppercase tracking-widest p-3 cursor-pointer", isRecording && "text-red-500 bg-red-50")}>
                  {isRecording ? <Square className="mr-3 h-4 w-4 fill-current" /> : <Mic className="mr-3 h-4 w-4" />}
                  {isRecording ? "Stop Recording" : "Voice Note"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="relative flex-1">
              <Textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    handleSend(e as unknown as React.FormEvent); 
                  } 
                }}
                placeholder={isRecording ? "Recording active..." : "Type clinical inquiry..."}
                className="min-h-[44px] h-11 py-3 bg-black/[0.01] border-black/10 focus-visible:ring-0 rounded-sm text-[13px] font-bold shadow-none resize-none transition-all placeholder:text-black/20"
              />
              {isRecording && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-red-500/40 rounded-full animate-pulse" 
                      style={{ 
                        height: `${[8, 12, 6, 10][i % 4]}px`, 
                        animationDelay: `${i * 0.1}s` 
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={(!messageBody.trim() && attachments.length === 0) || sendMessageMutation.isPending} className={cn("h-11 px-8 rounded-sm font-black text-[11px] uppercase tracking-widest shadow-none min-w-[120px]", (messageBody.trim() || attachments.length > 0) ? "bg-[#1f3d2b] text-white" : "bg-black/5 text-black/20")}>
              {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <div className="flex items-center gap-2">
                  <span>Record</span>
                  <Send className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
          <div className="text-center mt-5">
             <span className="text-[8px] font-black uppercase tracking-[0.6em] text-black/5">Clinical Encrypted Recording Corridor Protocol</span>
          </div>
        </div>
      </main>
    </div>
  );
}
