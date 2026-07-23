"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

interface PageInfo {
  index: number;
  label: string;
}

export default function ReorderPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(async (files: File[]) => {
    const pdf = files.find((f) => f.type === "application/pdf");
    if (!pdf) return;
    setFile(pdf);
    const bytes = await pdf.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const pageCount = doc.getPageCount();
    setPages(
      Array.from({ length: pageCount }, (_, i) => ({
        index: i,
        label: `Page ${i + 1}`,
      }))
    );
  }, []);

  const movePage = useCallback((index: number, direction: "up" | "down") => {
    setPages((prev) => {
      const arr = [...prev];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= arr.length) return arr;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
  }, []);

  const removePage = useCallback((index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const save = useCallback(async () => {
    if (!file || pages.length === 0) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const newDoc = await PDFDocument.create();

      const pageIndices = pages.map((p) => p.index);
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reordered-${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PDF reordered successfully!");
    } catch {
      toast.error("Failed to reorder PDF");
    } finally {
      setProcessing(false);
    }
  }, [file, pages]);

  return (
    <ToolLayout
      title="Reorder / Delete Pages"
      description="Reorganize or remove pages from a PDF document."
      category="pdf"
    >
      <div className="space-y-6">
        <FileUpload
          onFiles={handleFiles}
          accept={{ "application/pdf": [".pdf"] }}
          files={file ? [file] : []}
          onRemove={() => { setFile(null); setPages([]); }}
        />

        {pages.length > 0 && (
          <>
            <div className="space-y-2">
              <Label>Page Order ({pages.length} pages)</Label>
              {pages.map((page, i) => (
                <div
                  key={`${page.index}-${i}`}
                  className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2"
                >
                  <span className="text-sm font-medium w-6">{i + 1}.</span>
                  <span className="text-sm flex-1">{page.label}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => movePage(i, "up")} disabled={i === 0}>
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => movePage(i, "down")} disabled={i === pages.length - 1}>
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removePage(i)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            <Button onClick={save} disabled={pages.length === 0 || processing} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {processing ? "Saving..." : "Save Reordered PDF"}
            </Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
