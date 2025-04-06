import { formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface GossipContent {
  headline: string
  summary: string
  content: string
  imagePrompt?: string
}

interface GossipStoryProps {
  gossip: GossipContent
  celebrity: string
  imageUrl: string | null
  isGeneratingImage: boolean
  theme: "tabloid" | "fashion" | "entertainment" | "scandal"
  date: string
}

export function GossipStory({ gossip, celebrity, imageUrl, isGeneratingImage, theme, date }: GossipStoryProps) {
  // Theme-specific styling
  const themeStyles = {
    tabloid: {
      headerBg: "bg-pink-600",
      borderColor: "border-pink-300",
      accentColor: "text-pink-600",
      fontFamily: "font-sans",
      titleSize: "text-2xl md:text-3xl",
      exclusive: "EXCLUSIVE",
    },
    fashion: {
      headerBg: "bg-purple-600",
      borderColor: "border-purple-300",
      accentColor: "text-purple-600",
      fontFamily: "font-serif",
      titleSize: "text-3xl md:text-4xl",
      exclusive: "TRENDING",
    },
    entertainment: {
      headerBg: "bg-blue-600",
      borderColor: "border-blue-300",
      accentColor: "text-blue-600",
      fontFamily: "font-sans",
      titleSize: "text-2xl md:text-3xl",
      exclusive: "BREAKING",
    },
    scandal: {
      headerBg: "bg-red-600",
      borderColor: "border-red-300",
      accentColor: "text-red-600",
      fontFamily: "font-sans",
      titleSize: "text-2xl md:text-4xl font-extrabold",
      exclusive: "SHOCKING",
    },
  }

  const style = themeStyles[theme]

  // Publication names by theme
  const publications = {
    tabloid: "The Daily Gossip",
    fashion: "VAGUE Magazine",
    entertainment: "Entertainment Tonight",
    scandal: "SCANDAL TIMES",
  }

  return (
    <Card className={`overflow-hidden border-2 ${style.borderColor} shadow-lg ${style.fontFamily}`}>
      <div className={`${style.headerBg} p-3 text-white`}>
        <div className="text-xs uppercase tracking-widest">{publications[theme]}</div>
        <div className="text-xs">{date}</div>
      </div>

      <CardContent className="p-6">
        <h2 className={`mb-4 ${style.titleSize} font-bold text-gray-800 leading-tight`}>{gossip.headline}</h2>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {theme === "fashion"
              ? "By Anna Wintour, Fashion Editor"
              : theme === "entertainment"
                ? "By Ryan Seacrest, Entertainment Reporter"
                : theme === "scandal"
                  ? "By Anonymous Source"
                  : "By Jane Doe, Gossip Correspondent"}
          </div>
          <div className={`text-sm font-semibold ${style.accentColor}`}>{style.exclusive}</div>
        </div>

        <div className="mb-6 flex justify-center">
          {isGeneratingImage ? (
            <div className="relative h-64 w-full max-w-md overflow-hidden rounded-md bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Generating image with Gemini...</p>
              </div>
            </div>
          ) : imageUrl ? (
            <div className="relative h-64 w-full max-w-md overflow-hidden rounded-md">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={`AI-generated image for ${gossip.headline}`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative h-64 w-full max-w-md overflow-hidden rounded-md bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl">📸</div>
                  <div className="mt-2 text-sm">{celebrity}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          <p className={`text-lg font-medium italic mb-4 ${style.accentColor}`}>{gossip.summary}</p>
          {gossip.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {gossip.imagePrompt && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs text-gray-500">
            <strong>Image Prompt:</strong> {gossip.imagePrompt}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500 italic">
          Disclaimer: This is AI-generated content for entertainment purposes only. All stories are fictional and not
          meant to be taken seriously.
        </div>
      </CardContent>
    </Card>
  )
}

