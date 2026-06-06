import { NextRequest, NextResponse } from "next/server";
import { getChunksForDocument } from "@/lib/documents";
import { retrieveRelevantChunks } from "@/lib/retrieval";
import { generateAnswer } from "@/lib/ai-provider";
import { AskRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AskRequest;
    const { documentId, question } = body;

    if (!documentId || typeof documentId !== "string") {
      return NextResponse.json({ error: "documentId is required" }, { status: 400 });
    }
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }
    if (question.length > 1000) {
      return NextResponse.json({ error: "question must be 1000 characters or fewer" }, { status: 400 });
    }

    const chunks = getChunksForDocument(documentId);
    const relevant = retrieveRelevantChunks(question.trim(), chunks, 3);

    if (relevant.length === 0) {
      return NextResponse.json({
        answer: "No relevant content was found in the document for that question.",
        keyPoints: [],
        sources: [],
        provider: "Mock",
        isMock: true,
        disclaimer:
          "This answer is AI-generated. Always verify with the source document and seek professional advice where appropriate.",
      });
    }

    const result = await generateAnswer(question.trim(), relevant);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("[/api/ask]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
