"use client";

import React, { useState } from "react";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, RefreshCw, Loader2, CheckCircle } from "lucide-react";

type Format = "image/png" | "image/jpeg" | "image/webp";

export default function ConvertImageTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<Format>("image/png");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const getFormatExtension = (fmt: Format) => {
    switch (fmt) {
      case "image/png": return "png";
      case "image/jpeg": return "jpg";
      case "image/webp": return "webp";
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      const file = files[0];
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Canvas Draw
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      ctx.drawImage(img, 0, 0);

      // Export format
      const dataUrl = canvas.toDataURL(targetFormat, 0.95);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error(e);
      alert("Error occurred while converting image format. Verify file is valid.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Convert Image Format</h2>
      </div>

      <FileDropzone
        files={files}
        onChange={(newFiles) => {
          setFiles(newFiles.slice(0, 1));
          setDownloadUrl(null);
        }}
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
        maxFiles={1}
        multiple={false}
      />

      {files.length > 0 && !downloadUrl && (
        <div className="space-y-4 pt-4 border-t border-border/40">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Convert To</label>
            <select
              value={targetFormat}
              onChange={(e: any) => setTargetFormat(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-semibold"
            >
              <option value="image/png">PNG Format</option>
              <option value="image/jpeg">JPG Format</option>
              <option value="image/webp">WebP Format</option>
            </select>
          </div>

          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 disabled:opacity-50 transition-all w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" /> Converting format...
              </>
            ) : (
              <>
                <RefreshCw className="h-4.5 w-4.5" /> Convert Image Format
              </>
            )}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-semibold justify-center">
            <CheckCircle className="h-4.5 w-4.5" /> Conversion successful!
          </div>

          <a
            href={downloadUrl}
            download={`converted-${files[0]?.name.replace(/\.[^/.]+$/, "")}.${getFormatExtension(targetFormat)}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all w-full"
          >
            <Download className="h-4.5 w-4.5" /> Download Converted Image
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
