"use client"

import { useCallback } from "react"
import { useGossip } from "@/context/gossip-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"

const themes = [
  { id: "tabloid", name: "Tabloid", icon: "📰" },
  { id: "fashion", name: "Fashion", icon: "👗" },
  { id: "entertainment", name: "Entertainment", icon: "🎬" },
  { id: "scandal", name: "Scandal", icon: "🔥" },
]

export function ThemeSelector() {
  const { theme, setTheme } = useGossip()
  
  // Memoize the theme setter to prevent re-renders
  const handleSetTheme = useCallback((newTheme: string) => {
    if (newTheme !== theme) {
      setTheme(newTheme as any)
    }
  }, [theme, setTheme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span>Theme: {themes.find((t) => t.id === theme)?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => handleSetTheme(t.id)}
            className={theme === t.id ? "bg-accent" : ""}
          >
            <span className="mr-2">{t.icon}</span>
            {t.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

