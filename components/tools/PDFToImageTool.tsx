"use client";

import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, ImageIcon, Loader2 } from "lucide-react";

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

interface PageImage {
  pageNum: number;
  url: string;
}

export default function PDFToImageTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [images, setImages] = useState<PageImage[]>([]);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");

  const convertPdfToImages = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setImages([]);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const resultImages: PageImage[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 }); // High-quality render scale

        // Create canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;

        // Get image URL
        const url = canvas.toDataURL(format);
        resultImages.push({ pageNum, url });
      }

      setImages(resultImages);
    } catch (e) {
      console.error(e);
      alert("Error occurred while rendering PDF pages. Please verify the document is not corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Convert PDF pages to Images</h2>
      </div>

      <FileDropzone
        files={files}
        onChange={(newFiles) => {
          setFiles(newFiles.slice(0, 1));
          setImages([]);
        }}
        accept={{ "application/pdf": [".pdf"] }}
        maxFiles={1}
        multiple={false}
      />

      {files.length > 0 && images.length === 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Output Format</label>
            <select
              value={format}
              onChange={(e: any) => setFormat(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-semibold"
            >
              <option value="image/png">PNG Format</option>
              <option value="image/jpeg">JPG Format</option>
            </select>
          </div>

          <button
            onClick={convertPdfToImages}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 disabled:opacity-50 transition-all w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" /> Rendering PDF pages...
              </>
            ) : (
              <>
                <ImageIcon className="h-4.5 w-4.5" /> Convert to Images
              </>
            )}
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border/40">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Generated Images ({images.length})</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {images.map((img) => (
              <div key={img.pageNum} className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-3">
                <img
                  src={img.url}
                  alt={`Page ${img.pageNum}`}
                  className="rounded-lg border border-border/50 bg-background max-h-48 object-contain w-full"
                />
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-foreground">Page {img.pageNum}</span>
                  <a
                    href={img.url}
                    download={`page-${img.pageNum}.${format === "image/png" ? "png" : "jpg"}`}
                    className="flex items-center gap-1 text-primary font-bold hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setFiles([]);
              setImages([]);
            }}
            className="text-xs text-muted-foreground hover:text-foreground font-semibold block text-center mx-auto pt-4"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
