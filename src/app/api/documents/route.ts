import { NextResponse } from "next/server";
import { SAMPLE_DOCUMENTS } from "@/lib/documents";

export async function GET() {
  return NextResponse.json(SAMPLE_DOCUMENTS);
}
