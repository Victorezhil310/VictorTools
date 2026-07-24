import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-background text-foreground space-y-4 font-sans">
        <h1 className="text-4xl font-extrabold">404 - Page Not Found</h1>
        <p className="text-muted-foreground text-sm">The page you are looking for could not be loaded or found.</p>
        <Link href="/en" className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary/95 transition-all">
          Return to Home
        </Link>
      </body>
    </html>
  );
}
