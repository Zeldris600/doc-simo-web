"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
} from "@/lib/icons";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const toastClassNames = {
  toast: "!rounded-xl !p-4 !shadow-lg",
  error: "!border !border-red-700/40 !bg-red-600 !text-white",
  success: "!border !border-emerald-700/40 !bg-emerald-600 !text-white",
  info: "!border !border-blue-700/40 !bg-blue-600 !text-white",
  warning:
    "!border !border-amber-700/40 !bg-amber-500 !text-amber-950 [&_[data-icon]]:!text-amber-950",
  loading:
    "!border !border-border !bg-muted !text-foreground [&_[data-icon]]:!text-primary",
  title: "!font-semibold !text-inherit",
  description: "!text-inherit !opacity-90",
  closeButton:
    "!border-current/30 !bg-current/10 !text-inherit hover:!bg-current/20",
} as const;

const Toaster = ({ position = "top-center", ...props }: ToasterProps) => {
  return (
    <Sonner
      position={position}
      offset="1rem"
      gap={10}
      closeButton
      duration={4500}
      className="toaster group"
      toastOptions={{
        classNames: toastClassNames,
      }}
      icons={{
        success: <CheckCircle2 className="size-4 shrink-0 text-white" />,
        info: <Info className="size-4 shrink-0 text-white" />,
        warning: <AlertTriangle className="size-4 shrink-0 text-amber-950" />,
        error: <AlertCircle className="size-4 shrink-0 text-white" />,
        loading: (
          <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
        ),
      }}
      {...props}
    />
  );
};

export { Toaster };
