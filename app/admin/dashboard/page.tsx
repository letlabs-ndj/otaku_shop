"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  LogOut,
  Grid3X3,
  List,
  Upload,
  ImageIcon,
  AlertTriangle,
  Server,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"
import { API_CONFIG, getStoredAuthHeader, clearCredentials, fetchFromApi, fetchProtectedApi } from "@/lib/api-config"

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "Figures",
  })

  useEffect(() => {
    const authHeader = getStoredAuthHeader()
    if (!authHeader) {
      router.push("/admin/login")
      return
    }

    // Verify with backend
    const verifyAuth = async () => {
      try {
        const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.authVerify}`, {
          headers: { Authorization: authHeader },
        })
        if (!res.ok) {
          clearCredentials()
          router.push("/admin/login")
        }
      } catch {
        setConnectionError(true)
      }
    }
    verifyAuth()
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setConnectionError(false)
        const [productsRes, categoriesRes] = await Promise.all([
          fetchFromApi(API_CONFIG.endpoints.products),
          fetchFromApi(API_CONFIG.endpoints.categories),
        ])

        if (productsRes.ok) {
          const data = await productsRes.json()
          setProducts(data.products)
        }

        if (categoriesRes.ok) {
          const cats = await categoriesRes.json()
          setCategories(cats)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setConnectionError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    clearCredentials()
    router.push("/admin/login")
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({ name: "", price: "", image: "", category: categories[0] || "Figures" })
    setImagePreview(null)
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
    })
    setImagePreview(product.image)
    setShowModal(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      const authHeader = getStoredAuthHeader()
      if (!authHeader) {
        throw new Error("Not authenticated")
      }

      const uploadFormData = new FormData()
      uploadFormData.append("image", file)

      const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.upload}`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: uploadFormData,
      })

      if (res.ok) {
        const data = await res.json()
        // Construct full URL for the image
        const imageUrl = `${API_CONFIG.baseUrl}${data.url}`
        setFormData((prev) => ({ ...prev, image: imageUrl }))
        setImagePreview(imageUrl)
      } else {
        console.error("Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingProduct) {
        await fetchProtectedApi(`${API_CONFIG.endpoints.products}/${editingProduct.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        })
      } else {
        await fetchProtectedApi(API_CONFIG.endpoints.products, {
          method: "POST",
          body: JSON.stringify(formData),
        })
      }

      setShowModal(false)
      // Refresh products
      const res = await fetchFromApi(API_CONFIG.endpoints.products)
      const data = await res.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Failed to save product:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetchProtectedApi(`${API_CONFIG.endpoints.products}/${id}`, {
        method: "DELETE",
      })
      setDeleteConfirm(null)
      // Refresh products
      const res = await fetchFromApi(API_CONFIG.endpoints.products)
      const data = await res.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md text-center">
          <Server className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Connection Error</h1>
          <p className="text-muted-foreground mb-6">
            Cannot connect to the backend server at{" "}
            <code className="bg-muted px-2 py-1 rounded">{API_CONFIG.baseUrl}</code>
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Make sure the Node.js backend is running:
            <br />
            <code className="bg-muted px-2 py-1 rounded mt-2 inline-block">cd backend && npm start</code>
          </p>
          <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
            Retry Connection
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage your products</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="flex gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-2xl font-bold text-primary">{products.length}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-2xl font-bold text-foreground">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "grid" ? "bg-card text-primary" : "text-muted-foreground",
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "list" ? "bg-card text-primary" : "text-muted-foreground",
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={openCreateModal} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No products yet</h2>
            <p className="text-muted-foreground mb-6">Start by adding your first product</p>
            <Button onClick={openCreateModal} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden group">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => openEditModal(product)}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(product.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(product)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(product.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Product Image</label>
                <div
                  className={cn(
                    "border-2 border-dashed border-border rounded-xl p-4 text-center transition-colors",
                    "hover:border-primary/50 cursor-pointer",
                  )}
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  {uploadingImage ? (
                    <div className="py-8">
                      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  ) : imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Click to change image</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload image</p>
                      <p className="text-xs text-muted-foreground/70">JPG, PNG, GIF, WebP (max 10MB)</p>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Product Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Delete Product?</h2>
              <p className="text-muted-foreground mb-6">
                This action cannot be undone. The product will be permanently removed.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
