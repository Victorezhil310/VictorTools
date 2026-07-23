import React from "react";
import Link from "next/link";
import { Tool, CATEGORIES } from "@/lib/tools-registry";
import { QrCode, FileText, Image as ImageIcon, Terminal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
}

const iconMap = {
  qr: QrCode,
  pdf: FileText,
  image: ImageIcon,
  dev: Terminal,
};

const bgColors = {
  qr: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  pdf: "bg-red-500/10 text-red-500 border-red-500/20",
  image: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  dev: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
};

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = iconMap[tool.category] || FileText;
  const categoryMeta = CATEGORIES[tool.category];
  const colorClasses = bgColors[tool.category] || bgColors.pdf;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md dark:hover:shadow-primary/5"
    >
      <div className="space-y-4">
        {/* Category & Icon */}
        <div className="flex items-center justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", colorClasses)}>
            <IconComponent className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {categoryMeta?.name}
          </span>
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover:translate-x-0">
        Use Tool <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
