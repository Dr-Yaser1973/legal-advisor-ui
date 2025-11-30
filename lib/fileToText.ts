 // lib/fileToText.ts
import mammoth from "mammoth";
import { Buffer } from "buffer";

/**
 * يحوّل ملف (Blob) إلى نص حسب الامتداد:
 * DOCX → mammoth
 * TXT  → utf8
 * PDF  → pdf-parse
 */
export async function fileToText(
  file: Blob,
  fileName: string,
  fileType: string
): Promise<string> {
  if (!file) return "";

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const lowerName = (fileName || "").toLowerCase();
  const type = fileType || "";

  // 🟦 DOCX
  if (
    lowerName.endsWith(".docx") ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value || "";
  }

  // 🟩 TXT
  if (lowerName.endsWith(".txt") || type.startsWith("text/")) {
    return fileBuffer.toString("utf8");
  }

  // 🟥 PDF
  if (lowerName.endsWith(".pdf") || type === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(fileBuffer);
    return data.text || "";
  }

  throw new Error("نوع الملف غير مدعوم. الرجاء رفع ملف DOCX أو TXT أو PDF.");
}
