import Link from "next/link";
import { APP_NAME, TOOL_CATEGORIES, TOOLS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-brand-foreground text-sm">
                V
              </div>
              {APP_NAME}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Fast, free, and privacy-first online tools. Your files never leave your browser.
            </p>
          </div>

          {TOOL_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <h3 className="text-sm font-semibold">{cat.name}</h3>
              <ul className="mt-3 space-y-2">
                {TOOLS.filter((t) => t.category === cat.id).map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
