// lib/i18n/server.ts
// قراءة اللغة على الخادم. للاستخدام في Server Components فقط.

import { headers, cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  resolveLocale,
  dirFor,
  type Dir,
  type Locale,
} from "./config";

/**
 * ترتيب الأولوية:
 * 1. الترويسة التي يضبطها middleware (وهي مشتقّة من ?lang= أو الكوكي)
 * 2. الكوكي مباشرة — احتياط لو لم يمرّ الطلب عبر middleware
 * 3. الافتراضي (العربية)
 *
 * ملاحظة: headers() و cookies() صارتا async في Next.js 15.
 */
export async function getLocale(): Promise<Locale> {
  try {
    const h = await headers();
    const fromHeader = h.get(LOCALE_HEADER);
    if (fromHeader) return resolveLocale(fromHeader);

    const c = await cookies();
    const fromCookie = c.get(LOCALE_COOKIE)?.value;
    if (fromCookie) return resolveLocale(fromCookie);
  } catch {
    // في سياق لا يسمح بقراءة الطلب (مثل التوليد الثابت) نرجع للافتراضي بهدوء
  }

  return DEFAULT_LOCALE;
}

export async function getDir(): Promise<Dir> {
  return dirFor(await getLocale());
}
