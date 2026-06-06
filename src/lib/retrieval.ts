import { Chunk } from "./types";

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "to", "of", "in", "for", "on", "with", "at", "by", "from", "as",
  "into", "through", "during", "before", "after", "above", "below",
  "and", "but", "or", "nor", "not", "so", "yet", "both", "either",
  "this", "that", "these", "those", "it", "its", "what", "which",
  "who", "whom", "how", "when", "where", "why", "all", "any", "each",
  "i", "me", "my", "we", "our", "you", "your", "he", "she", "they",
  "his", "her", "their", "them", "us", "if", "then", "than", "about",
]);

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function tfidfScore(queryTokens: string[], chunk: Chunk, totalChunks: number, docFreq: Map<string, number>): number {
  const chunkTokens = tokenise(chunk.text);
  const termFreq = new Map<string, number>();

  for (const t of chunkTokens) {
    termFreq.set(t, (termFreq.get(t) ?? 0) + 1);
  }

  let score = 0;
  for (const qt of queryTokens) {
    const tf = (termFreq.get(qt) ?? 0) / chunkTokens.length;
    const df = docFreq.get(qt) ?? 0;
    const idf = df > 0 ? Math.log((totalChunks + 1) / (df + 1)) + 1 : 0;
    score += tf * idf;
  }

  return score;
}

export function retrieveRelevantChunks(question: string, chunks: Chunk[], topK = 3): Chunk[] {
  const queryTokens = tokenise(question);
  if (queryTokens.length === 0) return chunks.slice(0, topK);

  // Build document frequency map
  const docFreq = new Map<string, number>();
  for (const chunk of chunks) {
    const seen = new Set<string>();
    for (const t of tokenise(chunk.text)) {
      if (!seen.has(t)) {
        docFreq.set(t, (docFreq.get(t) ?? 0) + 1);
        seen.add(t);
      }
    }
  }

  const scored = chunks.map((chunk) => ({
    ...chunk,
    score: tfidfScore(queryTokens, chunk, chunks.length, docFreq),
  }));

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
