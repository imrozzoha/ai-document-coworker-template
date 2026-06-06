# AI Document Coworker — Starter Template

A clean, customisable starter template for building a **document Q&A assistant** with grounded answers and source references. Built for the [AI Automation Marketplace](https://ai.imrozzoha.com) by [Imrozzoha Chowdhury](https://imrozzoha.com).

---

## Problem it solves

Teams spend time searching through long policy documents, contracts, manuals, and handbooks to answer routine questions. This template provides a starting point for an AI assistant that reads those documents, retrieves the relevant sections, and returns a grounded answer with source references — keeping humans in the loop for review.

---

## Solution

A Next.js web app where users select a document, ask a question, and receive:

- A concise AI-generated answer grounded in the document
- Key bullet points extracted from the relevant sections
- Source snippet references showing exactly which parts of the document were used
- A human-review disclaimer

Works out of the box in **mock mode** (no API key required). Swap in OpenAI or Claude via environment variables for real AI responses.

---

## Demo workflow

```
User selects document (e.g., Service Agreement)
  → Asks: "What is the cancellation policy?"
  → System loads and chunks the document
  → TF-IDF retrieval finds the 3 most relevant sections
  → AI generates a grounded answer (mock or real provider)
  → Source snippets are displayed
  → Human-review disclaimer is shown
```

**Sample output:**

> **Answer:** Based on the document, cancellation with more than 30 days notice incurs no fee. Cancellation with fewer than 15 days notice incurs a 50% fee on the remaining contract value.
>
> **Key Points:**
> - 30+ days notice: No cancellation fee
> - 15–30 days notice: 25% of remaining contract value
> - Fewer than 15 days: 50% of remaining contract value
>
> **Source 1:** Service Agreement · chunk #4
> *"Cancellation with more than 30 days notice: No fee. Cancellation with 15–30 days notice: 25% of the remaining contract value..."*
>
> ⚠️ Human review recommended. Always verify with the source document.

---

## Architecture

See [architecture.md](./architecture.md) for the full technical breakdown.

```
Document selected → text loaded + chunked → TF-IDF retrieval
  → AI answer (mock / OpenAI / Claude) → sources displayed → human review
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Retrieval | In-memory TF-IDF (no vector DB required) |
| AI providers | Mock (default), OpenAI GPT-4o Mini, Claude Haiku |
| Testing | Jest + ts-jest |

---

## How to run locally

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repo
git clone https://github.com/imrozzoha/ai-document-coworker-template.git
cd ai-document-coworker-template

# 2. Install dependencies
npm install

# 3. Configure environment (optional — mock mode works without API keys)
cp .env.example .env.local
# Edit .env.local if you want to use a real AI provider

# 4. Run the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

```bash
# Run tests
npm test

# Lint
npm run lint

# Build for production
npm run build
```

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `AI_PROVIDER` | `mock` | `mock`, `openai`, or `claude` |
| `OPENAI_API_KEY` | — | Required when `AI_PROVIDER=openai` |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model name |
| `ANTHROPIC_API_KEY` | — | Required when `AI_PROVIDER=claude` |
| `ANTHROPIC_MODEL` | `claude-3-5-haiku-latest` | Anthropic model name |

Copy `.env.example` to `.env.local` and fill in values. Never commit `.env.local`.

---

## Sample documents

Three fictional sample documents are included:

| File | Description |
|---|---|
| `sample-data/service-agreement.txt` | Client service agreement with cancellation policy, payment terms, IP clauses |
| `sample-data/hr-policy.txt` | Employee handbook with leave, conduct, grievance procedures |
| `sample-data/product-manual.txt` | CloudTrack Pro product manual with setup, features, troubleshooting |

---

## Security notes

See [security-notes.md](./security-notes.md) for the full security guidance.

- Use sample data only in public demos
- Never commit API keys or client data
- Human review is required for legal, financial, HR, and compliance use
- Production deployments need authentication, rate limiting, encrypted storage, and audit logging

---

## Customisation

See [docs/customisation.md](./docs/customisation.md) for step-by-step guidance on:

- Replacing sample documents with client documents
- Adding PDF/DOCX support
- Switching to embedding-based retrieval (pgvector, Pinecone, AWS Bedrock Knowledge Bases)
- Adding authentication
- Branding the UI for a specific client
- Deploying to AWS (App Runner, Amplify, ECS)

---

## Roadmap / TODOs

- [ ] PDF and DOCX text extraction
- [ ] File upload via UI
- [ ] Embedding-based retrieval (pgvector / Pinecone / Bedrock KB)
- [ ] Streaming AI responses
- [ ] Authentication (NextAuth.js / Clerk)
- [ ] Rate limiting
- [ ] Persistent document index / caching
- [ ] Multi-document Q&A
- [ ] Audit log for all queries
- [ ] Client-branded UI theme

---

## Part of the AI Automation Marketplace

This template supports the **AI Document Coworker** solution on the AI Automation Marketplace.

Browse other AI coworker and workflow automation patterns at:
**[ai.imrozzoha.com](https://ai.imrozzoha.com)**

To request a custom implementation tailored to your workflow, documents, and approval process:
**[ai.imrozzoha.com/contact.html](https://ai.imrozzoha.com/contact.html)**
