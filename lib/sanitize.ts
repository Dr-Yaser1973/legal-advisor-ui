// lib/sanitize.ts
// تعقيم محتوى HTML لمقالات المدونة — قائمة سماح صارمة (وسوم تنسيق فقط).
// يمنع XSS: يزيل <script>، ومعالِجات الأحداث (onclick…)، و javascript: URLs.
import sanitizeHtml from "sanitize-html";

// الوسوم المسموح بها — تطابق ما يعد به محرّر المقالات (تنسيق بسيط)
const ALLOWED_TAGS = [
  "p", "br", "hr", "span", "div",
  "b", "strong", "i", "em", "u", "s", "mark", "small", "sub", "sup",
  "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "blockquote", "code", "pre",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
];

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    "*": ["dir"], // اتجاه النص (rtl/ltr) فقط
  },
  // بروتوكولات آمنة فقط — يمنع javascript:, data: (عدا الصور)
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  // يفرض فتح الروابط بأمان في تبويب جديد
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow", target: "_blank" }),
  },
  // يزيل محتوى هذه الوسوم كلياً (لا يبقي نصها)
  nonTextTags: ["style", "script", "textarea", "option", "noscript"],
  disallowedTagsMode: "discard",
};

/** يعقّم HTML قادماً من المستخدم قبل تخزينه أو عرضه. */
export function sanitizeBlogHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return sanitizeHtml(dirty, SANITIZE_OPTIONS);
}
