export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "VictorTools";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "victormedia.net";

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    dailyLimit: 20,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    watermark: true,
    batchProcessing: false,
    priorityQueue: false,
  },
  pro: {
    name: "Pro",
    price: 99, // INR
    dailyLimit: -1, // unlimited
    maxFileSize: 100 * 1024 * 1024, // 100MB
    watermark: false,
    batchProcessing: true,
    priorityQueue: true,
  },
} as const;

export type PlanType = keyof typeof PLANS;

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: "qr" | "pdf" | "image" | "text";
  href: string;
  icon: string;
  comingSoon?: boolean;
}

export const TOOLS: Tool[] = [
  // QR Tools
  { id: "qr-generator", name: "QR Generator", description: "Generate QR codes from text, URLs, WiFi, vCard, and more", category: "qr", href: "/tools/qr-generator", icon: "qr-code" },
  { id: "qr-customizer", name: "QR Customizer", description: "Customize QR codes with colors, logos, and styles", category: "qr", href: "/tools/qr-customizer", icon: "palette" },
  
  // PDF Tools
  { id: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDF files into one", category: "pdf", href: "/tools/merge-pdf", icon: "merge" },
  { id: "split-pdf", name: "Split PDF", description: "Extract pages from a PDF file", category: "pdf", href: "/tools/split-pdf", icon: "scissors" },
  { id: "compress-pdf", name: "Compress PDF", description: "Reduce PDF file size while maintaining quality", category: "pdf", href: "/tools/compress-pdf", icon: "minimize-2" },
  { id: "pdf-to-image", name: "PDF to Image", description: "Convert PDF pages to JPG or PNG images", category: "pdf", href: "/tools/pdf-to-image", icon: "image" },
  { id: "image-to-pdf", name: "Image to PDF", description: "Convert images to PDF format", category: "pdf", href: "/tools/image-to-pdf", icon: "file-text" },
  { id: "pdf-password", name: "PDF Password", description: "Add or remove password protection from PDFs", category: "pdf", href: "/tools/pdf-password", icon: "lock" },
  { id: "pdf-watermark", name: "PDF Watermark", description: "Add text or image watermarks to PDFs", category: "pdf", href: "/tools/pdf-watermark", icon: "droplets" },
  { id: "reorder-pdf", name: "Reorder PDF", description: "Reorganize or delete pages in a PDF", category: "pdf", href: "/tools/reorder-pdf", icon: "list-ordered" },
  
  // Image Tools
  { id: "compress-image", name: "Compress Image", description: "Reduce image file size without losing quality", category: "image", href: "/tools/compress-image", icon: "minimize" },
  { id: "convert-image", name: "Convert Image", description: "Convert between PNG, JPG, and WebP formats", category: "image", href: "/tools/convert-image", icon: "refresh-cw" },
  { id: "resize-image", name: "Resize Image", description: "Resize and crop images to any dimension", category: "image", href: "/tools/resize-image", icon: "maximize" },
  
  // Text & Dev Tools
  { id: "word-counter", name: "Word Counter", description: "Count words, characters, and sentences", category: "text", href: "/tools/word-counter", icon: "type" },
  { id: "json-formatter", name: "JSON Formatter", description: "Format, validate, and beautify JSON data", category: "text", href: "/tools/json-formatter", icon: "braces" },
  { id: "base64", name: "Base64 Encoder/Decoder", description: "Encode and decode Base64 strings", category: "text", href: "/tools/base64", icon: "binary" },
  { id: "password-generator", name: "Password Generator", description: "Generate secure random passwords", category: "text", href: "/tools/password-generator", icon: "key" },
  { id: "unit-converter", name: "Unit Converter", description: "Convert between different units of measurement", category: "text", href: "/tools/unit-converter", icon: "ruler" },
];

export const TOOL_CATEGORIES = [
  { id: "qr", name: "QR Tools", description: "Generate and customize QR codes" },
  { id: "pdf", name: "PDF Tools", description: "Edit, convert, and manage PDF files" },
  { id: "image", name: "Image Tools", description: "Compress, convert, and resize images" },
  { id: "text", name: "Text & Dev", description: "Text utilities and developer tools" },
] as const;

export const FREE_DAILY_LIMIT = 20;
export const MAX_FILE_SIZE_FREE = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_SIZE_PRO = 100 * 1024 * 1024; // 100MB
