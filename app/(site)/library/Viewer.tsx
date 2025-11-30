
'use client';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { useEffect } from 'react';

// فعّل الـ worker في المتصفح فقط
if (typeof window !== 'undefined' && (pdfjsLib as any).GlobalWorkerOptions) {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
}

export default function Viewer() {
  useEffect(() => {
    // مثال: تحميل ملف وعرضه.. (اختياري)
    // const loadingTask = (pdfjsLib as any).getDocument('/some.pdf');
    // ...
  }, []);
  return null;
}
