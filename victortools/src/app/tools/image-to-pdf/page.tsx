"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function ImageToPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((newFiles: File[]) => {
    const images = newFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...images]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) {
      toast.error("Add at least one image");
      return;
    }
    setProcessing(true);
    try {
      const pdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let image;
        if (file.type === "image/png") {
          image = await pdf.embedPng(bytes);
        } else {
          image = await pdf.embedJpg(bytes);
        }

        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "images.pdf";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PDF created successfully!");
    } catch {
      toast.error("Failed to convert images");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  return (
    <ToolLayout
      title="Image to PDF"
      description="Convert JPG, PNG images into a single PDF document."
      category="pdf"
    >
      <div className="space-y-6">
        <FileUpload
          onFiles={handleFiles}
          accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
          multiple
          files={files}
          onRemove={removeFile}
        />

        <Button onClick={convert} disabled={files.length === 0 || processing} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          {processing ? "Converting..." : "Convert to PDF"}
        </Button>
      </div>
    </ToolLayout>
  );
}
