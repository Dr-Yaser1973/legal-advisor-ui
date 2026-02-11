 import { Suspense } from "react";
import SetPasswordClient from "./SetPasswordClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">جارٍ التحميل...</div>}>
      <SetPasswordClient />
    </Suspense>
  );
}
