"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Check, X } from "lucide-react"
import { API_BASE } from "@/lib/api"

interface ProductsTableProps {
  products: any[]
  categories: any[]
  onUpdate: () => void
}

export function ProductsTable({ products, categories, onUpdate }: ProductsTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState({ name: "", price: "" })

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c: any) => c.id === categoryId)
    return category?.name || "Unknown"
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setEditValues({ name: product.name, price: product.price.toString() })
  }

  const handleSave = async (id: number) => {
    try {
      await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editValues.name,
          price: Number.parseFloat(editValues.price),
        }),
      })
      setEditingId(null)
      onUpdate()
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({ name: "", price: "" })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Products List</CardTitle>
        <CardDescription>Manage your product inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No products found. Add a product or upload a CSV file.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => (
                  <TableRow key={product.id} className="border-border">
                    <TableCell className="text-foreground font-medium">{product.id}</TableCell>
                    <TableCell>
                      {editingId === product.id ? (
                        <Input
                          value={editValues.name}
                          onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                          className="h-8 w-full max-w-[200px]"
                        />
                      ) : (
                        <span className="text-foreground">{product.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === product.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editValues.price}
                          onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                          className="h-8 w-24"
                        />
                      ) : (
                        <span className="text-foreground">${product.price.toFixed(2)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                        {getCategoryName(product.category_id)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === product.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleSave(product.id)}
                          >
                            <Check className="h-4 w-4 text-chart-2" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancel}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
