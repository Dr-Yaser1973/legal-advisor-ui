"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_PARAM,
  dirFor,
  resolveLocale,
} from "@/lib/i18n/config";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * يزامن <html lang> و <html dir> مع اللغة الحالية.
 *
 * لماذا هذا ضروري:
 * في App Router لا يُعاد تصيير الـ root layout أثناء التنقّل الناعم (client-side
 * navigation). فعند الانتقال من "/" إلى "/?lang=en" يُعاد تصيير الصفحة فقط،
 * بينما تبقى سمات <html> كما وُلّدت في أول تحميل — فيظهر نص إنجليزي داخل
 * مستند ما زال dir="rtl".
 *
 * هذا المكوّن عميل، فيتفاعل مع تغيّر الرابط ويصحّح السمات بعد كل تنقّل.
 * التصيير الأول يبقى صحيحاً من الخادم (مهم للزاحف)، وهذا مجرّد مزامنة لاحقة.
 */
export default function HtmlLangSync() {
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get(LOCALE_PARAM);

  useEffect(() => {
    const locale = resolveLocale(
      fromUrl ?? readCookie(LOCALE_COOKIE) ?? DEFAULT_LOCALE,
    );
    const dir = dirFor(locale);
    const el = document.documentElement;

    if (el.lang !== locale) el.lang = locale;
    if (el.dir !== dir) el.dir = dir;
  }, [fromUrl]);

  return null;
}
