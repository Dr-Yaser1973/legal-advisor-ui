// app/api/blog/og/route.tsx
// صورة OG افتراضية مولّدة بهوية المنصّة — تُستخدم للمقالات التي بلا صورة غلاف.
// تحت /api/blog/* ليكون عاماً (مستثنى في middleware.ts) فتصله زواحف التواصل.
// تُستدعى برابط: /api/blog/og?title=...&category=...
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

// خط Almarai ثابت — متوافق مع Satori (Noto Naskh يستخدم جداول تشكيل لا يدعمها Satori)
const FONT_DIR = "public/fonts/Almarai";

// Satori يرسم الفراغ العادي (U+0020) بعرض مبالغ فيه مع العربية فتتباعد الكلمات؛
// استبداله بفراغ رفيع (U+2009) يعيد التباعد إلى وضعه الطبيعي.
// (أما خلل ترتيب النقطتين فيُعالَج بتقسيم العنوان إلى سطرين — انظر titleMain/titleSub.)
const sp = (s: string) => s.replace(/ /g, " ");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawTitle = searchParams.get("title") || "المدوّنة القانونية";
  const title = rawTitle.slice(0, 120);
  const category = searchParams.get("category") || "";

  // Satori يخلط ترتيب العبارتين حول النقطتين في النص العربي (خلل bidi).
  // نتفادى ذلك بتقسيم العنوان عند أول ":" إلى سطرين: العنوان الرئيسي (بالنقطتين)
  // والعنوان الفرعي — فيصبح كل سطر تشكيلة عربية نقية تُرسم باتجاه صحيح.
  const ci = title.indexOf(":");
  const titleMain = ci >= 0 ? title.slice(0, ci + 1) : title;
  const titleSub = ci >= 0 ? title.slice(ci + 1).trim() : "";
  const mainSize = titleMain.length > 42 ? 52 : 62;

  // تحميل خط عربي ثابت (Satori لا يدعم الخطوط المتغيّرة)
  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), FONT_DIR, "Almarai-Bold.ttf")),
    readFile(join(process.cwd(), FONT_DIR, "Almarai-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          direction: "rtl",
          padding: "70px 80px",
          background:
            "radial-gradient(circle at 78% 15%, #1b2935 0%, #0f1923 62%)",
          fontFamily: "Almarai",
          color: "#e8eaed",
        }}
      >
        {/* الرأس: اسم المنصّة + رمز الميزان */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 700, color: "#c9a84c" }}>
            {sp("المستشار القانوني الذكي")}
          </div>
          <svg
            width="66"
            height="66"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c9a84c"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v18" />
            <path d="M7 21h10" />
            <path d="M5 7h14" />
            <path d="M5 7l-2.5 6a3 3 0 0 0 5 0z" />
            <path d="M19 7l-2.5 6a3 3 0 0 0 5 0z" />
            <circle cx="12" cy="4" r="1.3" />
          </svg>
        </div>

        {/* العنوان */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {category ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontSize: 26,
                color: "#c9a84c",
                background: "rgba(201,168,76,0.12)",
                padding: "8px 22px",
                borderRadius: 999,
              }}
            >
              {sp(category)}
            </div>
          ) : (
            <div />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: mainSize,
                fontWeight: 700,
                lineHeight: 1.3,
                color: "#ffffff",
                textAlign: "right",
              }}
            >
              {sp(titleMain)}
            </div>
            {titleSub ? (
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 400,
                  lineHeight: 1.35,
                  color: "#aeb8c2",
                  textAlign: "right",
                }}
              >
                {sp(titleSub)}
              </div>
            ) : null}
          </div>
        </div>

        {/* التذييل: خط الهوية */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 120,
              height: 6,
              borderRadius: 4,
              background: "linear-gradient(to left, #c9a84c, #4caf82)",
            }}
          />
          <div style={{ fontSize: 24, color: "#8a94a0" }}>
            {sp("مقالات وتحليلات قانونية")}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Almarai", data: regular, weight: 400, style: "normal" },
        { name: "Almarai", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
