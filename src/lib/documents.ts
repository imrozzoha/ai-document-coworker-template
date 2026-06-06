import fs from "fs";
import path from "path";
import { Document, Chunk } from "./types";

const SAMPLE_DATA_DIR = path.join(process.cwd(), "sample-data");

const CHUNK_SIZE = 600;
const CHUNK_OVERLAP = 100;

export const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: "service-agreement",
    name: "Service Agreement",
    filename: "service-agreement.txt",
    description: "Client service agreement with payment terms, cancellation policy, and IP clauses.",
  },
  {
    id: "hr-policy",
    name: "HR Policy Guide",
    filename: "hr-policy.txt",
    description: "Employee handbook covering leave entitlements, conduct, and grievance procedures.",
  },
  {
    id: "product-manual",
    name: "Product Manual",
    filename: "product-manual.txt",
    description: "CloudTrack Pro user manual covering setup, features, and troubleshooting.",
  },
];

export function getDocumentById(id: string): Document | undefined {
  return SAMPLE_DOCUMENTS.find((d) => d.id === id);
}

export function loadDocumentText(filename: string): string {
  const filePath = path.join(SAMPLE_DATA_DIR, filename);
  return fs.readFileSync(filePath, "utf-8");
}

export function chunkText(text: string, documentId: string, documentName: string): Chunk[] {
  const chunks: Chunk[] = [];
  let start = 0;
  let index = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunkText = text.slice(start, end).trim();

    if (chunkText.length > 50) {
      chunks.push({ documentId, documentName, index, text: chunkText });
      index++;
    }

    if (end === text.length) break;
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

export function getChunksForDocument(documentId: string): Chunk[] {
  const doc = getDocumentById(documentId);
  if (!doc) throw new Error(`Document not found: ${documentId}`);
  const text = loadDocumentText(doc.filename);
  return chunkText(text, doc.id, doc.name);
}
