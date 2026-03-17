# AI Web Search Agent

A premium, minimalist AI-powered web search agent that synthesizes real-time information with verified source citations. Built with Next.js, Ollama, and DuckDuckGo.

![AI Search Interface](https://via.placeholder.com/800x450?text=AI+Web+Search+Agent+Interface)

## 🚀 Key Features

- **Synthesized Intelligence**: Generates grounded answers based on real-time web search results.
- **Source Citations**: Automatically cites sources using interactive cards and inline notation (`[1]`, `[2]`).
- **Streaming Responses**: Modern "typing" effect for AI-generated content.
- **Premium Design**: Glassmorphic dark mode UI with fluid animations.
- **Configurable LLM**: Seamlessly integrates with Ollama (Local or Cloud).

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, Framer Motion, Lucide React.
- **Backend**: Next.js Route Handlers.
- **LLM Engine**: Ollama (SDK).
- **Search Engine**: DuckDuckGo (via `ddg-search`).

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [Ollama](https://ollama.com/) (Running locally or accessible via cloud URL)

## ⚙️ Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/spbalatech/AI-Web-Search-Agent.git
   cd AI-Web-Search-Agent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   OLLAMA_API_KEY=your_api_key_if_using_cloud
   OLLAMA_HOST=https://ollama.com # or http://localhost:11434
   OLLAMA_MODEL=gpt-oss:120b      # or your preferred model
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## 🏃 How to Run

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

3. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 🏗️ Architecture Overview

The project follows a standard Next.js App Router architecture:

- `src/app/page.tsx`: The main user interface and search state management.
- `src/app/api/agent/route.ts`: The orchestrator that handles search retrieval and LLM streaming.
- `src/lib/search.ts`: Shared logic for interacting with the DuckDuckGo search engine.
- `src/app/globals.css`: Premium styling system using Tailwind CSS and glassmorphic tokens.

## 🧠 Design Decisions and Trade-offs

- **Shared Search Logic**: Initially, search was called via internal API fetches. We moved this to a shared `src/lib/search.ts` module to eliminate port-configuration issues and improve reliability.
- **Streaming Strategy**: We use a custom JSON chunking protocol to stream both search sources and AI-generated content simultaneously, allowing sources to appear instantly while the AI is still "thinking".
- **LLM Choice**: Switched to Ollama for privacy and flexibility, providing a path for both local execution and managed cloud services.
- **Scraper Resilience**: Migrated from `duck-duck-scrape` to `ddg-search` to better handle anti-bot detection and rate limits.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License.
