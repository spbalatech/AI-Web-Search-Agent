"use client";

import { useState } from "react";
import { Globe, ChevronRight, Loader2, BookOpen, Link as LinkIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Source {
  title: string;
  url: string;
  snippet: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAnswer("");
    setSources([]);
    setHasSearched(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.type === "sources") {
              setSources(parsed.data);
            } else if (parsed.type === "content") {
              setAnswer((prev) => prev + parsed.data);
            }
          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setAnswer("### Search Failed\n\nSorry, something went wrong while searching. Please try again or check your configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-12 flex flex-col items-center">
      <div className="bg-glow" />

      {/* Header / Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-16 flex items-center gap-3 font-display"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <span className="tracking-tight italic">AI Search</span>
      </motion.div>

      {/* Search Input Section */}
      <motion.div
        layout
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className={`w-full max-w-3xl ${hasSearched ? "mb-12" : "mt-[10vh] mb-[10vh]"}`}
      >
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent font-display tracking-tight">
              Deep Search. <br /> <span className="text-blue-500">Fast Answers.</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
              Ask anything. I'll search the web and synthesize an answer with verified sources.
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-blue-500/10 blur-2xl group-focus-within:bg-blue-500/20 transition-all rounded-3xl" />
          <div className="relative glass rounded-3xl p-1 transition-all duration-300 ring-1 ring-white/10 group-focus-within:ring-blue-500/40">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full h-16 pl-8 pr-16 bg-transparent border-none focus:outline-none text-xl transition-all placeholder:text-gray-500"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white p-3 rounded-2xl transition-all shadow-xl active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </form>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Answer Panel */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-blue-400 font-semibold tracking-wide uppercase text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesized Intelligence</span>
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 text-gray-500 text-xs italic">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Processing live web data...</span>
                  </div>
                )}
              </div>

              <div className="glass rounded-3xl p-8 md:p-10 min-h-[400px] shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/30" />

                {isLoading && !answer && (
                  <div className="space-y-4 py-8">
                    <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
                  </div>
                )}

                <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:font-display">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Sources Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3 text-gray-400 font-semibold tracking-wide uppercase text-xs mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Primary Sources</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {sources.length === 0 && isLoading ? (
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-28 glass rounded-2xl animate-pulse opacity-50" />
                  ))
                ) : (
                  sources.map((source, idx) => (
                    <motion.a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group block glass glass-card p-5 rounded-2xl relative overflow-hidden"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                          <span className="text-sm font-bold font-display">{idx + 1}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white mb-1 truncate group-hover:text-blue-400 transition-colors font-display">
                            {source.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                            {source.snippet}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono uppercase tracking-tighter">
                            <LinkIcon className="w-3 h-3" />
                            <span className="truncate">{new URL(source.url).hostname}</span>
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  ))
                )}
              </div>

              {sources.length > 0 && (
                <p className="text-center text-xs text-gray-600 italic">
                  Showing {sources.length} sources found on the web.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-auto py-8 text-gray-600 text-sm">
        &copy; 2026 AI Search. Powered by Ollama & Deep Search Scraper.
      </footer>
    </main>
  );
}
