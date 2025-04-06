"use client"

import { useCallback } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const categories = [
  { id: "career", name: "Career News", icon: "💼" },
  { id: "relationships", name: "Relationships", icon: "💕" },
  { id: "fashion", name: "Fashion", icon: "👗" },
  { id: "scandal", name: "Scandals", icon: "🔥" },
  { id: "lifestyle", name: "Lifestyle", icon: "🏠" },
]

interface CategorySelectorProps {
  selectedCategory: string
  onChange: (category: string) => void
}

export function CategorySelector({ selectedCategory, onChange }: CategorySelectorProps) {
  // Use useCallback to memoize the onChange handler
  const handleValueChange = useCallback((value: string) => {
    if (value !== selectedCategory) {
      onChange(value)
    }
  }, [selectedCategory, onChange])

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Gossip Category</h3>
      <RadioGroup 
        defaultValue={selectedCategory} 
        onValueChange={handleValueChange} 
        className="grid grid-cols-2 gap-2 sm:grid-cols-5"
      >
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <RadioGroupItem value={category.id} id={`category-${category.id}`} />
            <Label htmlFor={`category-${category.id}`} className="flex items-center gap-1 cursor-pointer">
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

