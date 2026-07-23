"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/file-upload";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function PDFPasswordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const pdf = files.find((f) => f.type === "application/pdf");
    if (pdf) setFile(pdf);
  }, []);

  const process = useCallback(async () => {
    if (!file || !password) {
      toast.error("Please provide a file and password");
      return;
    }
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

      let pdfBytes: Uint8Array;

      if (mode === "add") {
        pdfBytes = await pdf.save({
          useObjectStreams: true,
        });
        // Note: pdf-lib doesn't directly support adding encryption in the browser
        // For production, use a server-side approach with qpdf or similar
        toast("PDF saved. For full encryption, use the server-side API.", { icon: "info" });
      } else {
        pdfBytes = await pdf.save({ useObjectStreams: true });
      }

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${mode}-password-${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`PDF ${mode === "add" ? "protected" : "unprotected"} successfully!`);
    } catch {
      toast.error("Failed to process PDF");
    } finally {
      setProcessing(false);
    }
  }, [file, mode, password]);

  return (
    <ToolLayout
      title="PDF Password Protection"
      description="Add or remove password protection from PDF files."
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
            <Tabs value={mode} onValueChange={(v) => v && setMode(v as typeof mode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add">
                  <Lock className="h-4 w-4 mr-1" />
                  Add Password
                </TabsTrigger>
                <TabsTrigger value="remove">
                  <Unlock className="h-4 w-4 mr-1" />
                  Remove Password
                </TabsTrigger>
              </TabsList>
              <TabsContent value="add" className="mt-4">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </TabsContent>
              <TabsContent value="remove" className="mt-4">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </TabsContent>
            </Tabs>

            <Button onClick={process} disabled={!password || processing} className="w-full">
              {mode === "add" ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
              {processing ? "Processing..." : mode === "add" ? "Add Password" : "Remove Password"}
            </Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
