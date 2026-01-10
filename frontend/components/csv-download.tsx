"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Package, TrendingUp } from "lucide-react"

interface CsvDownloadProps {
  products: any[]
  sales: any[]
}

export function CsvDownload({ products, sales }: CsvDownloadProps) {
  const downloadProductsCsv = () => {
    const headers = ["id", "name", "price", "category_id"]
    const rows = products.map((p: any) => [p.id, p.name, p.price, p.category_id])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    downloadFile(csvContent, "products.csv")
  }

  const downloadSalesCsv = () => {
    const headers = ["id", "product_id", "month", "quantity", "total_price"]
    const rows = sales.map((s: any) => [s.id, s.product_id, s.month, s.quantity, s.total_price])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    downloadFile(csvContent, "sales.csv")
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadProductsCsv}>
          <Package className="mr-2 h-4 w-4" />
          Products
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadSalesCsv}>
          <TrendingUp className="mr-2 h-4 w-4" />
          Sales
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
