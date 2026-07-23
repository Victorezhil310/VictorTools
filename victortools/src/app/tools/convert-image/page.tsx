"use client";

import { useState, useCallback } from "react";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

export default function ConvertImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<{ name: string; blob: Blob; url: string }[]>([]);

  const handleFiles = useCallback((newFiles: File[]) => {
    const images = newFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...images]);
    setResults([]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const convert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const newResults: typeof results = [];
      for (const file of files) {
        const bmp = await createImageBitmap(file);
        const canvas = document.createElement("canvas");
        canvas.width = bmp.width;
        canvas.height = bmp.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(bmp, 0, 0);

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), format, 0.92);
        });

        const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
        const newName = file.name.replace(/\.[^.]+$/, `.${ext}`);
        const url = URL.createObjectURL(blob);
        newResults.push({ name: newName, blob, url });
      }
      setResults(newResults);
      toast.success(`Converted ${newResults.length} image(s)`);
    } catch {
      toast.error("Failed to convert images");
    } finally {
      setProcessing(false);
    }
  }, [files, format]);

  const download = useCallback((result: typeof results[0]) => {
    const link = document.createElement("a");
    link.href = result.url;
    link.download = result.name;
    link.click();
  }, []);

  return (
    <ToolLayout
      title="Convert Image"
      description="Convert images between PNG, JPG, and WebP formats."
      category="image"
    >
      <div className="space-y-6">
        <FileUpload
          onFiles={handleFiles}
          accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"] }}
          multiple
          files={files}
          onRemove={removeFile}
        />

        {files.length > 0 && (
          <>
            <div>
              <Label>Output Format</Label>
              <Select value={format} onValueChange={(v) => v && setFormat(v as OutputFormat)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image/png">PNG</SelectItem>
                  <SelectItem value="image/jpeg">JPG</SelectItem>
                  <SelectItem value="image/webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={convert} disabled={processing} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              {processing ? "Converting..." : "Convert Images"}
            </Button>
          </>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
                <span className="text-sm">{r.name}</span>
                <Button onClick={() => download(r)} size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
