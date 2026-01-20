 import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import LawUnitViewClient from "./view.client";

export const dynamic = "force-dynamic";

/**
 * حلّ آمن لاستخراج Base URL (يعمل محليًا وعلى Vercel)
 */
async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host");

  if (!host) throw new Error("Cannot resolve host");

  const proto =
    process.env.NODE_ENV === "development" ? "http" : "https";

  return `${proto}://${host}`;
}

/**
 * جلب المادة القانونية + العلاقات + الأسئلة الشائعة
 */
async function getLawUnit(id: string) {
  try {
    const baseUrl = await getBaseUrl();

    const res = await fetch(`${baseUrl}/api/library/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("API ERROR:", res.status, await res.text());
      return null;
    }

    return res.json();
  } catch (err) {
    console.error("FETCH LAW UNIT ERROR:", err);
    return null;
  }
}

export default async function LawUnitPage(props: {
  params: Promise<{ id: string }>;
}) {
  // 🔥 فك الـ Promise حسب Next 16
  const { id } = await props.params;

  const data = await getLawUnit(id);

  if (!data?.ok) {
    notFound();
  }

  // 🛡️ جلب الجلسة لتحديد الصلاحيات
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user;

  const canEdit = ["ADMIN", "LAWYER"].includes(user?.role);

  return (
    <LawUnitViewClient
      doc={data.doc}
      relations={data.relations}
      faqs={data.faqs}
      canEdit={canEdit}
      userRole={user?.role || "GUEST"}
    />
  );
}
