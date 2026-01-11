export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export const api = {
  // Products
  getProducts: () => fetch(`${API_BASE}/products/`).then((res) => res.json()),
  createProduct: (data: { name: string; price: number; category_id: number }) =>
    fetch(`${API_BASE}/products/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  uploadProductsCsv: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return fetch(`${API_BASE}/products/upload-csv`, {
      method: "POST",
      body: formData,
    }).then((res) => res.json())
  },

  // Categories
  getCategories: () => fetch(`${API_BASE}/categories/`).then((res) => res.json()),
  createCategory: (name: string) =>
    fetch(`${API_BASE}/categories/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((res) => res.json()),
  uploadCategoriesCsv: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return fetch(`${API_BASE}/categories/upload-csv`, {
      method: "POST",
      body: formData,
    }).then((res) => res.json())
  },

  // Sales
  getSales: () => fetch(`${API_BASE}/sales/`).then((res) => res.json()),
  createSale: (data: { product_id: number; quantity: number; total_price: number; date: string }) =>
    fetch(`${API_BASE}/sales/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  uploadSalesCsv: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return fetch(`${API_BASE}/sales/upload-csv`, {
      method: "POST",
      body: formData,
    }).then((res) => res.json())
  },
}
