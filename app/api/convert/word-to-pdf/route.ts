import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.CONVERT_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "ConvertAPI Key is missing on the server. Please add CONVERT_API_KEY in your server configuration (.env) to enable Word to PDF conversions." 
        }, 
        { status: 501 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Call ConvertAPI
    const conversionFormData = new FormData();
    conversionFormData.append("File", file);

    const convertResponse = await fetch(
      `https://v2.convertapi.com/convert/docx/to/pdf?Secret=${apiKey}`,
      {
        method: "POST",
        body: conversionFormData,
      }
    );

    if (!convertResponse.ok) {
      const errText = await convertResponse.text();
      throw new Error(errText || "Conversion API request failed");
    }

    const data = await convertResponse.json();
    const fileUrl = data.Files?.[0]?.Url;

    if (!fileUrl) {
      throw new Error("No output file returned by conversion service");
    }

    // Fetch output file bytes and return to client
    const fileResponse = await fetch(fileUrl);
    const pdfBytes = await fileResponse.arrayBuffer();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.pdf"`,
      },
    });
  } catch (e: any) {
    console.error("Word to PDF error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to convert Word document to PDF" },
      { status: 500 }
    );
  }
}
