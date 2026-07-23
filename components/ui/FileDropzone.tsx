"use client";

import React, { useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { UploadCloud, File, Trash2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  files: File[];
  onChange: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number; // bytes
  multiple?: boolean;
  disabled?: boolean;
}

export default function FileDropzone({
  files,
  onChange,
  accept,
  maxFiles = 0,
  maxSize = 10 * 1024 * 1024, // default 10MB
  multiple = true,
  disabled = false,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        // Enforce max files if specified
        if (maxFiles > 0 && files.length + acceptedFiles.length > maxFiles) {
          alert(`You can only upload up to ${maxFiles} files.`);
          return;
        }
        onChange([...files, ...acceptedFiles]);
      } else {
        onChange([acceptedFiles[0]]);
      }
    },
    [files, onChange, multiple, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled,
  });

  const removeFile = (indexToRemove: number) => {
    onChange(files.filter((_, idx) => idx !== indexToRemove));
  };

  const clearAll = () => {
    onChange([]);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Dropzone field */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[1.01]" 
            : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <UploadCloud className="h-7 w-7" />
        </div>
        
        <h3 className="text-base font-semibold text-foreground mb-1">
          {isDragActive ? "Drop the files here" : "Drag & drop files here"}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">
          Or click to choose from your device
        </p>
        <span className="text-[10px] text-muted-foreground/75 font-medium px-2.5 py-1 rounded-md bg-muted">
          Max file size: {formatBytes(maxSize)}
        </span>

        {/* Show rejection warnings */}
        {fileRejections.length > 0 && (
          <div className="mt-3 text-xs text-destructive font-semibold">
            Some files were rejected because they exceed size/format restrictions.
          </div>
        )}
      </div>

      {/* Files list */}
      {files.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Files Loaded ({files.length})
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-destructive font-medium transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/40 border border-border/50 text-sm hover:bg-muted/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <File className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate font-medium text-foreground text-xs sm:text-sm">
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground font-semibold">
                    {formatBytes(file.size)}
                  </span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
