export interface Document {
  id: string;
  name: string;
  filename: string;
  description: string;
}

export interface Chunk {
  documentId: string;
  documentName: string;
  index: number;
  text: string;
  score?: number;
}

export interface AskRequest {
  documentId: string;
  question: string;
}

export interface AskResponse {
  answer: string;
  keyPoints: string[];
  sources: Chunk[];
  provider: string;
  isMock: boolean;
  disclaimer: string;
}

export interface ProviderConfig {
  provider: "mock" | "openai" | "claude";
  apiKey?: string;
  model?: string;
}
