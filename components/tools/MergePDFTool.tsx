"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, FileText, Loader2, Sparkles, CheckCircle } from "lucide-react";

export default function MergePDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      // Create empty PDF document
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        
        // Load the PDF file.
        // We set ignoreEncryption to true if it might be protected (but user must use unlocked files).
        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        
        // Copy pages
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // Save document bytes
      const mergedBytes = await mergedPdf.save();

      // Create download blob
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (e: any) {
      console.error(e);
      alert("Error occurred during PDF merging. Ensure your PDF files are not password-protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Combine PDF Files</h2>
      </div>

      <FileDropzone
        files={files}
        onChange={setFiles}
        accept={{ "application/pdf": [".pdf"] }}
        maxFiles={10}
        multiple={true}
      />

      <div className="flex flex-col items-center gap-4 pt-4">
        {files.length >= 2 && !downloadUrl && (
          <button
            onClick={handleMerge}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 disabled:opacity-50 transition-all w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" /> Merging files...
              </>
            ) : (
              <>
                <FileText className="h-4.5 w-4.5" /> Merge PDF Documents
              </>
            )}
          </button>
        )}

        {downloadUrl && (
          <div className="w-full space-y-3">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-semibold justify-center">
              <CheckCircle className="h-4.5 w-4.5" /> PDFs combined successfully!
            </div>
            
            <a
              href={downloadUrl}
              download="merged-documents.pdf"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all w-full"
            >
              <Download className="h-4.5 w-4.5" /> Download Merged PDF
            </a>

            <button
              onClick={() => {
                setFiles([]);
                setDownloadUrl(null);
              }}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold block text-center mx-auto"
            >
              Clear and Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
