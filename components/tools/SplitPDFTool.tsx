"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, Scissors, Loader2, CheckCircle } from "lucide-react";

export default function SplitPDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1-3");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSplit = async () => {
    if (files.length === 0) {
      alert("Please upload a PDF document first.");
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      const file = files[0];
      const fileBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      const totalPages = srcDoc.getPageCount();

      // Parse range string (e.g., "1-3" or "1, 3, 5")
      const pagesToExtract: number[] = [];
      const parts = range.split(",");

      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes("-")) {
          const [startStr, endStr] = trimmed.split("-");
          const start = parseInt(startStr.trim(), 10);
          const end = parseInt(endStr.trim(), 10);
          
          if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
            throw new Error(`Invalid range: ${trimmed}. Document has ${totalPages} pages.`);
          }
          for (let i = start; i <= end; i++) {
            pagesToExtract.push(i - 1); // 0-indexed conversion
          }
        } else {
          const page = parseInt(trimmed, 10);
          if (isNaN(page) || page < 1 || page > totalPages) {
            throw new Error(`Invalid page number: ${trimmed}. Document has ${totalPages} pages.`);
          }
          pagesToExtract.push(page - 1); // 0-indexed conversion
        }
      }

      if (pagesToExtract.length === 0) {
        throw new Error("No valid pages selected for extraction.");
      }

      // Create new PDF doc and copy select pages
      const splitPdf = await PDFDocument.create();
      const copiedPages = await splitPdf.copyPages(srcDoc, pagesToExtract);
      copiedPages.forEach((page) => splitPdf.addPage(page));

      const splitBytes = await splitPdf.save();
      const splitBuffer = new Uint8Array(splitBytes).buffer as ArrayBuffer;
      const blob = new Blob([splitBuffer.slice(0, splitBuffer.byteLength)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Error occurred while splitting. Please ensure correct page ranges.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Extract Pages from PDF</h2>
      </div>

      <FileDropzone
        files={files}
        onChange={(newFiles) => {
          setFiles(newFiles.slice(0, 1)); // Enforce single file selection
          setDownloadUrl(null);
        }}
        accept={{ "application/pdf": [".pdf"] }}
        maxFiles={1}
        multiple={false}
      />

      {files.length > 0 && !downloadUrl && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Pages to Extract</span>
              <span>e.g., 1-3, 5, 7-10</span>
            </div>
            <input
              type="text"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="e.g. 1-3, 5"
              className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary focus:bg-background transition-all"
            />
          </div>

          <button
            onClick={handleSplit}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 disabled:opacity-50 transition-all w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" /> Splitting document...
              </>
            ) : (
              <>
                <Scissors className="h-4.5 w-4.5" /> Split & Extract PDF
              </>
            )}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-semibold justify-center">
            <CheckCircle className="h-4.5 w-4.5" /> Selected pages extracted!
          </div>

          <a
            href={downloadUrl}
            download={`extracted-pages-${files[0]?.name || "pdf"}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all w-full"
          >
            <Download className="h-4.5 w-4.5" /> Download Extracted PDF
          </a>

          <button
            onClick={() => {
              setFiles([]);
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
