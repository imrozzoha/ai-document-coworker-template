# Customisation Guide

This template is designed to be adapted for real client projects. The following explains how to extend each layer.

## 1. Swap sample documents for client documents

Replace files in `sample-data/` with client documents. For production:
- Store documents in a private AWS S3 bucket
- Load using the AWS SDK: `s3.getObject({ Bucket, Key })`
- Update `src/lib/documents.ts` to fetch from S3 instead of the local filesystem

## 2. Add PDF or DOCX support

Install a parsing library:

```bash
npm install pdf-parse
# or for DOCX:
npm install mammoth
```

In `src/lib/documents.ts`, add a parser based on file extension before chunking.

## 3. Switch to embedding-based retrieval (production)

Replace TF-IDF in `src/lib/retrieval.ts` with vector search:

1. Embed all chunks at indexing time using OpenAI `text-embedding-3-small`
2. Store embeddings in pgvector, Pinecone, or AWS OpenSearch
3. At query time, embed the question and find the nearest neighbours
4. Return the top K chunks by cosine similarity

## 4. Use AWS Bedrock Knowledge Bases

Instead of managing retrieval manually, use the fully managed option:

```typescript
import { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } from "@aws-sdk/client-bedrock-agent-runtime";
```

Upload your documents to an S3 bucket, create a Bedrock Knowledge Base, and call `RetrieveAndGenerate`. This handles chunking, embedding, indexing, and retrieval automatically.

## 5. Add authentication

Install NextAuth.js or Clerk:

```bash
npm install next-auth
```

Wrap API routes with session checks. Restrict document access by user role.

## 6. Add document upload

1. Add a file input to the UI
2. Upload to a signed S3 URL via a `/api/upload` route
3. Extract text server-side and add to the document index
4. Delete after session if persistence is not required

## 7. Brand the UI for a client

- Update colours in `tailwind.config.js`
- Replace the logo in `src/app/layout.tsx`
- Update the page title and metadata in `src/app/layout.tsx`
- Remove the `ai.imrozzoha.com` link from the header and footer

## 8. Deploy to AWS

```bash
# Option A: Vercel (simplest)
vercel deploy

# Option B: AWS App Runner
# Build the Next.js app, containerise with Docker, push to ECR, deploy via App Runner

# Option C: AWS Amplify
# Connect the GitHub repo, set environment variables, deploy
```

## 9. Add streaming responses

For a better UX with real AI providers, switch from `chat.completions.create` to the streaming variant and use Next.js `StreamingTextResponse` or `ReadableStream`.

## 10. Add rate limiting

Use Upstash Redis with `@upstash/ratelimit` to limit requests per IP or user session. Alternatively, use AWS API Gateway throttling if the Next.js app is behind an API Gateway.
