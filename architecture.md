# Architecture

## Overview

```
Browser (Next.js UI)
  │
  │  POST /api/ask { documentId, question }
  ▼
Next.js API Route (src/app/api/ask/route.ts)
  │
  ├─ Load document text (src/lib/documents.ts)
  │    └─ Read from sample-data/*.txt (or S3 in production)
  │
  ├─ Chunk text (src/lib/documents.ts)
  │    └─ Split into 600-char overlapping chunks
  │
  ├─ Retrieve relevant chunks (src/lib/retrieval.ts)
  │    └─ TF-IDF keyword scoring → top 3 chunks
  │
  ├─ Generate answer (src/lib/ai-provider.ts)
  │    ├─ Mock mode: construct structured response from chunks (no API key)
  │    ├─ OpenAI mode: GPT-4o Mini with retrieved context
  │    └─ Claude mode: Claude Haiku with retrieved context
  │
  └─ Return { answer, keyPoints, sources, provider, isMock, disclaimer }
        │
        ▼
Browser renders answer + source snippets + human-review disclaimer
```

---

## Frontend

**Framework:** Next.js 14 (App Router) with React  
**Styling:** Tailwind CSS  
**State:** React `useState` — no external state manager needed for this scope  

The UI is a single-page layout with:
- Document selector (left panel)
- Sample question shortcuts
- Question input with keyboard shortcut (Cmd/Ctrl+Enter)
- Answer display with provider badge, key points, source snippets, disclaimer
- Architecture flow diagram in the footer section

---

## API Layer

**Route:** `POST /api/ask`  
**Input:** `{ documentId: string, question: string }`  
**Output:** `AskResponse` (answer, keyPoints, sources, provider, isMock, disclaimer)  

Validation:
- documentId must match a known sample document
- question must be non-empty and ≤ 1,000 characters

Error handling returns structured JSON with HTTP status codes.

---

## Document Processing

Documents are plain text files stored in `sample-data/`. In production, replace with:
- S3 bucket (private, KMS-encrypted)
- Azure Blob Storage
- Google Cloud Storage
- A document management system API

**Text extraction:** For this starter, `.txt` files are read directly. For PDF/DOCX in production, use:
- `pdf-parse` or `pdfplumber` (Python) for PDFs
- `mammoth` or `docx` for Word documents
- AWS Textract for scanned/image-based documents

---

## Chunking

Documents are split into overlapping chunks (600 chars, 100-char overlap) to:
- Fit within model context windows
- Preserve sentence context across chunk boundaries
- Allow fine-grained source attribution

**TODO:** For production, consider:
- Sentence-aware chunking (split on sentence boundaries)
- Semantic chunking (split on topic shifts)
- Larger chunks with recursive splitting

---

## Retrieval

**Method:** TF-IDF keyword scoring (in-memory, no vector database required)

Each chunk is scored against the query using term frequency and inverse document frequency. The top 3 chunks by score are passed to the AI provider.

**TODO — Production retrieval options:**
- `pgvector` extension on PostgreSQL (AWS RDS)
- AWS OpenSearch with k-NN vector search
- Pinecone (managed vector database)
- AWS Bedrock Knowledge Bases (fully managed RAG)
- Weaviate, Qdrant, or Chroma for self-hosted vector search

For production, replace TF-IDF with embedding-based retrieval:
1. Embed each chunk using `text-embedding-3-small` (OpenAI) or `amazon.titan-embed-text-v2` (Bedrock)
2. Store embeddings in a vector database
3. At query time, embed the question and find nearest neighbours

---

## AI Provider Abstraction

Configured via the `AI_PROVIDER` environment variable:

| Value | Description | API Key Required |
|---|---|---|
| `mock` (default) | Constructs a structured response from retrieved chunks | No |
| `openai` | Calls GPT-4o Mini (configurable via `OPENAI_MODEL`) | Yes |
| `claude` | Calls Claude Haiku (configurable via `ANTHROPIC_MODEL`) | Yes |

The abstraction lives in `src/lib/ai-provider.ts`. Adding a new provider requires implementing one function that receives `(question, sources[])` and returns `AskResponse`.

**System prompt (both providers):**  
Answer using only the provided document excerpts. Be concise and factual. Do not invent information. Recommend human review for sensitive matters. Return JSON: `{ answer, keyPoints }`.

---

## Source / Reference Display

Each source snippet shows:
- Source number (e.g., Source 1)
- Document name and chunk index
- The raw chunk text (monospace, clipped at 4 lines)

This gives users visibility into exactly which parts of the document were used to generate the answer, supporting auditability and trust.

---

## Human Review Disclaimer

Every answer includes a fixed disclaimer:

> "This answer is AI-generated from the selected document. Always verify with the source document and seek appropriate professional advice for legal, financial, HR, medical, or compliance matters."

This is displayed in the UI with an amber warning style and must be preserved in all production deployments.

---

## Future Production Deployment Options

| Concern | Starter (this template) | Production option |
|---|---|---|
| Document storage | Local `sample-data/` folder | AWS S3 (private, KMS), Azure Blob |
| Text extraction | Plain `.txt` read | `pdf-parse`, AWS Textract, Apache Tika |
| Chunking | Simple character-based | Sentence-aware, semantic chunking |
| Retrieval | In-memory TF-IDF | pgvector, OpenSearch, Pinecone, Bedrock KB |
| AI provider | Mock / OpenAI / Claude | Any LLM via abstraction layer |
| Authentication | None | NextAuth.js, Clerk, AWS Cognito |
| Hosting | `npm run dev` | Vercel, AWS App Runner, ECS, EC2 |
| Secrets | `.env.local` | AWS Secrets Manager, Vault |
| Monitoring | Console logs | CloudWatch, Datadog, Sentry |
| Rate limiting | None | API Gateway throttling, Upstash |
