import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Document Coworker — Template",
  description:
    "A starter template for document Q&A with grounded answers and source references. Built for the AI Automation Marketplace at ai.imrozzoha.com.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M9 13h6M9 17h6" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900 text-sm">AI Document Coworker</span>
              <span className="hidden sm:inline text-xs text-gray-400 font-mono">template</span>
            </div>
            <a
              href="https://ai.imrozzoha.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              ai.imrozzoha.com
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              AI Document Coworker — starter template ·{" "}
              <a href="https://ai.imrozzoha.com" className="text-blue-500 hover:underline">
                ai.imrozzoha.com
              </a>
            </p>
            <p className="text-xs text-gray-400">
              Sample data only · Not for production use without configuration
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
