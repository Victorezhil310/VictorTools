"use client";

import { useState, useCallback } from "react";
import { Download, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function PDFToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("png");
  const [scale, setScale] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = useCallback((files: File[]) => {
    const pdf = files.find((f) => f.type === "application/pdf");
    if (pdf) {
      setFile(pdf);
      setPreviews([]);
    }
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const newPreviews: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;

        await page.render({ canvasContext: ctx, viewport, canvas: canvas }).promise;

        const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
        newPreviews.push(canvas.toDataURL(mimeType, 0.95));
      }

      setPreviews(newPreviews);
      toast.success(`Converted ${newPreviews.length} page(s)`);
    } catch {
      toast.error("Failed to convert PDF");
    } finally {
      setProcessing(false);
    }
  }, [file, format, scale]);

  const downloadAll = useCallback(() => {
    previews.forEach((preview, i) => {
      const link = document.createElement("a");
      link.href = preview;
      link.download = `page-${i + 1}.${format}`;
      link.click();
    });
    toast.success("Downloaded all pages");
  }, [previews, format]);

  return (
    <ToolLayout
      title="PDF to Image"
      description="Convert PDF pages to JPG or PNG images. Preview and download individually."
      category="pdf"
    >
      <div className="space-y-6">
        <FileUpload
          onFiles={handleFiles}
          accept={{ "application/pdf": [".pdf"] }}
          files={file ? [file] : []}
          onRemove={() => { setFile(null); setPreviews([]); }}
        />

        {file && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Output Format</Label>
                <Select value={format} onValueChange={(v) => v && setFormat(v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Scale (DPI)</Label>
                <Select value={String(scale)} onValueChange={(v) => v && setScale(Number(v))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">72 DPI</SelectItem>
                    <SelectItem value="2">150 DPI</SelectItem>
                    <SelectItem value="3">300 DPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={convert} disabled={processing} className="w-full">
              <Image className="h-4 w-4 mr-2" />
              {processing ? "Converting..." : "Convert to Images"}
            </Button>
          </>
        )}

        {previews.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{previews.length} page(s) converted</p>
              <Button onClick={downloadAll} size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {previews.map((preview, i) => (
                <div key={i} className="rounded-lg border overflow-hidden">
                  <img src={preview} alt={`Page ${i + 1}`} className="w-full" />
                  <div className="flex items-center justify-between p-2 bg-muted/50">
                    <span className="text-xs">Page {i + 1}</span>
                    <a
                      href={preview}
                      download={`page-${i + 1}.${format}`}
                      className="text-xs text-brand hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
