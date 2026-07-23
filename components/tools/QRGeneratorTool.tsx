"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, Download, RefreshCw, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type QRType = "url" | "text" | "wifi" | "vcard" | "email" | "phone";

export default function QRGeneratorTool() {
  const [qrType, setQrType] = useState<QRType>("url");
  
  // Input fields
  const [url, setUrl] = useState("https://victormedia.net");
  const [text, setText] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  
  // vCard fields
  const [vFirstName, setVFirstName] = useState("");
  const [vLastName, setVLastName] = useState("");
  const [vPhone, setVPhone] = useState("");
  const [vEmail, setVEmail] = useState("");
  const [vCompany, setVCompany] = useState("");
  const [vTitle, setVTitle] = useState("");
  
  const [emailAddr, setEmailAddr] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phoneNum, setPhoneNum] = useState("");

  // Styling customizations
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dotType, setDotType] = useState<"rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded">("rounded");
  const [cornerType, setCornerType] = useState<"square" | "dot" | "extra-rounded">("extra-rounded");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("Q");

  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<any>(null);

  // Generate payload string based on type
  const getPayload = () => {
    switch (qrType) {
      case "url":
        return url.trim() || "https://victormedia.net";
      case "text":
        return text || "VictorTools";
      case "wifi":
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vLastName};${vFirstName};;;\nFN:${vFirstName} ${vLastName}\nORG:${vCompany}\nTITLE:${vTitle}\nTEL;TYPE=CELL:${vPhone}\nEMAIL;TYPE=PREF,INTERNET:${vEmail}\nEND:VCARD`;
      case "email":
        return `mailto:${emailAddr}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "phone":
        return `tel:${phoneNum}`;
      default:
        return "VictorTools";
    }
  };

  // Handle logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize and update QR code
  useEffect(() => {
    if (typeof window === "undefined" || !qrRef.current) return;

    // Remove any existing canvases in container
    qrRef.current.innerHTML = "";

    const payload = getPayload();

    try {
      // Dynamic import to support client-only drawing
      const QRCodeStyling = require("qr-code-styling");

      qrInstance.current = new QRCodeStyling({
        width: 260,
        height: 260,
        type: "svg",
        data: payload,
        image: logoUrl,
        dotsOptions: {
          color: fgColor,
          type: dotType,
        },
        backgroundOptions: {
          color: bgColor,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 4,
        },
        cornersSquareOptions: {
          type: cornerType,
        },
        qrOptions: {
          errorCorrectionLevel: errorCorrection,
        },
      });

      qrInstance.current.append(qrRef.current);
    } catch (e) {
      console.error("Failed to load QR generator styling", e);
    }
  }, [
    qrType,
    url,
    text,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    vFirstName,
    vLastName,
    vPhone,
    vEmail,
    vCompany,
    vTitle,
    emailAddr,
    emailSubject,
    emailBody,
    phoneNum,
    fgColor,
    bgColor,
    dotType,
    cornerType,
    logoUrl,
    errorCorrection,
  ]);

  const downloadQR = (format: "png" | "svg") => {
    if (!qrInstance.current) return;
    qrInstance.current.download({
      name: `qr-code-${qrType}`,
      extension: format,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Configuration column */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Type tabs */}
        <div className="flex bg-muted/40 rounded-xl p-1 gap-1 overflow-x-auto">
          {(["url", "text", "wifi", "vcard", "email", "phone"] as QRType[]).map((type) => (
            <button
              key={type}
              onClick={() => setQrType(type)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-xs font-bold capitalize transition-all shrink-0",
                qrType === type ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Input Forms */}
        <div className="space-y-4">
          {qrType === "url" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Target URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background transition-all font-semibold"
              />
            </div>
          )}

          {qrType === "text" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Plain Text</label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type the message you want to embed..."
                className="w-full rounded-xl border border-border bg-muted/20 p-3.5 text-sm outline-none focus:border-primary focus:bg-background transition-all font-medium"
              />
            </div>
          )}

          {qrType === "wifi" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">SSID / Network Name</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="My WiFi Network"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Password</label>
                <input
                  type="password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Password"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Encryption</label>
                <select
                  value={wifiEncryption}
                  onChange={(e) => setWifiEncryption(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-semibold"
                >
                  <option value="WPA">WPA / WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open)</option>
                </select>
              </div>
            </div>
          )}

          {qrType === "vcard" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">First Name</label>
                <input
                  type="text"
                  value={vFirstName}
                  onChange={(e) => setVFirstName(e.target.value)}
                  placeholder="John"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Last Name</label>
                <input
                  type="text"
                  value={vLastName}
                  onChange={(e) => setVLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Phone Number</label>
                <input
                  type="tel"
                  value={vPhone}
                  onChange={(e) => setVPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  value={vEmail}
                  onChange={(e) => setVEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Company Name</label>
                <input
                  type="text"
                  value={vCompany}
                  onChange={(e) => setVCompany(e.target.value)}
                  placeholder="ACME Corp"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Job Title</label>
                <input
                  type="text"
                  value={vTitle}
                  onChange={(e) => setVTitle(e.target.value)}
                  placeholder="Lead Developer"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                />
              </div>
            </div>
          )}

          {qrType === "email" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Recipient Email</label>
                  <input
                    type="email"
                    value={emailAddr}
                    onChange={(e) => setEmailAddr(e.target.value)}
                    placeholder="recipient@example.com"
                    className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Email Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Hello there!"
                    className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Message Body</label>
                <textarea
                  rows={3}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Type your pre-filled email details here..."
                  className="w-full rounded-xl border border-border bg-muted/20 p-3.5 text-sm outline-none focus:border-primary focus:bg-background font-medium"
                />
              </div>
            </div>
          )}

          {qrType === "phone" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Phone Number</label>
              <input
                type="tel"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm outline-none focus:border-primary focus:bg-background transition-all font-semibold"
              />
            </div>
          )}
        </div>

        {/* Customization section */}
        <div className="border-t border-border/40 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Customization Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Color controls */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Foreground Color</label>
                <span className="text-xs font-semibold text-foreground font-mono">{fgColor}</span>
              </div>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-10 w-full rounded-lg border border-border cursor-pointer bg-transparent"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Background Color</label>
                <span className="text-xs font-semibold text-foreground font-mono">{bgColor}</span>
              </div>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-full rounded-lg border border-border cursor-pointer bg-transparent"
              />
            </div>

            {/* Shape controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dot Patterns</label>
              <select
                value={dotType}
                onChange={(e: any) => setDotType(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-semibold"
              >
                <option value="rounded">Rounded Dots</option>
                <option value="dots">Circular Dots</option>
                <option value="classy">Classy Dots</option>
                <option value="classy-rounded">Classy Rounded Dots</option>
                <option value="square">Square Dots</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Corner Square Shape</label>
              <select
                value={cornerType}
                onChange={(e: any) => setCornerType(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-semibold"
              >
                <option value="extra-rounded">Rounded Corners</option>
                <option value="dot">Circular Corners</option>
                <option value="square">Square Corners</option>
              </select>
            </div>

            {/* Logo embedding and Error Correction */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                Embedded Logo <span className="text-[10px] text-muted-foreground font-normal">(Centered)</span>
              </label>
              <label className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-muted/20 px-3 cursor-pointer hover:bg-muted/40 transition-colors">
                <span className="text-xs text-muted-foreground font-medium truncate">
                  {logoFile ? logoFile.name : "Upload logo image..."}
                </span>
                <Upload className="h-4 w-4 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Error Correction Level</label>
              <select
                value={errorCorrection}
                onChange={(e: any) => setErrorCorrection(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-card px-3 text-xs font-semibold"
              >
                <option value="L">L (7% Recovery)</option>
                <option value="M">M (15% Recovery)</option>
                <option value="Q">Q (25% Recovery)</option>
                <option value="H">H (30% Recovery - Recommended for Logo insertion)</option>
              </select>
            </div>

          </div>
        </div>

      </div>

      {/* Output Render Column */}
      <div className="lg:col-span-4 flex flex-col items-center justify-center border-l border-border/40 lg:pl-8 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Main draw target */}
          <div ref={qrRef} className="h-[260px] w-[260px] flex items-center justify-center" />
        </div>

        <div className="w-full flex gap-3">
          <button
            onClick={() => downloadQR("png")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md hover:bg-primary/95 transition-all"
          >
            <Download className="h-4 w-4" /> Download PNG
          </button>
          
          <button
            onClick={() => downloadQR("svg")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-xs font-bold text-foreground hover:bg-muted transition-all"
          >
            <Download className="h-4 w-4" /> Download SVG
          </button>
        </div>
      </div>

    </div>
  );
}
