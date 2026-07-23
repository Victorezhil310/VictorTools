"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, Loader2, CheckCircle, RotateCw, Trash2, ArrowLeft, ArrowRight } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

interface PageState {
  originalIndex: number; // 0-indexed
  rotation: number; // 0, 90, 180, 270
  canvasUrl: string;
}

export default function OrganizePDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pages, setPages] = useState<PageState[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const loadPdfPages = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setPages([]);
    setDownloadUrl(null);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const loadedPages: PageState[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 }); // smaller preview

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvas,
          canvasContext: context,
          viewport,
        };
        await page.render(renderContext).promise;

        loadedPages.push({
          originalIndex: i - 1,
          rotation: 0,
          canvasUrl: canvas.toDataURL(),
        });
      }

      setPages(loadedPages);
    } catch (e) {
      console.error(e);
      alert("Failed to render PDF pages preview. Make sure the file is valid.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    loadPdfPages();
  }, [files]);

  const rotatePage = (index: number) => {
    setPages(
      pages.map((p, idx) => {
        if (idx === index) {
          return { ...p, rotation: (p.rotation + 90) % 360 };
        }
        return p;
      })
    );
  };

  const deletePage = (index: number) => {
    setPages(pages.filter((_, idx) => idx !== index));
  };

  const movePage = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === pages.length - 1) return;

    const newPages = [...pages];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    
    // Swap elements
    const temp = newPages[index];
    newPages[index] = newPages[targetIndex];
    newPages[targetIndex] = temp;

    setPages(newPages);
  };

  const compilePdf = async () => {
    if (pages.length === 0) {
      alert("Please upload and keep at least one page to compile.");
      return;
    }

    setIsProcessing(true);

    try {
      const file = files[0];
      const fileBuffer = await file.arrayBuffer();
      
      // Load source doc
      const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      const targetDoc = await PDFDocument.create();

      // For each remaining page, copy it into new doc
      for (const pageState of pages) {
        const [copiedPage] = await targetDoc.copyPages(srcDoc, [pageState.originalIndex]);
        
        // Apply rotation
        if (pageState.rotation !== 0) {
          // get existing rotation and add ours
          const existingRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((existingRotation + pageState.rotation) % 360));
        }

        targetDoc.addPage(copiedPage);
      }

      const compiledBytes = await targetDoc.save();
      const compiledBuffer = new Uint8Array(compiledBytes).buffer as ArrayBuffer;
      const blob = new Blob([compiledBuffer.slice(0, compiledBuffer.byteLength)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (e: any) {
      console.error(e);
      alert("Error occurred while compiling pages. Verify file format.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Reorder, Rotate or Delete PDF Pages</h2>
      </div>

      {files.length === 0 && (
        <FileDropzone
          files={files}
          onChange={setFiles}
          accept={{ "application/pdf": [".pdf"] }}
          maxFiles={1}
          multiple={false}
        />
      )}

      {isProcessing && pages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-sm font-semibold text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" /> Rendering PDF layout...
        </div>
      )}

      {pages.length > 0 && !downloadUrl && (
        <div className="space-y-6">
          {/* Action header */}
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pages ({pages.length})</span>
            <button
              onClick={compilePdf}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary/95 disabled:opacity-50 transition-all"
            >
              {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save & Download PDF"}
            </button>
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {pages.map((p, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card p-3 space-y-3 relative group">
                
                {/* Visual Representation of Page */}
                <div className="relative border border-border/40 rounded-lg overflow-hidden bg-muted/40 aspect-[3/4] flex items-center justify-center">
                  <img
                    src={p.canvasUrl}
                    alt={`Page ${p.originalIndex + 1}`}
                    style={{ transform: `rotate(${p.rotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 shadow-sm"
                  />
                  <div className="absolute top-2 left-2 rounded-md bg-foreground/80 px-2 py-0.5 text-[10px] font-black text-background">
                    {idx + 1}
                  </div>
                </div>

                {/* Card Controls */}
                <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                  <div className="flex gap-1">
                    <button
                      onClick={() => movePage(idx, "left")}
                      disabled={idx === 0}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                      title="Move Left"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => movePage(idx, "right")}
                      disabled={idx === pages.length - 1}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                      title="Move Right"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => rotatePage(idx)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      title="Rotate 90°"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deletePage(idx)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete Page"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {downloadUrl && (
        <div className="space-y-3 max-w-sm mx-auto">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-semibold justify-center">
            <CheckCircle className="h-4.5 w-4.5" /> PDF compilation completed!
          </div>

          <a
            href={downloadUrl}
            download={`organized-${files[0]?.name || "document.pdf"}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all w-full"
          >
            <Download className="h-4.5 w-4.5" /> Download Organized PDF
          </a>

          <button
            onClick={() => {
              setFiles([]);
              setPages([]);
              setDownloadUrl(null);
            }}
            className="text-xs text-muted-foreground hover:text-foreground font-semibold block text-center mx-auto"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
