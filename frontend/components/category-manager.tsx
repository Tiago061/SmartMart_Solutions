"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader2, Tags } from "lucide-react"
import { api } from "@/lib/api"

interface CategoryManagerProps {
  categories: any[]
  onSuccess: () => void
}

export function CategoryManager({ categories, onSuccess }: CategoryManagerProps) {
  const [loading, setLoading] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    setLoading(true)

    try {
      await api.createCategory(newCategory)
      setNewCategory("")
      onSuccess()
    } catch (error) {
      console.error("Error creating category:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border max-w-xl">
      <CardHeader>
        <CardTitle className="text-foreground">Category Management</CardTitle>
        <CardDescription>Create and manage product categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Category Form */}
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 bg-background"
          />
          <Button type="submit" disabled={loading || !newCategory.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>

        {/* Categories List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Existing Categories ({categories.length})</h4>
          <div className="grid gap-2">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No categories found. Create your first category above.
              </p>
            ) : (
              categories.map((category: any) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
                >
                  <Tags className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground flex-1">{category.name}</span>
                  <span className="text-xs text-muted-foreground">ID: {category.id}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
