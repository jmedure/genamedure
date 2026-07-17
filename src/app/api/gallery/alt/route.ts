import { NextResponse } from "next/server";
import {
  generateAltFromImageUrl,
  isAllowedSanityImageUrl,
} from "@/lib/generateAlt";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const ALLOWED_ORIGINS = new Set([
  "https://genamedure.sanity.studio",
  "http://localhost:3333",
  "http://127.0.0.1:3333",
]);

function corsHeaders(origin: string | null): HeadersInit {
  const allowed =
    origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://genamedure.sanity.studio";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return NextResponse.json(
        { ok: false, error: "Origin not allowed" },
        { status: 403, headers },
      );
    }

    const body = (await request.json()) as { imageUrl?: string };
    const imageUrl = body.imageUrl?.trim();
    if (!imageUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing imageUrl" },
        { status: 400, headers },
      );
    }
    if (!isAllowedSanityImageUrl(imageUrl)) {
      return NextResponse.json(
        { ok: false, error: "Image URL must be from this project's Sanity CDN" },
        { status: 400, headers },
      );
    }

    const alt = await generateAltFromImageUrl(imageUrl);
    if (!alt) {
      return NextResponse.json(
        { ok: false, error: "Empty alt from model" },
        { status: 502, headers },
      );
    }

    return NextResponse.json({ ok: true, alt }, { headers });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Alt generation failed";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers },
    );
  }
}
