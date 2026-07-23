import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.CONVERT_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "ConvertAPI Key is missing on the server. Please add CONVERT_API_KEY in your server configuration (.env) to enable PDF to Word conversions." 
        }, 
        { status: 501 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const conversionFormData = new FormData();
    conversionFormData.append("File", file);

    const convertResponse = await fetch(
      `https://v2.convertapi.com/convert/pdf/to/docx?Secret=${apiKey}`,
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

    const fileResponse = await fetch(fileUrl);
    const docxBytes = await fileResponse.arrayBuffer();

    return new NextResponse(docxBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.docx"`,
      },
    });
  } catch (e: any) {
    console.error("PDF to Word error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to convert PDF to Word document" },
      { status: 500 }
    );
  }
}
