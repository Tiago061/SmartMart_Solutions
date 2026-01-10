"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"

interface CsvUploadProps {
  onSuccess: () => void
}

export function CsvUpload({ onSuccess }: CsvUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile)
      setStatus("idle")
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setStatus("idle")

    try {
      const data = await api.uploadProductsCsv(file)
      setStatus("success")
      setMessage(`Successfully imported ${Array.isArray(data) ? data.length : 0} products`)
      setFile(null)
      onSuccess()
    } catch (error) {
      console.error("Error uploading CSV:", error)
      setStatus("error")
      setMessage("Failed to upload CSV file. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border max-w-xl">
      <CardHeader>
        <CardTitle className="text-foreground">Upload CSV</CardTitle>
        <CardDescription>
          Import products from a CSV file. The file should have columns: name, price, category_id
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload" />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              {file ? (
                <>
                  <FileSpreadsheet className="h-10 w-10 text-chart-2" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Drop your CSV file here, or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-1">Supports .csv files only</p>
                  </div>
                </>
              )}
            </div>
          </label>
        </div>

        {status !== "idle" && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              status === "success" ? "bg-chart-2/10 text-chart-2" : "bg-destructive/10 text-destructive"
            }`}
          >
            {status === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span className="text-sm">{message}</span>
          </div>
        )}

        <Button onClick={handleUpload} disabled={!file || loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">CSV Format Example:</p>
          <pre className="bg-muted/50 p-3 rounded-lg text-xs overflow-x-auto">
            {`name,price,category_id
Product A,29.99,1
Product B,49.99,2
Product C,19.99,1`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
