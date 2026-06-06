"use client";

import { useState } from "react";
import { Document, AskResponse } from "@/lib/types";

const SAMPLE_DOCUMENTS: Document[] = [
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

const SAMPLE_QUESTIONS: Record<string, string[]> = {
  "service-agreement": [
    "What is the cancellation policy?",
    "When are invoices due for payment?",
    "Who owns the intellectual property?",
    "What happens if there is a dispute?",
  ],
  "hr-policy": [
    "How many days of annual leave do I get?",
    "What is the sick leave entitlement?",
    "How does the parental leave policy work?",
    "What is the disciplinary process?",
  ],
  "product-manual": [
    "How do I add assets to the system?",
    "What are the subscription plan differences?",
    "How do I set up maintenance reminders?",
    "What integrations are available?",
  ],
};

export default function Home() {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    if (!selectedDoc || !question.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: selectedDoc.id, question: question.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data as AskResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleDocSelect(doc: Document) {
    setSelectedDoc(doc);
    setQuestion("");
    setResult(null);
    setError(null);
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 pb-2">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Starter Template · Mock Mode Active
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          AI Document Coworker
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
          Select a sample document, ask a question, and receive a grounded answer with source references.
          Works in mock mode without API keys — swap in OpenAI or Claude via environment variables.
        </p>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-6">
        {/* Left panel — document selection */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              1. Select a document
            </h2>
            <div className="space-y-2">
              {SAMPLE_DOCUMENTS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleDocSelect(doc)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
                    selectedDoc?.id === doc.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedDoc?.id === doc.id ? "bg-blue-600" : "bg-gray-100"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${selectedDoc?.id === doc.id ? "text-white" : "text-gray-500"}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6M9 13h6M9 17h6" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${selectedDoc?.id === doc.id ? "text-blue-700" : "text-gray-800"}`}>
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{doc.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sample questions */}
          {selectedDoc && (
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Sample questions
              </h2>
              <div className="space-y-1.5">
                {(SAMPLE_QUESTIONS[selectedDoc.id] ?? []).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuestion(q)}
                    className="w-full text-left text-xs text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right panel — Q&A */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              2. Ask a question
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAsk();
                }}
                placeholder={
                  selectedDoc
                    ? `Ask about the ${selectedDoc.name}…`
                    : "Select a document first, then ask a question…"
                }
                disabled={!selectedDoc}
                rows={3}
                className="w-full resize-none text-sm text-gray-800 placeholder-gray-400 border-0 outline-none bg-transparent leading-relaxed"
              />
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">{question.length}/1000</span>
                <button
                  onClick={handleAsk}
                  disabled={!selectedDoc || !question.trim() || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Thinking…
                    </>
                  ) : (
                    <>
                      Ask
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Answer */}
          {result && (
            <div className="space-y-4">
              {/* Provider badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                    result.isMock
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-green-50 text-green-700 border-green-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${result.isMock ? "bg-amber-400" : "bg-green-500"}`} />
                  {result.provider}
                </span>
                <span className="text-xs text-gray-400">{selectedDoc?.name}</span>
              </div>

              {/* Answer card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Answer</h3>
                  <p className="text-sm text-gray-800 leading-relaxed">{result.answer}</p>
                </div>

                {result.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Points</h3>
                    <ul className="space-y-1.5">
                      {result.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Source References ({result.sources.length})
                  </h3>
                  <div className="space-y-2">
                    {result.sources.map((src, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-mono text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                            Source {i + 1}
                          </span>
                          <span className="text-xs text-gray-500">{src.documentName} · chunk #{src.index}</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed font-mono line-clamp-4">{src.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Human review recommended.</strong> {result.disclaimer}
                </p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Select a document and ask a question to see a grounded answer with source references.</p>
            </div>
          )}
        </div>
      </div>

      {/* Architecture note */}
      <div className="bg-gray-900 text-gray-300 rounded-xl p-5 text-xs font-mono space-y-2">
        <p className="text-gray-400 text-xs font-sans font-semibold mb-3">How it works (architecture)</p>
        <div className="flex flex-wrap gap-2 items-center text-gray-400">
          <span className="bg-gray-800 px-2 py-1 rounded">Document selected</span>
          <span>→</span>
          <span className="bg-gray-800 px-2 py-1 rounded">Text loaded + chunked</span>
          <span>→</span>
          <span className="bg-gray-800 px-2 py-1 rounded">TF-IDF retrieval</span>
          <span>→</span>
          <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded">AI answer (mock/OpenAI/Claude)</span>
          <span>→</span>
          <span className="bg-gray-800 px-2 py-1 rounded">Sources displayed</span>
          <span>→</span>
          <span className="bg-amber-900 text-amber-300 px-2 py-1 rounded">Human review</span>
        </div>
        <p className="text-gray-500 pt-1">
          Set <code className="text-gray-300">AI_PROVIDER=openai</code> or <code className="text-gray-300">AI_PROVIDER=claude</code> in{" "}
          <code className="text-gray-300">.env.local</code> to use a real AI provider.
        </p>
      </div>
    </div>
  );
}
