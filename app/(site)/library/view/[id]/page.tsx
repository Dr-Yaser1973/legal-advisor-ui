 import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Metadata } from "next";
import LibraryItemViewClient from "./view.client";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function fetchLibraryItem(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/library/items/${id}`, { 
    cache: "no-store",
  });
  
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchLibraryItem(id);
  
  return {
    title: data?.doc?.titleAr ? `${data.doc.titleAr} - المكتبة القانونية` : "المكتبة القانونية",
  };
}

export default async function LibraryItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  if (!id) return notFound();

  const data = await fetchLibraryItem(id);
  if (!data?.doc) return notFound();

  // حل بسيط لمشكلة types
  const session = await getServerSession(authOptions as any) as any;
  const user = session?.user;
  const canEdit = user ? ["ADMIN", "LAWYER"].includes(user?.role) : false;

  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <LibraryItemViewClient
        item={data.doc}
        relatedItems={data.related || []}
        stats={data.stats || { views: 0, downloads: 0, saves: 0 }}
        canEdit={canEdit}
        isAuthenticated={!!user}
        userRole={user?.role || "GUEST"}
        userId={user?.id}
        isFavorited={data.isFavorited || false}
      />
    </Suspense>
  );
}