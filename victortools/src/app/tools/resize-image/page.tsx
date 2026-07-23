"use client";

import { useState, useCallback } from "react";
import { Download, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function ResizeImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });

  const handleFiles = useCallback((files: File[]) => {
    const img = files.find((f) => f.type.startsWith("image/"));
    if (!img) return;
    setFile(img);
    setPreview(null);

    const url = URL.createObjectURL(img);
    const image = new Image();
    image.onload = () => {
      setOriginalDimensions({ w: image.width, h: image.height });
      setWidth(image.width);
      setHeight(image.height);
    };
    image.src = url;
  }, []);

  const handleWidthChange = useCallback(
    (newWidth: number) => {
      setWidth(newWidth);
      if (maintainAspect && originalDimensions.w > 0) {
        setHeight(Math.round((newWidth / originalDimensions.w) * originalDimensions.h));
      }
    },
    [maintainAspect, originalDimensions]
  );

  const handleHeightChange = useCallback(
    (newHeight: number) => {
      setHeight(newHeight);
      if (maintainAspect && originalDimensions.h > 0) {
        setWidth(Math.round((newHeight / originalDimensions.h) * originalDimensions.w));
      }
    },
    [maintainAspect, originalDimensions]
  );

  const resize = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bmp = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bmp, 0, 0, width, height);

      const blob = await new Promise<Blob>((resolve) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        const type = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
        canvas.toBlob((b) => resolve(b!), type, 0.92);
      });

      const url = URL.createObjectURL(blob);
      setPreview(url);
      toast.success("Image resized!");
    } catch {
      toast.error("Failed to resize image");
    } finally {
      setProcessing(false);
    }
  }, [file, width, height]);

  const download = useCallback(() => {
    if (!preview || !file) return;
    const ext = file.name.split(".").pop() || "jpg";
    const link = document.createElement("a");
    link.href = preview;
    link.download = `resized-${file.name.replace(/\.[^.]+$/, `.${ext}`)}`;
    link.click();
  }, [preview, file]);

  return (
    <ToolLayout
      title="Resize Image"
      description="Resize images to specific dimensions. Maintains aspect ratio by default."
      category="image"
    >
      <div className="space-y-6">
        <FileUpload
          onFiles={handleFiles}
          accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
          files={file ? [file] : []}
          onRemove={() => { setFile(null); setPreview(null); }}
        />

        {file && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10000"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10000"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={maintainAspect}
                onChange={(e) => setMaintainAspect(e.target.checked)}
                className="rounded"
              />
              Maintain aspect ratio
            </label>

            <Button onClick={resize} disabled={processing} className="w-full">
              <Maximize className="h-4 w-4 mr-2" />
              {processing ? "Resizing..." : "Resize Image"}
            </Button>
          </>
        )}

        {preview && (
          <div className="space-y-4">
            <div className="rounded-lg border overflow-hidden">
              <img src={preview} alt="Resized" className="w-full" />
            </div>
            <Button onClick={download} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Resized Image
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
