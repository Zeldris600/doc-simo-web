import { Suspense } from "react";
import { VerifyForm } from "@/components/auth/verify-form";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Suspense fallback={null}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
