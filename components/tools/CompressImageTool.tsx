"use client";

import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, Minimize2, Loader2, CheckCircle } from "lucide-react";

export default function CompressImageTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  
  // Custom configurations
  const [maxSizeMB, setMaxSizeMB] = useState(1); // Target 1MB
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setDownloadUrl(null);
    setCompressedFile(null);

    try {
      const file = files[0];
      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: maxWidthOrHeight,
        useWebWorker: true,
      };

      const compressed = await imageCompression(file, options);
      const url = URL.createObjectURL(compressed);

      setCompressedFile(compressed as File);
      setDownloadUrl(url);
    } catch (e) {
      console.error(e);
      alert("Error compressing the image file. Ensure it is a valid JPG, PNG, or WebP image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Optimize Image File Size</h2>
      </div>

      <FileDropzone
        files={files}
        onChange={(newFiles) => {
          setFiles(newFiles.slice(0, 1));
          setDownloadUrl(null);
          setCompressedFile(null);
        }}
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
        maxFiles={1}
        multiple={false}
      />

      {files.length > 0 && !downloadUrl && (
        <div className="space-y-4 pt-4 border-t border-border/40">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Target Max Size ({maxSizeMB}MB)</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={maxSizeMB}
                onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Max Dimensions ({maxWidthOrHeight}px)</label>
              <select
                value={maxWidthOrHeight}
                onChange={(e) => setMaxWidthOrHeight(parseInt(e.target.value))}
                className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-semibold"
              >
                <option value="1920">1920px (Full HD)</option>
                <option value="1280">1280px (Standard)</option>
                <option value="800">800px (Web Optimized)</option>
                <option value="400">400px (Thumbnail)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 disabled:opacity-50 transition-all w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" /> Compressing image...
              </>
            ) : (
              <>
                <Minimize2 className="h-4.5 w-4.5" /> Compress Image
              </>
            )}
          </button>
        </div>
      )}

      {downloadUrl && compressedFile && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-500 pb-1">
              <CheckCircle className="h-4.5 w-4.5" /> Compression complete!
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Before Size</span>
                <span className="text-foreground text-sm font-black">{formatBytes(files[0].size)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">After Size</span>
                <span className="text-foreground text-sm font-black">
                  {formatBytes(compressedFile.size)} (
                  {Math.round(((files[0].size - compressedFile.size) / files[0].size) * 100)}% savings)
                </span>
              </div>
            </div>
          </div>

          <a
            href={downloadUrl}
            download={`compressed-${files[0]?.name}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all w-full"
          >
            <Download className="h-4.5 w-4.5" /> Download Compressed Image
          </a>

          <button
            onClick={() => {
              setFiles([]);
              setDownloadUrl(null);
              setCompressedFile(null);
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
