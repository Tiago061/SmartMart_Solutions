"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Loader2, Pencil, Check, X } from "lucide-react"
import { api, API_BASE } from "@/lib/api"

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

interface SalesEditorProps {
  sales: any[]
  products: any[]
  onUpdate: () => void
}

export function SalesEditor({ sales, products, onUpdate }: SalesEditorProps) {
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState({ quantity: "", total_price: "" })
  const [formData, setFormData] = useState({
    product_id: "",
    month: "",
    quantity: "",
    total_price: "",
  })

  const getProductName = (productId: number) => {
    const product = products.find((p: any) => p.id === productId)
    return product?.name || "Unknown"
  }

  const getMonthName = (month: number) => {
    return MONTHS.find((m) => m.value === month.toString())?.label || "Unknown"
  }

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.createSale({
        product_id: Number.parseInt(formData.product_id),
        month: Number.parseInt(formData.month),
        quantity: Number.parseInt(formData.quantity),
        total_price: Number.parseFloat(formData.total_price),
      })
      setFormData({ product_id: "", month: "", quantity: "", total_price: "" })
      onUpdate()
    } catch (error) {
      console.error("Error creating sale:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (sale: any) => {
    setEditingId(sale.id)
    setEditValues({
      quantity: sale.quantity.toString(),
      total_price: sale.total_price.toString(),
    })
  }

  const handleSave = async (id: number) => {
    try {
      await fetch(`${API_BASE}/sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: Number.parseInt(editValues.quantity),
          total_price: Number.parseFloat(editValues.total_price),
        }),
      })
      setEditingId(null)
      onUpdate()
    } catch (error) {
      console.error("Error updating sale:", error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({ quantity: "", total_price: "" })
  }

  return (
    <div className="space-y-6">
      {/* Add Sale Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Add New Sale</CardTitle>
          <CardDescription>Record a new sale for a product</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSale} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label className="text-foreground">Product</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => setFormData({ ...formData, product_id: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product: any) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Month</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Quantity</Label>
              <Input
                type="number"
                min="1"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Total Price</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.total_price}
                onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                className="bg-background"
              />
            </div>

            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sale
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Sales Records</CardTitle>
          <CardDescription>View and edit sales data by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Product</TableHead>
                  <TableHead className="text-muted-foreground">Month</TableHead>
                  <TableHead className="text-muted-foreground">Quantity</TableHead>
                  <TableHead className="text-muted-foreground">Total Price</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No sales records found. Add a sale above.
                    </TableCell>
                  </TableRow>
                ) : (
                  sales.map((sale: any) => (
                    <TableRow key={sale.id} className="border-border">
                      <TableCell className="text-foreground font-medium">{sale.id}</TableCell>
                      <TableCell className="text-foreground">{getProductName(sale.product_id)}</TableCell>
                      <TableCell className="text-foreground">{getMonthName(sale.month)}</TableCell>
                      <TableCell>
                        {editingId === sale.id ? (
                          <Input
                            type="number"
                            value={editValues.quantity}
                            onChange={(e) => setEditValues({ ...editValues, quantity: e.target.value })}
                            className="h-8 w-20"
                          />
                        ) : (
                          <span className="text-foreground">{sale.quantity}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === sale.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editValues.total_price}
                            onChange={(e) => setEditValues({ ...editValues, total_price: e.target.value })}
                            className="h-8 w-24"
                          />
                        ) : (
                          <span className="text-foreground">${sale.total_price.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === sale.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSave(sale.id)}>
                              <Check className="h-4 w-4 text-chart-2" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancel}>
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(sale)}>
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
    </div>
  )
}
