import { NextResponse } from "next/server";
import { Ollama } from "ollama";
import { getSearchResults } from "@/lib/search";

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    console.log("Agent API Query:", query);

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Fetch search results directly using shared logic
    console.log("Fetching search results for:", query);
    const results = await getSearchResults(query);
    console.log("Found results:", results.length);

    // 2. Prepare the prompt for the LLM
    const context = results
      .map((r: any, i: number) => `Source [${i + 1}]: ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}`)
      .join("\n\n");

    const systemPrompt = `You are a helpful and accurate AI Web Search Agent. 
Your goal is to answer the user's query based strictly on the provided search results.
Always cite your sources using [number] notation corresponding to the source index provided.
If multiple sources support a point, cite all of them, e.g., [1][2].
If the search results do not contain the answer, say so clearly.
Be concise, professional, and use markdown for formatting.

Context:
${context}`;

    // 3. Initiate Ollama streaming
    console.log("Starting Ollama chat stream...");
    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL || "gpt-oss:120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      stream: true,
    });

    // 4. Stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // First, send the search results metadata
          const metadata = JSON.stringify({ type: "sources", data: results }) + "\n";
          controller.enqueue(new TextEncoder().encode(metadata));

          for await (const part of response) {
            const content = part.message.content || "";
            if (content) {
              const data = JSON.stringify({ type: "content", data: content }) + "\n";
              controller.enqueue(new TextEncoder().encode(data));
            }
          }
        } catch (err: any) {
          console.error("Ollama Stream Error:", err?.message || err);
          const errorData = JSON.stringify({ type: "content", data: "\n\n[Error during streaming: " + (err?.message || "connection lost") + "]" }) + "\n";
          controller.enqueue(new TextEncoder().encode(errorData));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Agent API Final Error:", error?.message || error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error?.message || "Unknown error"
    }, { status: 500 });
  }
}
