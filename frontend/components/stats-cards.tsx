import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, TrendingUp, Tags } from "lucide-react"

interface StatsCardsProps {
  products: any[]
  sales: any[]
  totalProfit: number
  categories: any[]
}

export function StatsCards({ products, sales, totalProfit, categories }: StatsCardsProps) {
  const totalQuantity = sales.reduce((acc: number, sale: any) => acc + sale.quantity, 0)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          <Package className="h-4 w-4 text-chart-1" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{products.length}</div>
          <p className="text-xs text-muted-foreground mt-1">registered products</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
          <DollarSign className="h-4 w-4 text-chart-2" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">from all sales</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Units Sold</CardTitle>
          <TrendingUp className="h-4 w-4 text-chart-3" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalQuantity.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">total quantity</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
          <Tags className="h-4 w-4 text-chart-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{categories.length}</div>
          <p className="text-xs text-muted-foreground mt-1">product categories</p>
        </CardContent>
      </Card>
    </div>
  )
}
