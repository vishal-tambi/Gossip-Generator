import { GossipGenerator } from "@/components/gossip-generator"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { BookmarkIcon } from "lucide-react"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 text-center relative">
            <div className="absolute right-0 top-0">
              <Link href="/favorites" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700">
                <BookmarkIcon className="h-5 w-5" />
                <span>Favorites</span>
              </Link>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-pink-600 drop-shadow-sm">
              Celebrity Gossip Generator
            </h1>
            <h2 className="text-xl text-pink-500 mt-1">Powered by Google Gemini</h2>
            <p className="mt-2 text-lg text-pink-500">
              Generate harmless, humorous fake gossip about your favorite celebrities!
            </p>
          </header>

          <GossipGenerator />

          <footer className="mt-12 text-center text-sm text-gray-500">
            <p>All stories are AI-generated and completely fictional. For entertainment purposes only.</p>
            <p className="mt-1">Powered by Google Gemini 2.0 Flash</p>
            
          </footer>
        </div>
      </main>
    </ThemeProvider>
  )
}

