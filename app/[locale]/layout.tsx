import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BRAND } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${BRAND.name} - Quick, Private, & Ad-Light File Tools`,
  description: `The modern, secure alternative to heavy utility platforms. Generate QR codes, manipulate PDF documents, optimize images, and use developer text tools locally in your browser.`,
  metadataBase: new URL(BRAND.canonicalUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${BRAND.name} - High-Speed Web Tools`,
    description: "Combine PDFs, compress images, generate custom QR codes, and parse format strings client-side.",
    url: BRAND.canonicalUrl,
    siteName: BRAND.name,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-full flex flex-col font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1 bg-background flex flex-col">{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
