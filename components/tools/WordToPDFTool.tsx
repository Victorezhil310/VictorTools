"use client";

import React, { useState } from "react";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, FileText, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export default function WordToPDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setDownloadUrl(null);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const response = await fetch("/api/convert/word-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Server error occurred during conversion.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Failed to convert document.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Convert Word to PDF online</h2>
      </div>

      <FileDropzone
        files={files}
        onChange={(newFiles) => {
          setFiles(newFiles.slice(0, 1));
          setDownloadUrl(null);
          setErrorMsg(null);
        }}
        accept={{
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
          "application/msword": [".doc"],
        }}
        maxFiles={1}
        multiple={false}
      />

      <div className="flex flex-col items-center gap-4 pt-4">
        {files.length > 0 && !downloadUrl && !errorMsg && (
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 disabled:opacity-50 transition-all w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" /> Converting document...
              </>
            ) : (
              <>
                <FileText className="h-4.5 w-4.5" /> Convert Word to PDF
              </>
            )}
          </button>
        )}

        {errorMsg && (
          <div className="w-full space-y-3">
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-600 font-semibold leading-relaxed">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Conversion Blocked</span>
                {errorMsg}
              </div>
            </div>
            
            <button
              onClick={() => {
                setFiles([]);
                setErrorMsg(null);
              }}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold block text-center mx-auto"
            >
              Try Another File
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="w-full space-y-3">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-semibold justify-center">
              <CheckCircle className="h-4.5 w-4.5" /> Word document converted to PDF!
            </div>

            <a
              href={downloadUrl}
              download={`${files[0]?.name.replace(/\.[^/.]+$/, "") || "converted"}.pdf`}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all w-full"
            >
              <Download className="h-4.5 w-4.5" /> Download PDF Document
            </a>

            <button
              onClick={() => {
                setFiles([]);
                setDownloadUrl(null);
              }}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold block text-center mx-auto"
            >
              Convert Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
