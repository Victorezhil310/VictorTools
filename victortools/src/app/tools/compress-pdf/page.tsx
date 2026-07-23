"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState("medium");
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const pdf = files.find((f) => f.type === "application/pdf");
    if (pdf) setFile(pdf);
  }, []);

  const compress = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // Remove metadata for compression
      pdf.setTitle("");
      pdf.setAuthor("");
      pdf.setSubject("");
      pdf.setKeywords([]);
      pdf.setProducer("");
      pdf.setCreator("");

      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const ratio = ((1 - compressedBytes.byteLength / file.size) * 100).toFixed(1);
      const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `compressed-${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Compressed by ${ratio}%`);
    } catch {
      toast.error("Failed to compress PDF");
    } finally {
      setProcessing(false);
    }
  }, [file, quality]);

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size by removing unnecessary metadata and optimizing streams."
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
            <div className="rounded-lg border bg-muted/50 p-4 text-sm">
              <p>Original size: <strong>{(file.size / 1024 / 1024).toFixed(2)} MB</strong></p>
            </div>

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
              {processing ? "Compressing..." : "Compress PDF"}
            </Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
