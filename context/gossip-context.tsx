"use client"

import type React from "react"
import { createContext, useContext, useState, useMemo } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

type ThemeType = "tabloid" | "fashion" | "entertainment" | "scandal"

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
  theme: string
}

interface GossipContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  favorites: SavedGossip[]
  addFavorite: (gossip: SavedGossip) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

const GossipContext = createContext<GossipContextType | undefined>(undefined)

export function GossipProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("tabloid")
  const [favorites, setFavorites] = useLocalStorage<SavedGossip[]>("gossip-favorites", [])

  // Memoize the functions to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    const addFavorite = (gossip: SavedGossip) => {
      setFavorites((prev) => [...prev, gossip])
    }

    const removeFavorite = (id: string) => {
      setFavorites((prev) => prev.filter((item) => item.id !== id))
    }

    const isFavorite = (id: string) => {
      return favorites.some((item) => item.id === id)
    }

    return {
      theme,
      setTheme,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
    }
  }, [theme, favorites, setFavorites])

  return (
    <GossipContext.Provider value={contextValue}>
      {children}
    </GossipContext.Provider>
  )
}

export function useGossip() {
  const context = useContext(GossipContext)
  if (context === undefined) {
    throw new Error("useGossip must be used within a GossipProvider")
  }
  return context
}

