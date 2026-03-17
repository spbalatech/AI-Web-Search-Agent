import { search } from "ddg-search";

export async function getSearchResults(query: string) {
  try {
    const response = await search(query, {
      maxResults: 10,
      maxPages: 1,
      region: "",
      time: ""
    });

    return response.results.map((res) => ({
      title: res.title,
      url: res.url,
      snippet: res.description || "",
    }));
  } catch (error: any) {
    console.error("Search Logic Error:", error?.message || error);
    if (error?.message?.includes("Anti-bot")) {
      throw new Error("DuckDuckGo blocked the request. Please try again in a few minutes.");
    }
    throw new Error("Failed to fetch search results");
  }
}
