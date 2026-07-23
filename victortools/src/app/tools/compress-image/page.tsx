"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { Download, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function CompressImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState("medium");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<{ name: string; original: number; compressed: number; blob: Blob }[]>([]);

  const handleFiles = useCallback((newFiles: File[]) => {
    const images = newFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...images]);
    setResults([]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const getOptions = () => {
    switch (quality) {
      case "low":
        return { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      case "high":
        return { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true };
      default:
        return { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true };
    }
  };

  const compress = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const opts = getOptions();
      const newResults: typeof results = [];

      for (const file of files) {
        const compressed = await imageCompression(file, opts);
        newResults.push({
          name: file.name,
          original: file.size,
          compressed: compressed.size,
          blob: compressed,
        });
      }

      setResults(newResults);
      toast.success(`Compressed ${newResults.length} image(s)`);
    } catch {
      toast.error("Failed to compress images");
    } finally {
      setProcessing(false);
    }
  }, [files, quality]);

  const download = useCallback((result: typeof results[0]) => {
    const ext = result.name.split(".").pop() || "jpg";
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed-${result.name}`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const downloadAll = useCallback(() => {
    results.forEach((r) => download(r));
    toast.success("Downloaded all images");
  }, [results, download]);

  return (
    <ToolLayout
      title="Compress Image"
      description="Reduce image file size while maintaining visual quality."
      category="image"
    >
      <div className="space-y-6">
        <FileUpload
          onFiles={handleFiles}
          accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] }}
          multiple
          files={files}
          onRemove={removeFile}
        />

        {files.length > 0 && (
          <>
            <div>
              <Label>Compression Level</Label>
              <Select value={quality} onValueChange={(v) => v && setQuality(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (better quality)</SelectItem>
                  <SelectItem value="medium">Medium (balanced)</SelectItem>
                  <SelectItem value="high">High (smallest size)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={compress} disabled={processing} className="w-full">
              <Minimize2 className="h-4 w-4 mr-2" />
              {processing ? "Compressing..." : "Compress Images"}
            </Button>
          </>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{results.length} image(s) compressed</p>
              <Button onClick={downloadAll} size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download All
              </Button>
            </div>
            {results.map((r, i) => {
              const savings = ((1 - r.compressed / r.original) * 100).toFixed(1);
              return (
                <div key={i} className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(r.original / 1024).toFixed(1)} KB → {(r.compressed / 1024).toFixed(1)} KB ({savings}% smaller)
                    </p>
                  </div>
                  <Button onClick={() => download(r)} size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
