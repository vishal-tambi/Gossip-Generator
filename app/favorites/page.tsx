"use client"

import { useGossip } from "@/context/gossip-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useGossip()
  const { toast } = useToast()

  const handleRemove = (id: string) => {
    removeFavorite(id)
    toast({
      title: "Removed from favorites",
      description: "The gossip story has been removed from your favorites.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Generator
          </Link>
          <h1 className="text-4xl font-bold text-pink-600">Your Favorite Gossip</h1>
          <p className="text-gray-600 mt-2">
            {favorites.length === 0
              ? "You haven't saved any gossip stories yet."
              : `You have ${favorites.length} saved gossip ${favorites.length === 1 ? "story" : "stories"}.`}
          </p>
        </header>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4">Generate some gossip and save your favorites to see them here!</p>
              <Link href="/">
                <Button>Go to Generator</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="overflow-hidden border-2 border-pink-300 shadow-lg">
                <div
                  className={`
                  p-3 text-white
                  ${favorite.theme === "tabloid"
                      ? "bg-pink-600"
                      : favorite.theme === "fashion"
                        ? "bg-purple-600"
                        : favorite.theme === "entertainment"
                          ? "bg-blue-600"
                          : "bg-red-600"
                    }
                `}
                >
                  <div className="flex justify-between items-center p-4 bg-black-900/80 rounded-lg shadow-md hover:bg-gray-900 transition-colors duration-200">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                        {favorite.theme === "tabloid"
                          ? "The Daily Gossip"
                          : favorite.theme === "fashion"
                            ? "VAGUE Magazine"
                            : favorite.theme === "entertainment"
                              ? "Entertainment Tonight"
                              : "SCANDAL TIMES"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(new Date(favorite.timestamp))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(favorite.id)}
                      className="text-gray-400 hover:text-white hover:bg-white/10 focus:ring-2 focus:ring-offset-2 focus:ring-white/20 rounded-full p-1 transition-all duration-150"
                      aria-label={`Remove favorite from ${favorite.theme}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {favorite.imageUrl && (
                      <div className="hidden sm:block w-1/3">
                        <img
                          src={favorite.imageUrl || "/placeholder.svg"}
                          alt={`AI-generated image for ${favorite.headline}`}
                          className="w-full h-auto rounded-md"
                        />
                      </div>
                    )}
                    <div className={favorite.imageUrl ? "w-full sm:w-2/3" : "w-full"}>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{favorite.headline}</h2>
                      <div className="text-sm text-gray-500 mb-2">
                        Celebrity: <span className="font-semibold">{favorite.celebrity}</span> • Category:{" "}
                        <span className="font-semibold capitalize">{favorite.category}</span>
                      </div>
                      <p className="text-gray-700">{favorite.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

