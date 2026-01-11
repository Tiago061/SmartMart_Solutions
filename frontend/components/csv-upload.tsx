"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"

type ImportType = "products" | "categories" | "sales"

export function CsvUpload({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [importType, setImportType] = useState<ImportType>("products")

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setStatus("idle")

    try {
      let data;
      // Direciona para o endpoint correto da sua LIB/API.ts
      if (importType === "products") data = await api.uploadProductsCsv(file)
      else if (importType === "categories") data = await api.uploadCategoriesCsv(file)
      else data = await api.uploadSalesCsv(file)

      setStatus("success")
      setMessage(`Importado com sucesso!`)
      setFile(null)
      onSuccess()
    } catch (error) {
      setStatus("error")
      setMessage("Erro ao processar CSV. Verifique as colunas e o servidor.")
    } finally {
      setLoading(false)
    }
  }

  // Exemplos de formato para ajudar o usuário
  const examples = {
    products: "name,price,category_id\nTV,1500.00,1",
    categories: "name\nEletrônicos\nCozinha",
    sales: "product_id,quantity,total_price,date\n1,2,3000.00,2025-01-10"
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Importar Dados via CSV</CardTitle>
        <CardDescription>Selecione o tipo de dado e envie o arquivo correspondente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <Tabs value={importType} onValueChange={(v) => setImportType(v as ImportType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="csv-upload" />
          <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-2">
            {file ? <FileSpreadsheet className="h-8 w-8 text-green-500" /> : <Upload className="h-8 w-8 text-muted-foreground" />}
            <span className="text-sm font-medium">{file ? file.name : "Clique para selecionar o CSV"}</span>
          </label>
        </div>

        {status !== "idle" && (
          <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${status === "success" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
            {status === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message}
          </div>
        )}

        <Button onClick={handleUpload} disabled={!file || loading} className="w-full">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 h-4 w-4" />}
          Iniciar Importação de {importType === 'products' ? 'Produtos' : importType === 'sales' ? 'Vendas' : 'Categorias'}
        </Button>

        <div className="text-[10px] text-muted-foreground bg-muted p-2 rounded">
          <p className="font-bold uppercase mb-1">Formato esperado:</p>
          <pre>{examples[importType]}</pre>
        </div>
      </CardContent>
    </Card>
  )
}