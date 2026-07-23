"use client";

import React from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const QRGenerator = dynamic(() => import("@/components/tools/QRGeneratorTool"), { ssr: false });
const MergePDF = dynamic(() => import("@/components/tools/MergePDFTool"), { ssr: false });
const SplitPDF = dynamic(() => import("@/components/tools/SplitPDFTool"), { ssr: false });
const CompressPDF = dynamic(() => import("@/components/tools/CompressPDFTool"), { ssr: false });
const PDFToImage = dynamic(() => import("@/components/tools/PDFToImageTool"), { ssr: false });
const ImageToPDF = dynamic(() => import("@/components/tools/ImageToPDFTool"), { ssr: false });
const WordToPDF = dynamic(() => import("@/components/tools/WordToPDFTool"), { ssr: false });
const PDFToWord = dynamic(() => import("@/components/tools/PDFToWordTool"), { ssr: false });
const ProtectPDF = dynamic(() => import("@/components/tools/ProtectPDFTool"), { ssr: false });
const UnlockPDF = dynamic(() => import("@/components/tools/UnlockPDFTool"), { ssr: false });
const WatermarkPDF = dynamic(() => import("@/components/tools/WatermarkPDFTool"), { ssr: false });
const OrganizePDF = dynamic(() => import("@/components/tools/OrganizePDFTool"), { ssr: false });
const CompressImage = dynamic(() => import("@/components/tools/CompressImageTool"), { ssr: false });
const ConvertImage = dynamic(() => import("@/components/tools/ConvertImageTool"), { ssr: false });
const ResizeImage = dynamic(() => import("@/components/tools/ResizeImageTool"), { ssr: false });
const WordCounter = dynamic(() => import("@/components/tools/WordCounterTool"), { ssr: false });
const JSONFormatter = dynamic(() => import("@/components/tools/JSONFormatterTool"), { ssr: false });
const Base64Tool = dynamic(() => import("@/components/tools/Base64Tool"), { ssr: false });
const PasswordGenerator = dynamic(() => import("@/components/tools/PasswordGeneratorTool"), { ssr: false });
const UnitConverter = dynamic(() => import("@/components/tools/UnitConverterTool"), { ssr: false });
const CaseConverter = dynamic(() => import("@/components/tools/CaseConverterTool"), { ssr: false });
const DiffChecker = dynamic(() => import("@/components/tools/DiffCheckerTool"), { ssr: false });
const InvoiceGenerator = dynamic(() => import("@/components/tools/InvoiceGeneratorTool"), { ssr: false });
const ResumeBuilder = dynamic(() => import("@/components/tools/ResumeBuilderTool"), { ssr: false });

export default function ToolRenderer({ slug }: { slug: string }) {
  switch (slug) {
    case "qr-generator":
      return <QRGenerator />;
    case "merge-pdf":
      return <MergePDF />;
    case "split-pdf":
      return <SplitPDF />;
    case "compress-pdf":
      return <CompressPDF />;
    case "pdf-to-image":
      return <PDFToImage />;
    case "image-to-pdf":
      return <ImageToPDF />;
    case "word-to-pdf":
      return <WordToPDF />;
    case "pdf-to-word":
      return <PDFToWord />;
    case "protect-pdf":
      return <ProtectPDF />;
    case "unlock-pdf":
      return <UnlockPDF />;
    case "watermark-pdf":
      return <WatermarkPDF />;
    case "organize-pdf":
      return <OrganizePDF />;
    case "compress-image":
      return <CompressImage />;
    case "convert-image":
      return <ConvertImage />;
    case "resize-image":
      return <ResizeImage />;
    case "word-counter":
      return <WordCounter />;
    case "json-formatter":
      return <JSONFormatter />;
    case "base64":
      return <Base64Tool />;
    case "password-generator":
      return <PasswordGenerator />;
    case "unit-converter":
      return <UnitConverter />;
    case "case-converter":
      return <CaseConverter />;
    case "diff-checker":
      return <DiffChecker />;
    case "invoice-generator":
      return <InvoiceGenerator />;
    case "resume-builder":
      return <ResumeBuilder />;
    default:
      notFound();
  }
}
