import { readFile } from "fs/promises";
import mime from "mime-types";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    // Attends la résolution de `params` si c'est une promesse
    const { filename } = await context.params;

    const filepath = path.join(
      process.cwd(),
      "uploads",
      "images",
      "avatars",
      filename
    );

    const buffer = await readFile(filepath);
    const mimeType = mime.lookup(filepath) || "application/octet-stream";

    const headers = new Headers();
    headers.set("Content-Type", mimeType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier:", error);

    return NextResponse.json({ error: "Image non trouvée" }, { status: 404 });
  }
}
