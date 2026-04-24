import { NextRequest, NextResponse } from "next/server";
import { getDramaDetails } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const drama = await getDramaDetails(Number(id));
    return NextResponse.json(drama);
  } catch (err) {
    console.error("Drama detail error:", err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
