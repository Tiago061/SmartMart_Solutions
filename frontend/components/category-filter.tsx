"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: any[]
  selectedCategory: number | null
  onSelectCategory: (categoryId: number | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Filter by:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSelectCategory(null)}
        className={cn("h-8", selectedCategory === null && "bg-primary text-primary-foreground hover:bg-primary/90")}
      >
        All
      </Button>
      {categories.map((category: any) => (
        <Button
          key={category.id}
          variant="outline"
          size="sm"
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "h-8",
            selectedCategory === category.id && "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
