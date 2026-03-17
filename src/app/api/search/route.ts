import { NextResponse } from "next/server";
import { getSearchResults } from "@/lib/search";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    console.log("Search API Query:", query);

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const formattedResults = await getSearchResults(query);
    return NextResponse.json({ results: formattedResults });
  } catch (error: any) {
    console.error("Search API Route Error:", error?.message || error);
    return NextResponse.json({ 
      error: "Failed to fetch search results",
      details: error?.message || "Unknown error" 
    }, { status: 500 });
  }
}
