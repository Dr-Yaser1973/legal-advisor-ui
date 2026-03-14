 // components/library/PDFViewer.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface Props {
  url: string;
  title?: string;
}

export default function PDFViewer({ url, title }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPDF = async () => {
      if (!url) return;
      setLoading(true);
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        renderPage(pdf, 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPDF();
  }, [url]);

  const renderPage = async (pdf: any, pageNum: number) => {
    if (!canvasRef.current) return;
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
  };

  const nextPage = () => {
    if (pdfDoc && currentPage < numPages) {
      setCurrentPage((p) => {
        const np = p + 1;
        renderPage(pdfDoc, np);
        return np;
      });
    }
  };

  const prevPage = () => {
    if (pdfDoc && currentPage > 1) {
      setCurrentPage((p) => {
        const np = p - 1;
        renderPage(pdfDoc, np);
        return np;
      });
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-50">
      <div className="p-2 bg-gray-100 flex justify-between items-center">
        <button onClick={prevPage} disabled={currentPage === 1}>
          ←
        </button>
        <span>
          صفحة {currentPage} من {numPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === numPages}>
          →
        </button>
      </div>
      {loading ? (
        <div className="p-10 text-center text-gray-500">جاري تحميل PDF...</div>
      ) : (
        <canvas ref={canvasRef} className="mx-auto" style={{ maxWidth: "100%" }} />
      )}
    </div>
  );
}