"use client";

import { useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function QRCustomizerPage() {
  const [value, setValue] = useState("https://victortools.com");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | null>(null);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const downloadSVG = useCallback(() => {
    const svg = document.querySelector("#qr-preview svg") as SVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "custom-qr.svg";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded SVG");
  }, []);

  return (
    <ToolLayout
      title="QR Code Customizer"
      description="Create beautiful QR codes with custom colors and embedded logos."
      category="qr"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr,auto]">
        <div className="space-y-4">
          <div>
            <Label>Content (URL or Text)</Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Foreground Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border"
                />
                <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="font-mono text-xs" />
              </div>
            </div>
            <div>
              <Label>Background Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border"
                />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="font-mono text-xs" />
              </div>
            </div>
          </div>
          <div>
            <Label>Logo (optional)</Label>
            <Input type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
            {logo && (
              <div className="mt-2 flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-10 w-10 rounded object-contain" />
                <Button variant="ghost" size="sm" onClick={() => setLogo(null)}>Remove</Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div id="qr-preview" className="rounded-lg border bg-white p-4 relative">
            <QRCodeSVG
              value={value || " "}
              size={256}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              imageSettings={logo ? { src: logo, x: undefined, y: undefined, height: 48, width: 48, excavate: true } : undefined}
            />
          </div>
          <Button onClick={downloadSVG} disabled={!value}>
            <Download className="h-4 w-4 mr-1" />
            Download SVG
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
