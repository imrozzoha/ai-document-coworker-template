import { retrieveRelevantChunks } from "../src/lib/retrieval";
import { Chunk } from "../src/lib/types";

const CHUNKS: Chunk[] = [
  { documentId: "test", documentName: "Test Doc", index: 0, text: "Cancellation with more than 30 days notice: No fee. Cancellation with fewer than 15 days notice: 50% of the remaining contract value." },
  { documentId: "test", documentName: "Test Doc", index: 1, text: "Payment is due within 14 days of the invoice date. Overdue amounts accrue interest at 2% per month." },
  { documentId: "test", documentName: "Test Doc", index: 2, text: "All deliverables produced specifically for the Client become the Client property upon full payment." },
  { documentId: "test", documentName: "Test Doc", index: 3, text: "Annual leave accrues 20 days per year. Leave must be requested at least 2 weeks in advance." },
];

describe("retrieveRelevantChunks", () => {
  it("returns top K results", () => {
    const results = retrieveRelevantChunks("cancellation policy fee", CHUNKS, 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it("ranks cancellation-related chunk highest for cancellation query", () => {
    const results = retrieveRelevantChunks("cancellation policy notice fee", CHUNKS, 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].index).toBe(0);
  });

  it("ranks payment chunk for invoice query", () => {
    const results = retrieveRelevantChunks("invoice payment due date", CHUNKS, 2);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].index).toBe(1);
  });

  it("handles empty query gracefully", () => {
    const results = retrieveRelevantChunks("", CHUNKS, 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("returns empty array when no chunks match", () => {
    const results = retrieveRelevantChunks("zzzznonexistent", CHUNKS, 3);
    expect(results.length).toBe(0);
  });
});
