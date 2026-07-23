"use client";

import { useState, useRef, useCallback } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

type QRType = "url" | "text" | "wifi" | "vcard" | "email" | "phone";

export default function QRGeneratorPage() {
  const [qrType, setQrType] = useState<QRType>("url");
  const [value, setValue] = useState("");
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [ecLevel, setEcLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [size, setSize] = useState(256);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getQRValue = useCallback(() => {
    switch (qrType) {
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`;
      case "email":
        return `mailto:${value}`;
      case "phone":
        return `tel:${value}`;
      default:
        return value;
    }
  }, [qrType, value, wifiSSID, wifiPassword, wifiEncryption]);

  const qrValue = getQRValue();

  const downloadPNG = useCallback(() => {
    const canvas = document.querySelector("#qr-canvas canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-code-${qrType}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Downloaded PNG");
  }, [qrType]);

  const downloadSVG = useCallback(() => {
    const svg = document.querySelector("#qr-svg svg") as SVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `qr-code-${qrType}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded SVG");
  }, [qrType]);

  const copyValue = useCallback(() => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [qrValue]);

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Generate QR codes from text, URLs, WiFi credentials, vCard, email, or phone numbers."
      category="qr"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr,auto]">
        <div className="space-y-6">
          <Tabs value={qrType} onValueChange={(v) => setQrType(v as QRType)}>
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="wifi">WiFi</TabsTrigger>
              <TabsTrigger value="vcard">vCard</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div>
                <Label>URL</Label>
                <Input
                  placeholder="https://example.com"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4 mt-4">
              <div>
                <Label>Text</Label>
                <Textarea
                  placeholder="Enter any text..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="wifi" className="space-y-4 mt-4">
              <div>
                <Label>Network Name (SSID)</Label>
                <Input
                  placeholder="MyWiFiNetwork"
                  value={wifiSSID}
                  onChange={(e) => setWifiSSID(e.target.value)}
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                />
              </div>
              <div>
                <Label>Encryption</Label>
                <Select value={wifiEncryption} onValueChange={(v) => v && setWifiEncryption(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="vcard" className="space-y-4 mt-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="John Doe" value={value} onChange={(e) => setValue(e.target.value)} />
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 mt-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4 mt-4">
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Customization */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <Label>Foreground</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border"
                />
                <Input
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <Label>Background</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <Label>Error Correction</Label>
              <Select value={ecLevel} onValueChange={(v) => v && setEcLevel(v as typeof ecLevel)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Size</Label>
              <Select value={String(size)} onValueChange={(v) => v && setSize(Number(v))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128px</SelectItem>
                  <SelectItem value="256">256px</SelectItem>
                  <SelectItem value="512">512px</SelectItem>
                  <SelectItem value="1024">1024px</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-lg border bg-white p-4">
            {qrValue ? (
              <>
                <div id="qr-svg" className="hidden">
                  <QRCodeSVG
                    value={qrValue}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={ecLevel}
                  />
                </div>
                <QRCodeCanvas
                  ref={canvasRef}
                  value={qrValue}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={ecLevel}
                />
              </>
            ) : (
              <div
                className="flex items-center justify-center bg-muted text-muted-foreground text-sm"
                style={{ width: size, height: size }}
              >
                Enter content to generate QR
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={downloadPNG} disabled={!qrValue} size="sm">
              <Download className="h-4 w-4 mr-1" />
              PNG
            </Button>
            <Button onClick={downloadSVG} disabled={!qrValue} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              SVG
            </Button>
            <Button onClick={copyValue} disabled={!qrValue} size="sm" variant="outline">
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              Copy
            </Button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
