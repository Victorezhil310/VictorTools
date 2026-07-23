export interface Tool {
  name: string;
  slug: string;
  description: string;
  category: "qr" | "pdf" | "image" | "dev";
  seoTitle: string;
  seoDescription: string;
}

export const CATEGORIES = {
  qr: {
    name: "QR Tools",
    icon: "QrCode",
  },
  pdf: {
    name: "PDF Tools",
    icon: "FileText",
  },
  image: {
    name: "Image Tools",
    icon: "Image",
  },
  dev: {
    name: "Text & Dev Utilities",
    icon: "Binary",
  },
};

export const TOOLS: Tool[] = [
  // QR Tools
  {
    name: "QR Code Generator",
    slug: "qr-generator",
    description: "Generate customized QR codes for URLs, WiFi, WiFi credentials, vCards, emails, or phone numbers.",
    category: "qr",
    seoTitle: "Free Custom QR Code Generator with Logo - VictorTools",
    seoDescription: "Create custom QR codes with colors, logos, and custom formats. Export to high-quality SVG or PNG instantly.",
  },
  // PDF Tools
  {
    name: "Merge PDF",
    slug: "merge-pdf",
    description: "Combine multiple PDF files into a single document in seconds.",
    category: "pdf",
    seoTitle: "Merge PDF Files Online - Combine PDF Free - VictorTools",
    seoDescription: "Combine multiple PDF files into one. Fast, secure, client-side PDF merging. No file uploads to server required for privacy.",
  },
  {
    name: "Split PDF",
    slug: "split-pdf",
    description: "Extract specific pages or page ranges from your PDF document.",
    category: "pdf",
    seoTitle: "Split PDF Files Online - Extract PDF Pages Free - VictorTools",
    seoDescription: "Split your PDF documents into separate files by page range or extract single pages. Fast and secure client-side splitting.",
  },
  {
    name: "Compress PDF",
    slug: "compress-pdf",
    description: "Reduce the file size of your PDF documents while preserving quality.",
    category: "pdf",
    seoTitle: "Compress PDF Online - Shrink PDF File Size Free - VictorTools",
    seoDescription: "Reduce the size of your PDF files online. Optimizes images and structure client-side for maximum speed and privacy.",
  },
  {
    name: "PDF to Image",
    slug: "pdf-to-image",
    description: "Convert PDF pages into high-quality JPG or PNG images.",
    category: "pdf",
    seoTitle: "PDF to JPG/PNG Converter Online - Free - VictorTools",
    seoDescription: "Convert your PDF document pages into high-quality JPG or PNG images instantly right inside your browser.",
  },
  {
    name: "Image to PDF",
    slug: "image-to-pdf",
    description: "Convert PNG, JPG, or WebP images into a clean PDF document.",
    category: "pdf",
    seoTitle: "Convert Image to PDF Online - JPG/PNG to PDF Free - VictorTools",
    seoDescription: "Turn your images (JPG, PNG, WebP) into a single PDF document in seconds. Safe, private, and client-side.",
  },
  {
    name: "Word to PDF",
    slug: "word-to-pdf",
    description: "Convert Microsoft Word documents (DOC/DOCX) into clean PDFs.",
    category: "pdf",
    seoTitle: "Word to PDF Converter Online - DOCX to PDF Free - VictorTools",
    seoDescription: "Convert your DOC and DOCX files to PDF documents. Simple, fast, and high-fidelity server-side conversion.",
  },
  {
    name: "PDF to Word",
    slug: "pdf-to-word",
    description: "Convert PDF files back into editable Microsoft Word documents.",
    category: "pdf",
    seoTitle: "PDF to Word Converter Online - PDF to DOCX Free - VictorTools",
    seoDescription: "Convert PDF documents back to editable Microsoft Word DOCX format using secure server-side processing.",
  },
  {
    name: "Protect PDF",
    slug: "protect-pdf",
    description: "Add a password to encrypt and secure your PDF documents.",
    category: "pdf",
    seoTitle: "Password Protect PDF - Encrypt PDF Online Free - VictorTools",
    seoDescription: "Add password protection to secure your sensitive PDF documents with secure client-side encryption.",
  },
  {
    name: "Unlock PDF",
    slug: "unlock-pdf",
    description: "Remove password protection from encrypted PDF documents.",
    category: "pdf",
    seoTitle: "Unlock Password Protected PDF Online - Free - VictorTools",
    seoDescription: "Remove password security and restriction from your PDF files client-side. Requires entering the password.",
  },
  {
    name: "Watermark PDF",
    slug: "watermark-pdf",
    description: "Add image or text watermarks to your PDF documents.",
    category: "pdf",
    seoTitle: "Add Watermark to PDF Online Free - VictorTools",
    seoDescription: "Secure your PDF documents by adding a customizable text or image watermark over your pages client-side.",
  },
  {
    name: "Organize PDF",
    slug: "organize-pdf",
    description: "Reorder, rotate, or delete pages in your PDF files.",
    category: "pdf",
    seoTitle: "Organize PDF Pages - Reorder/Delete Pages Free - VictorTools",
    seoDescription: "Reorder, delete, or rotate pages in your PDF document via a visual client-side interface.",
  },
  // Image Tools
  {
    name: "Compress Image",
    slug: "compress-image",
    description: "Reduce image file size of JPG, PNG, and WebP without losing quality.",
    category: "image",
    seoTitle: "Compress Image Online - Reduce Image Size Free - VictorTools",
    seoDescription: "Compress PNG, JPG, JPEG, and WebP images. Easy interface, client-side, instant downloads.",
  },
  {
    name: "Convert Image",
    slug: "convert-image",
    description: "Convert image files between JPG, PNG, WebP, and SVG formats.",
    category: "image",
    seoTitle: "Image Format Converter - PNG/JPG/WebP Free - VictorTools",
    seoDescription: "Convert images to PNG, JPG, or WebP instantly. Secure client-side conversion protects your privacy.",
  },
  {
    name: "Resize & Crop Image",
    slug: "resize-image",
    description: "Resize dimensions or crop images to fit social media shapes.",
    category: "image",
    seoTitle: "Resize and Crop Image Online Free - VictorTools",
    seoDescription: "Resize image dimensions by pixels or percentage, and crop images to preset ratios in your browser.",
  },
  // Dev & Text Utilities
  {
    name: "Word/Char Counter",
    slug: "word-counter",
    description: "Count words, characters, sentences, paragraphs, and reading time.",
    category: "dev",
    seoTitle: "Word Counter - Character & Sentence Counter - VictorTools",
    seoDescription: "Analyze your text in real time with word, character, sentence count, paragraph count, and estimate reading time.",
  },
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, validate, beautify, and minify JSON data with syntax highlights.",
    category: "dev",
    seoTitle: "JSON Formatter & Validator Online Free - VictorTools",
    seoDescription: "Beautify, validate, format, parse, and minify JSON code instantly with tree navigation and syntax errors.",
  },
  {
    name: "Base64 Encoder/Decoder",
    slug: "base64",
    description: "Encode text/files into Base64 format or decode them back to readable content.",
    category: "dev",
    seoTitle: "Base64 Encode & Decode Online Free - VictorTools",
    seoDescription: "Convert plain text to base64 encoding and decode base64 strings back to text securely in your browser.",
  },
  {
    name: "Password Generator",
    slug: "password-generator",
    description: "Create strong, secure, random passwords client-side.",
    category: "dev",
    seoTitle: "Strong Random Password Generator - Secure - VictorTools",
    seoDescription: "Generate random passwords with custom lengths, numbers, symbols, uppercase, and client-side entropy.",
  },
  {
    name: "Unit Converter",
    slug: "unit-converter",
    description: "Convert units of length, mass, temperature, area, and speed.",
    category: "dev",
    seoTitle: "Universal Unit Converter Online Free - VictorTools",
    seoDescription: "Easily convert units for weight, distance, volume, temperature, and speed in real-time.",
  },
  {
    name: "Case Converter",
    slug: "case-converter",
    description: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, and more.",
    category: "dev",
    seoTitle: "Case Converter - UPPERCASE, lowercase, Title Case - VictorTools",
    seoDescription: "Easily convert text to uppercase, lowercase, title case, camelCase, snake_case, and other formats instantly.",
  },
  {
    name: "Diff Checker",
    slug: "diff-checker",
    description: "Compare two blocks of text and highlight the differences (insertions/deletions).",
    category: "dev",
    seoTitle: "Text Compare & Diff Checker Online - VictorTools",
    seoDescription: "Compare two text documents online to find differences. Highlight changes, additions, and deletions instantly.",
  },
  {
    name: "Invoice Generator",
    slug: "invoice-generator",
    description: "Generate professional PDF invoices on the fly.",
    category: "pdf",
    seoTitle: "Free PDF Invoice Generator Online - VictorTools",
    seoDescription: "Create and download professional PDF invoices online instantly. No sign-up required, secure client-side generation.",
  },
  {
    name: "Resume / CV Builder",
    slug: "resume-builder",
    description: "Build clean, professional A4 PDF resumes instantly.",
    category: "pdf",
    seoTitle: "Free Resume & CV Builder Online - Download PDF - VictorTools",
    seoDescription: "Create a professional PDF resume in seconds. Completely private, client-side, free PDF export.",
  },
];
