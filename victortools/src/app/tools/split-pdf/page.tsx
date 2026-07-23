"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState<"range" | "single">("range");
  const [pageRange, setPageRange] = useState("");
  const [singlePage, setSinglePage] = useState("1");
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const pdf = files.find((f) => f.type === "application/pdf");
    if (pdf) setFile(pdf);
  }, []);

  const parsePages = (range: string, total: number): number[] => {
    const pages: number[] = [];
    const parts = range.split(",").map((s) => s.trim());
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        for (let i = start; i <= Math.min(end, total); i++) {
          pages.push(i - 1);
        }
      } else {
        const p = Number(part);
        if (p >= 1 && p <= total) pages.push(p - 1);
      }
    }
    return [...new Set(pages)];
  };

  const split = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const totalPages = pdf.getPageCount();

      const pageIndices =
        splitMode === "range"
          ? parsePages(pageRange, totalPages)
          : [Number(singlePage) - 1];

      if (pageIndices.length === 0) {
        toast.error("No valid pages selected");
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(newBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `split-${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Extracted ${pageIndices.length} page(s)`);
    } catch {
      toast.error("Failed to split PDF");
    } finally {
      setProcessing(false);
    }
  }, [file, splitMode, pageRange, singlePage]);

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract specific pages from a PDF file by range or individual page number."
      category="pdf"
    >
      <div className="space-y-6">
        <FileUpload
          onFiles={handleFiles}
          accept={{ "application/pdf": [".pdf"] }}
          files={file ? [file] : []}
          onRemove={() => setFile(null)}
        />

        {file && (
          <>
            <Tabs value={splitMode} onValueChange={(v) => v && setSplitMode(v as typeof splitMode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="range">Page Range</TabsTrigger>
                <TabsTrigger value="single">Single Page</TabsTrigger>
              </TabsList>
              <TabsContent value="range" className="mt-4">
                <Label>Page Range (e.g., 1-3, 5, 8-10)</Label>
                <Input
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="1-3, 5, 8-10"
                />
              </TabsContent>
              <TabsContent value="single" className="mt-4">
                <Label>Page Number</Label>
                <Input
                  type="number"
                  min="1"
                  value={singlePage}
                  onChange={(e) => setSinglePage(e.target.value)}
                />
              </TabsContent>
            </Tabs>

            <Button onClick={split} disabled={processing} className="w-full">
              <Scissors className="h-4 w-4 mr-2" />
              {processing ? "Processing..." : "Split PDF"}
            </Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
