"use client";

import React, { useState } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, Type, Image as ImageIcon, Loader2, CheckCircle, Upload } from "lucide-react";

export default function WatermarkPDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
  
  // Text configurations
  const [text, setText] = useState("VictorTools");
  const [color, setColor] = useState("#ff0000"); // Red default
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3); // transparent
  const [rotation, setRotation] = useState(-45); // rotated diagonally

  // Image configurations
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleApplyWatermark = async () => {
    if (files.length === 0) return;
    if (watermarkType === "text" && !text) {
      alert("Please enter a watermark text.");
      return;
    }
    if (watermarkType === "image" && !imageFile) {
      alert("Please upload a watermark image.");
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      const file = files[0];
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Hex to RGB parser helper
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16) / 255,
              g: parseInt(result[2], 16) / 255,
              b: parseInt(result[3], 16) / 255,
            }
          : { r: 1, g: 0, b: 0 };
      };

      const rgbColor = hexToRgb(color);

      // Embedded Image logic if image type selected
      let embeddedImage: any = null;
      if (watermarkType === "image" && imageFile) {
        const imageBuffer = await imageFile.arrayBuffer();
        if (imageFile.type === "image/png" || imageFile.name.endsWith(".png")) {
          embeddedImage = await pdfDoc.embedPng(imageBuffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBuffer);
        }
      }

      for (const page of pages) {
        const { width, height } = page.getSize();
        
        if (watermarkType === "text") {
          // Draw diagonal text in center
          page.drawText(text, {
            x: width / 2 - (text.length * (fontSize * 0.3)),
            y: height / 2,
            size: fontSize,
            font: font,
            color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
            opacity: opacity,
            rotate: degrees(rotation),
          });
        } else if (embeddedImage) {
          // Embed image in center
          const scale = 0.5; // fit in page scale
          const imgWidth = embeddedImage.width * scale;
          const imgHeight = embeddedImage.height * scale;

          page.drawImage(embeddedImage, {
            x: width / 2 - imgWidth / 2,
            y: height / 2 - imgHeight / 2,
            width: imgWidth,
            height: imgHeight,
            opacity: opacity,
          });
        }
      }

      const watermarkedBytes = await pdfDoc.save();
      const blob = new Blob([watermarkedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
    } catch (e: any) {
      console.error(e);
      alert("Failed to watermark PDF. Verify it is a valid and unencrypted PDF document.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Overlay Watermark to PDF</h2>
      </div>

      <FileDropzone
        files={files}
        onChange={(newFiles) => {
          setFiles(newFiles.slice(0, 1));
          setDownloadUrl(null);
        }}
        accept={{ "application/pdf": [".pdf"] }}
        maxFiles={1}
        multiple={false}
      />

      {files.length > 0 && !downloadUrl && (
        <div className="space-y-4 pt-4 border-t border-border/40">
          
          {/* Watermark Selector tabs */}
          <div className="flex bg-muted/40 rounded-xl p-1 gap-1">
            <button
              onClick={() => setWatermarkType("text")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                watermarkType === "text" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Type className="h-4 w-4" /> Text Watermark
            </button>
            <button
              onClick={() => setWatermarkType("image")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                watermarkType === "image" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="h-4 w-4" /> Image Watermark
            </button>
          </div>

          {/* Form configs */}
          {watermarkType === "text" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Watermark Text</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary focus:bg-background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Watermark Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border cursor-pointer bg-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Font Size ({fontSize}px)</label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Opacity ({Math.round(opacity * 100)}%)</label>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Rotation ({rotation}°)</label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Watermark Image File</label>
                <label className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-muted/20 px-3 cursor-pointer hover:bg-muted/40 transition-colors">
                  <span className="text-xs text-muted-foreground font-medium truncate">
                    {imageFile ? imageFile.name : "Select JPG or PNG image..."}
                  </span>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Opacity ({Math.round(opacity * 100)}%)</label>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleApplyWatermark}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 disabled:opacity-50 transition-all w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" /> Rendering overlay...
              </>
            ) : (
              <>
                <CheckCircle className="h-4.5 w-4.5" /> Apply Watermark
              </>
            )}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-semibold justify-center">
            <CheckCircle className="h-4.5 w-4.5" /> Watermark overlay embedded!
          </div>

          <a
            href={downloadUrl}
            download={`watermarked-${files[0]?.name || "pdf"}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all w-full"
          >
            <Download className="h-4.5 w-4.5" /> Download Watermarked PDF
          </a>

          <button
            onClick={() => {
              setFiles([]);
              setImageFile(null);
              setDownloadUrl(null);
            }}
            className="text-xs text-muted-foreground hover:text-foreground font-semibold block text-center mx-auto"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
