"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles].filter((f) => f.type === "application/pdf"));
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveFile = useCallback((index: number, direction: "up" | "down") => {
    setFiles((prev) => {
      const arr = [...prev];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= arr.length) return arr;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
  }, []);

  const merge = useCallback(async () => {
    if (files.length < 2) {
      toast.error("Add at least 2 PDF files");
      return;
    }
    setMerging(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      const mergedBytes = await merged.save();
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged.pdf";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PDFs merged successfully!");
    } catch {
      toast.error("Failed to merge PDFs");
    } finally {
      setMerging(false);
    }
  }, [files]);

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Drag to reorder."
      category="pdf"
    >
      <div className="space-y-6">
        <FileUpload
          onFiles={handleFiles}
          accept={{ "application/pdf": [".pdf"] }}
          multiple
          files={files}
          onRemove={removeFile}
        />

        {files.length >= 2 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Drag to reorder or use arrows:</p>
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
                <span className="text-sm font-medium">{i + 1}.</span>
                <span className="text-sm truncate flex-1">{file.name}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveFile(i, "up")} disabled={i === 0}>
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveFile(i, "down")} disabled={i === files.length - 1}>
                  <ArrowDown className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFile(i)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={merge} disabled={files.length < 2 || merging} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          {merging ? "Merging..." : "Merge PDFs"}
        </Button>
      </div>
    </ToolLayout>
  );
}
