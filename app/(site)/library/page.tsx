 import LawCard from "./_components/LawCard";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host");

  if (!host) {
    throw new Error("Cannot determine host");
  }

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  return `${protocol}://${host}`;
}

async function getLibrary() {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/library`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Library API error:", res.status, await res.text());
    return { ok: false, docs: [] };
  }

  return res.json();
}

export default async function LibraryPage() {
  const data = await getLibrary();
  const docs = Array.isArray(data?.docs) ? data.docs : [];

  return (
    <main className="p-6 space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold text-zinc-100">
        المكتبة القانونية
      </h1>

      {docs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((unit: any) => (
            <LawCard key={unit.id} unit={unit} />
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-400">
          لا توجد قوانين منشورة حاليًا
        </p>
      )}
    </main>
  );
}
