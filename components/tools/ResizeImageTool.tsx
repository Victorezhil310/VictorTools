"use client";

import React, { useState, useEffect } from "react";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, Sliders, Loader2, CheckCircle } from "lucide-react";

export default function ResizeImageTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Dimension states
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);

  // Load image properties
  useEffect(() => {
    if (files.length === 0) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(files[0]);
    img.src = objectUrl;

    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
      URL.revokeObjectURL(objectUrl);
    };
  }, [files]);

  // Sync width when height changes and lock ratio is active
  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.round(val * ratio));
    }
  };

  const handlePreset = (percentage: number) => {
    if (originalWidth === 0) return;
    const factor = percentage / 100;
    setWidth(Math.round(originalWidth * factor));
    setHeight(Math.round(originalHeight * factor));
  };

  const handleResize = async () => {
    if (files.length === 0 || width <= 0 || height <= 0) return;
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
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);

      // Export canvas
      const dataUrl = canvas.toDataURL(file.type, 0.95);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error(e);
      alert("Error occurred while resizing image. Verify image dimensions are valid.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Resize Image Dimensions</h2>
      </div>

      <FileDropzone
        files={files}
        onChange={(newFiles) => {
          setFiles(newFiles.slice(0, 1));
          setDownloadUrl(null);
          setOriginalWidth(0);
          setOriginalHeight(0);
        }}
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
        maxFiles={1}
        multiple={false}
      />

      {files.length > 0 && originalWidth > 0 && !downloadUrl && (
        <div className="space-y-4 pt-4 border-t border-border/40">
          
          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Dimension Presets</span>
            <div className="flex gap-2">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handlePreset(pct)}
                  className="flex-1 rounded-lg border border-border bg-card py-2 text-xs font-bold text-foreground hover:bg-muted transition-all"
                >
                  {pct}% Size
                </button>
              ))}
            </div>
          </div>

          {/* Width & Height custom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Width (px)</label>
              <input
                type="number"
                value={width || ""}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary focus:bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Height (px)</label>
              <input
                type="number"
                value={height || ""}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary focus:bg-background"
              />
            </div>
          </div>

          {/* Lock ratio */}
          <label className="flex items-center gap-3 cursor-pointer text-sm py-1">
            <input
              type="checkbox"
              checked={lockRatio}
              onChange={(e) => setLockRatio(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/20 accent-primary"
            />
            <span className="font-semibold text-muted-foreground">Maintain Aspect Ratio</span>
          </label>

          <button
            onClick={handleResize}
            disabled={isProcessing || width <= 0 || height <= 0}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 disabled:opacity-50 transition-all w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" /> Resizing canvas...
              </>
            ) : (
              <>
                <Sliders className="h-4.5 w-4.5" /> Resize Image
              </>
            )}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-semibold justify-center">
            <CheckCircle className="h-4.5 w-4.5" /> Resize operation complete!
          </div>

          <a
            href={downloadUrl}
            download={`resized-${files[0]?.name}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all w-full"
          >
            <Download className="h-4.5 w-4.5" /> Download Resized Image
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
