
// app/admin/layout.tsx
import type { ReactNode } from "react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
}
