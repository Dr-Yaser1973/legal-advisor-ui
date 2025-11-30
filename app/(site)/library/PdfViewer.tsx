
'use client';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { useEffect, useRef } from 'react';

// ضبط الـ worker في المتصفح فقط
if (typeof window !== 'undefined' && (pdfjsLib as any).GlobalWorkerOptions) {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
}

type Props = {
  src: string; // مسار ملف PDF (رابط عام أو من public)
  page?: number; // رقم الصفحة للعرض
};

export default function PdfViewer({ src, page = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const task = (pdfjsLib as any).getDocument(src);
      const pdf = await task.promise;
      const pg = await pdf.getPage(page);

      const viewport = pg.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await pg.render({ canvasContext: ctx, viewport }).promise;
    }

    render().catch(console.error);
    return () => { cancelled = true; };
  }, [src, page]);

  return (
    <div className="w-full overflow-auto">
      <canvas ref={canvasRef} />
    </div>
  );
}
