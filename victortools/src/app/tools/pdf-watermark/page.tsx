"use client";

import { useState, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { Download, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function PDFWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(0.3);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const pdf = files.find((f) => f.type === "application/pdf");
    if (pdf) setFile(pdf);
  }, []);

  const addWatermark = useCallback(async () => {
    if (!file || !watermarkText) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: (height - textHeight) / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(45),
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `watermarked-${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Watermark added successfully!");
    } catch {
      toast.error("Failed to add watermark");
    } finally {
      setProcessing(false);
    }
  }, [file, watermarkText, fontSize, opacity]);

  return (
    <ToolLayout
      title="PDF Watermark"
      description="Add a text watermark to all pages of a PDF document."
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
            <div className="space-y-4">
              <div>
                <Label>Watermark Text</Label>
                <Input
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="CONFIDENTIAL"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Font Size: {fontSize}</Label>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <Label>Opacity: {opacity}</Label>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </div>

            <Button onClick={addWatermark} disabled={!watermarkText || processing} className="w-full">
              <Droplets className="h-4 w-4 mr-2" />
              {processing ? "Adding Watermark..." : "Add Watermark"}
            </Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
