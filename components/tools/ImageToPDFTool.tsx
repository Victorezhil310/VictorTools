"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, FileText, Loader2, CheckCircle } from "lucide-react";

export default function ImageToPDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        // Load image into HTMLImageElement to convert/normalize format via canvas
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        ctx.drawImage(img, 0, 0);

        // Export canvas as JPEG bytes
        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.92);
        const res = await fetch(jpegDataUrl);
        const imgBuffer = await res.arrayBuffer();

        // Embed the image
        const embeddedImage = await pdfDoc.embedJpg(imgBuffer);
        
        // Add page matching image dimensions
        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });

        // Clean up URL object memory
        URL.revokeObjectURL(objectUrl);
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = new Uint8Array(pdfBytes).buffer as ArrayBuffer;
      const blob = new Blob([pdfBuffer.slice(0, pdfBuffer.byteLength)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (e: any) {
      console.error(e);
      alert("Error occurred while compiling your images. Ensure your file format is compatible.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Convert Images to PDF document</h2>
      </div>

      <FileDropzone
        files={files}
        onChange={(newFiles) => {
          setFiles(newFiles);
          setDownloadUrl(null);
        }}
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
        maxFiles={10}
        multiple={true}
      />

      <div className="flex flex-col items-center gap-4 pt-4">
        {files.length > 0 && !downloadUrl && (
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 disabled:opacity-50 transition-all w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" /> Compiling document...
              </>
            ) : (
              <>
                <FileText className="h-4.5 w-4.5" /> Convert Image(s) to PDF
              </>
            )}
          </button>
        )}

        {downloadUrl && (
          <div className="w-full space-y-3">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-semibold justify-center">
              <CheckCircle className="h-4.5 w-4.5" /> Document generated successfully!
            </div>

            <a
              href={downloadUrl}
              download="converted-images.pdf"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all w-full"
            >
              <Download className="h-4.5 w-4.5" /> Download Generated PDF
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
