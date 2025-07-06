import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { params: string[] } }
) {
  // Example request: /api/images/logos/logo.png?width=200&height=200
  const [folder, ...fileParts] = params.params;
  const fileName = fileParts.join("/");
  const width = parseInt(req.nextUrl.searchParams.get("width") || "0", 10);
  const height = parseInt(req.nextUrl.searchParams.get("height") || "0", 10);

  // Determine path to the image in the web/public directory
  // The server project lives in apps/server, so we backtrack two levels to reach apps/web/public
  const imagePath = path.join(
    process.cwd(),
    "..",
    "..",
    "web",
    "public",
    folder,
    fileName
  );

  try {
    const imageBuffer = await fs.readFile(imagePath);
    let transformer = sharp(imageBuffer);

    if (width || height) {
      transformer = transformer.resize(width || null, height || null);
    }

    const outputBuffer = await transformer.toBuffer();

    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": "image/png",
        // Cache for 1 day in Vercel / CDN
        "Cache-Control": "public, max-age=86400, must-revalidate",
      },
    });
  } catch (err) {
    return new NextResponse("Image not found or error processing image", {
      status: 404,
    });
  }
} 