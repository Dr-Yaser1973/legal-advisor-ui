 "use client";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { useEffect, useRef, useState } from "react";

if (typeof window !== "undefined" && (pdfjsLib as any).GlobalWorkerOptions) {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
}

type Props = {
  src: string;   // Signed URL أو public URL
  page?: number;
};

export default function PdfViewer({ src, page = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        setError(null);

        const task = (pdfjsLib as any).getDocument({
          url: src,
          withCredentials: false,
        });

        const pdf = await task.promise;
        if (cancelled) return;

        const pg = await pdf.getPage(page);
        if (cancelled) return;

        const viewport = pg.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await pg.render({ canvasContext: ctx, viewport }).promise;
      } catch (e) {
        console.error("PDF render error:", e);
        if (!cancelled) setError("تعذر تحميل ملف PDF");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [src, page]);

  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-400 border rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto border rounded">
      <canvas ref={canvasRef} />
    </div>
  );
}
