import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS } from "@/lib/tools-registry";
import ToolPageLayout from "@/components/ui/ToolPageLayout";
import ToolRenderer from "@/components/tools/ToolRenderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  
  if (!tool) {
    return {
      title: "Tool Not Found - VictorTools",
    };
  }

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: {
      canonical: `/tools/${slug}`,
    },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: `https://victormedia.net/tools/${slug}`,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  return (
    <ToolPageLayout tool={tool}>
      <ToolRenderer slug={slug} />
    </ToolPageLayout>
  );
}
