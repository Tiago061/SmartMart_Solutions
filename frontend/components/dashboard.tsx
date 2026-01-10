"use client"

import { useState } from "react"
import useSWR from "swr"
import { SalesChart } from "@/components/charts/sales-chart"
import { ProfitChart } from "@/components/charts/profit-chart"
import { ProductsTable } from "@/components/products-table"
import { ProductForm } from "@/components/product-form"
import { CsvUpload } from "@/components/csv-upload"
import { CategoryManager } from "@/components/category-manager"
import { StatsCards } from "@/components/stats-cards"
import { CategoryFilter } from "@/components/category-filter"
import { CsvDownload } from "@/components/csv-download"
import { SalesEditor } from "@/components/sales-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API_BASE, fetcher } from "@/lib/api"

export function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const { data: productsData, mutate: mutateProducts } = useSWR(`${API_BASE}/products/`, fetcher)
  const { data: categoriesData, mutate: mutateCategories } = useSWR(`${API_BASE}/categories/`, fetcher)
  const { data: salesData, mutate: mutateSales } = useSWR(`${API_BASE}/sales/`, fetcher)

  const products = productsData || []
  const categories = categoriesData || []
  const sales = salesData?.sales || []
  const totalProfit = salesData?.total_profit || 0

  const filteredProducts = selectedCategory ? products.filter((p: any) => p.category_id === selectedCategory) : products

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your products, sales, and categories</p>
        </div>
        <div className="flex items-center gap-3">
          <CsvDownload products={products} sales={sales} />
        </div>
      </div>

      {/* Stats */}
      <StatsCards products={products} sales={sales} totalProfit={totalProfit} categories={categories} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2" id="dashboard">
        <SalesChart sales={sales} />
        <ProfitChart sales={sales} />
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add-product">Add Product</TabsTrigger>
          <TabsTrigger value="upload-csv">Upload CSV</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="sales">Edit Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4" id="products">
          <div className="flex items-center gap-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          <ProductsTable products={filteredProducts} categories={categories} onUpdate={mutateProducts} />
        </TabsContent>

        <TabsContent value="add-product">
          <ProductForm categories={categories} onSuccess={mutateProducts} />
        </TabsContent>

        <TabsContent value="upload-csv">
          <CsvUpload onSuccess={mutateProducts} />
        </TabsContent>

        <TabsContent value="categories" id="categories">
          <CategoryManager categories={categories} onSuccess={mutateCategories} />
        </TabsContent>

        <TabsContent value="sales" id="sales">
          <SalesEditor sales={sales} products={products} onUpdate={mutateSales} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
