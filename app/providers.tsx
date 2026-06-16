 //app/providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import SentryUserContext from "@/components/SentryUserContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SentryUserContext />
      {children}
    </SessionProvider>
  );
}