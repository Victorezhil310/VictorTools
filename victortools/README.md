# VictorTools

A production-ready, multi-tool utility web app — a fast, clean, ad-light alternative to sites like iLovePDF and Smallpdf.

## Features

### QR Tools
- QR Generator (URL, text, WiFi, vCard, email, phone)
- QR Customizer (colors, logos, styles)

### PDF Tools
- Merge PDFs
- Split PDF (by range or single page)
- Compress PDF
- PDF to Image (JPG/PNG)
- Image to PDF
- PDF Password Protection
- PDF Watermark
- Reorder/Delete Pages

### Image Tools
- Compress Image
- Convert Format (PNG/JPG/WebP)
- Resize Image

### Text & Dev Tools
- Word/Character Counter
- JSON Formatter & Validator
- Base64 Encoder/Decoder
- Password Generator
- Unit Converter

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase (PostgreSQL + RLS)
- **Auth:** Supabase Auth (Email + Google OAuth)
- **Payments:** Razorpay (primary) + Stripe (secondary)
- **Deployment:** Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL in `supabase-schema.sql` in the SQL Editor
3. Enable Google OAuth in Auth > Providers
4. Copy URL and keys to `.env.local`

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build

```bash
npm run build
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/victortools.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables
4. Deploy

### 3. Custom Domain (victormedia.net)

Add these DNS records to your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

Then in Vercel dashboard:
1. Go to Settings > Domains
2. Add `victormedia.net`
3. Add `www.victormedia.net`
4. Set `victormedia.net` as primary

## Database Schema

See `supabase-schema.sql` for the complete schema including:
- Profiles (user accounts + plan status)
- Usage (daily rate limiting)
- Files (uploaded file tracking)
- Orders (payment records)
- Subscriptions

All tables have Row-Level Security (RLS) enabled.

## Adding a New Tool

1. Create the tool file in `src/app/tools/your-tool/page.tsx`:

```tsx
"use client";

import { ToolLayout } from "@/components/tool-layout";

export default function YourToolPage() {
  return (
    <ToolLayout
      title="Your Tool"
      description="What your tool does."
      category="qr" // or "pdf", "image", "text"
    >
      {/* Your tool UI */}
    </ToolLayout>
  );
}
```

2. Add the tool to `src/lib/constants.ts`:

```ts
{
  id: "your-tool",
  name: "Your Tool",
  description: "What your tool does",
  category: "qr",
  href: "/tools/your-tool",
  icon: "qr-code", // Lucide icon name
}
```

3. The tool automatically appears in navigation, homepage grid, and sitemap.

## Architecture

- **Client-side processing:** QR codes, image compression, text tools run entirely in the browser
- **PDF processing:** Uses pdf-lib for client-side operations
- **Server-side:** API routes for rate limiting, payment webhooks, auth
- **File uploads:** Auto-deleted after 1 hour (configurable)

## License

MIT
