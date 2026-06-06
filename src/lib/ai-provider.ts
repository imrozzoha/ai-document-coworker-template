import { Chunk, AskResponse } from "./types";

const DISCLAIMER =
  "This answer is AI-generated from the selected document. Always verify with the source document and seek appropriate professional advice for legal, financial, HR, medical, or compliance matters.";

// ── Mock provider ─────────────────────────────────────────────────────────────

function mockAnswer(question: string, sources: Chunk[]): AskResponse {
  const topChunk = sources[0]?.text ?? "";
  const sentences = topChunk
    .split(/[.!\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30)
    .slice(0, 2);

  const answer =
    sentences.length > 0
      ? `Based on the document, ${sentences[0].toLowerCase()}.${sentences[1] ? " Additionally, " + sentences[1].toLowerCase() + "." : ""}`
      : "The document contains relevant information on this topic. Please review the source snippets below for details.";

  const keyPoints = sources
    .flatMap((s) =>
      s.text
        .split(/[.\n]/)
        .map((l) => l.trim())
        .filter((l) => l.length > 40 && l.length < 200)
        .slice(0, 1)
    )
    .slice(0, 3);

  return {
    answer,
    keyPoints: keyPoints.length > 0 ? keyPoints : ["Review the source snippets below for relevant details."],
    sources,
    provider: "Mock (no API key required)",
    isMock: true,
    disclaimer: DISCLAIMER,
  };
}

// ── OpenAI provider ───────────────────────────────────────────────────────────

async function openaiAnswer(question: string, sources: Chunk[], apiKey: string, model: string): Promise<AskResponse> {
  const { OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey });

  const context = sources.map((s, i) => `[Source ${i + 1}]\n${s.text}`).join("\n\n");

  const systemPrompt = `You are a document assistant. Answer questions using only the provided document excerpts.
Be concise, factual, and grounded. Do not invent information not present in the context.
Always recommend human review for legal, financial, HR, or compliance matters.
Format your response as JSON: { "answer": "...", "keyPoints": ["...", "..."] }`;

  const userPrompt = `Context:\n${context}\n\nQuestion: ${question}`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    max_tokens: 600,
    temperature: 0.2,
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { answer?: string; keyPoints?: string[] };

  return {
    answer: parsed.answer ?? "Unable to generate an answer.",
    keyPoints: parsed.keyPoints ?? [],
    sources,
    provider: `OpenAI (${model})`,
    isMock: false,
    disclaimer: DISCLAIMER,
  };
}

// ── Claude provider ───────────────────────────────────────────────────────────

async function claudeAnswer(question: string, sources: Chunk[], apiKey: string, model: string): Promise<AskResponse> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey });

  const context = sources.map((s, i) => `[Source ${i + 1}]\n${s.text}`).join("\n\n");

  const systemPrompt = `You are a document assistant. Answer questions using only the provided document excerpts.
Be concise, factual, and grounded. Do not invent information not present in the context.
Always recommend human review for legal, financial, HR, or compliance matters.
Format your response as JSON: { "answer": "...", "keyPoints": ["...", "..."] }`;

  const response = await client.messages.create({
    model,
    max_tokens: 600,
    system: systemPrompt,
    messages: [{ role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }],
  });

  const raw = response.content[0]?.type === "text" ? response.content[0].text : "{}";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const parsed = jsonMatch ? (JSON.parse(jsonMatch[0]) as { answer?: string; keyPoints?: string[] }) : {};

  return {
    answer: parsed.answer ?? "Unable to generate an answer.",
    keyPoints: parsed.keyPoints ?? [],
    sources,
    provider: `Claude (${model})`,
    isMock: false,
    disclaimer: DISCLAIMER,
  };
}

// ── Main entry point ──────────────────────────────────────────────────────────

export async function generateAnswer(question: string, sources: Chunk[]): Promise<AskResponse> {
  const provider = process.env.AI_PROVIDER ?? "mock";
  const openaiKey = process.env.OPENAI_API_KEY ?? "";
  const claudeKey = process.env.ANTHROPIC_API_KEY ?? "";

  if (provider === "openai" && openaiKey) {
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
    return openaiAnswer(question, sources, openaiKey, model);
  }

  if (provider === "claude" && claudeKey) {
    const model = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";
    return claudeAnswer(question, sources, claudeKey, model);
  }

  // Fall back to mock if no valid provider/key is configured
  return mockAnswer(question, sources);
}
