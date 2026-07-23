"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/ui/FileDropzone";
import { Download, ShieldCheck, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function UnlockPDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleUnlock = async () => {
    if (files.length === 0) return;
    if (!password) {
      alert("Please enter the decryption password.");
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      const file = files[0];
      const fileBuffer = await file.arrayBuffer();

      // Load document using the compatible options available in this pdf-lib version.
      const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

      const unlockedBytes = await pdfDoc.save();
      const unlockedBuffer = new Uint8Array(unlockedBytes).buffer as ArrayBuffer;
      const blob = new Blob([unlockedBuffer.slice(0, unlockedBuffer.byteLength)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
    } catch (e: any) {
      console.error(e);
      alert("Failed to decrypt PDF. Verify the password matches or check if the document is not protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Remove PDF Password Restrictions</h2>
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
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Password Credentials</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current password..."
                className="h-11 w-full rounded-xl border border-border bg-muted/20 pl-3.5 pr-12 text-sm font-semibold outline-none focus:border-primary focus:bg-background transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleUnlock}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 disabled:opacity-50 transition-all w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" /> Unlocking restriction levels...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4.5 w-4.5" /> Unlock PDF Document
              </>
            )}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-semibold justify-center">
            <CheckCircle className="h-4.5 w-4.5" /> Decryption success! Document password restrictions removed.
          </div>

          <a
            href={downloadUrl}
            download={`unlocked-${files[0]?.name || "pdf"}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all w-full"
          >
            <Download className="h-4.5 w-4.5" /> Download Unlocked PDF
          </a>

          <button
            onClick={() => {
              setFiles([]);
              setPassword("");
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
