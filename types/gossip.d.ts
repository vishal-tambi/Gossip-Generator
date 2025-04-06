interface GossipContent {
  headline: string
  summary: string
  content: string
  imagePrompt?: string
}

interface SavedGossip {
  id: string
  celebrity: string
  category: string
  headline: string
  summary: string
  content: string
  imagePrompt?: string
  imageUrl?: string
  timestamp: number
  theme: ThemeType
}

type ThemeType = "tabloid" | "fashion" | "entertainment" | "scandal"

type GossipCategory = "career" | "relationships" | "fashion" | "scandal" | "lifestyle"

interface ApiError {
  message: string
  code?: string
}

