import express from "express"
import cors from "cors"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import multer from "multer"
import { sendNewProductNotification } from "./utils/email.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Ensure directories exist
const dataDir = path.join(__dirname, "data")
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

// Database file paths
const productsFile = path.join(dataDir, "products.json")
const configFile = path.join(dataDir, "config.json")
const subscribersFile = path.join(dataDir, "subscribers.json")

// Initialize data files if they don't exist
const defaultProducts = {
  products: [
    {
      id: 1,
      name: "Demon Slayer Tanjiro Figure",
      price: 89.99,
      image: "/uploads/placeholder.jpg",
      category: "Figures",
    },
    { id: 2, name: "Attack on Titan Hoodie", price: 65.0, image: "/uploads/placeholder.jpg", category: "Apparel" },
    {
      id: 3,
      name: "Naruto Shippuden Manga Box Set",
      price: 199.99,
      image: "/uploads/placeholder.jpg",
      category: "Manga",
    },
    { id: 4, name: "Jujutsu Kaisen Gojo Figure", price: 125.0, image: "/uploads/placeholder.jpg", category: "Figures" },
  ],
  categories: ["Figures", "Apparel", "Manga", "Posters", "Accessories", "Plush"],
}

const defaultConfig = {
  admin: {
    username: "admin",
    password: "otaku2024",
  },
}

if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(productsFile, JSON.stringify(defaultProducts, null, 2))
}
if (!fs.existsSync(configFile)) {
  fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2))
}
if (!fs.existsSync(subscribersFile)) {
  fs.writeFileSync(subscribersFile, JSON.stringify({ subscribers: [] }, null, 2))
}

// Helper functions
const readProducts = () => {
  try {
    const data = fs.readFileSync(productsFile, "utf8")
    return JSON.parse(data)
  } catch {
    return defaultProducts
  }
}

const writeProducts = (data) => {
  fs.writeFileSync(productsFile, JSON.stringify(data, null, 2))
}

const readConfig = () => {
  try {
    const data = fs.readFileSync(configFile, "utf8")
    return JSON.parse(data)
  } catch {
    return defaultConfig
  }
}

// Subscribers helper functions
const readSubscribers = () => {
  try {
    const data = fs.readFileSync(subscribersFile, "utf8")
    return JSON.parse(data)
  } catch {
    return { subscribers: [] }
  }
}

const writeSubscribers = (data) => {
  fs.writeFileSync(subscribersFile, JSON.stringify(data, null, 2))
}

// Basic Auth Middleware
const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin Area"')
    return res.status(401).json({ error: "Authentication required" })
  }

  const base64Credentials = authHeader.split(" ")[1]
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf8")
  const [username, password] = credentials.split(":")

  const config = readConfig()

  if (username === config.admin.username && password === config.admin.password) {
    next()
  } else {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin Area"')
    return res.status(401).json({ error: "Invalid credentials" })
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `product-${uniqueSuffix}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, GIF and WebP are allowed."))
    }
  },
})

// ==================== PUBLIC ROUTES ====================

// GET all products (public)
app.get("/api/products", (req, res) => {
  const data = readProducts()
  res.json(data)
})

// GET single product (public)
app.get("/api/products/:id", (req, res) => {
  const data = readProducts()
  const product = data.products.find((p) => p.id === Number.parseInt(req.params.id))

  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }

  res.json(product)
})

// GET categories (public)
app.get("/api/categories", (req, res) => {
  const data = readProducts()
  res.json(data.categories)
})

// POST newsletter subscription (public)
app.post("/api/newsletter/subscribe", (req, res) => {
  const { email } = req.body

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" })
  }

  const subscribersData = readSubscribers()
  const emailLower = email.toLowerCase().trim()

  // Check if email already exists
  if (subscribersData.subscribers.includes(emailLower)) {
    return res.status(200).json({ 
      success: true, 
      message: "Email already subscribed",
      alreadySubscribed: true 
    })
  }

  // Add new subscriber
  subscribersData.subscribers.push(emailLower)
  writeSubscribers(subscribersData)

  console.log(`✅ New newsletter subscriber: ${emailLower}`)

  res.status(201).json({ 
    success: true, 
    message: "Successfully subscribed to newsletter",
    alreadySubscribed: false 
  })
})

// ==================== PROTECTED ROUTES (Basic Auth) ====================

// Verify auth (for frontend to check if credentials are valid)
app.get("/api/auth/verify", basicAuth, (req, res) => {
  res.json({ success: true, message: "Authenticated" })
})

// CREATE product
app.post("/api/products", basicAuth, (req, res) => {
  const data = readProducts()
  const { name, price, image, category } = req.body

  if (!name || !price || !category) {
    return res.status(400).json({ error: "Name, price and category are required" })
  }

  const newProduct = {
    id: data.products.length > 0 ? Math.max(...data.products.map((p) => p.id)) + 1 : 1,
    name,
    price: Number.parseFloat(price),
    image: image || "/uploads/placeholder.jpg",
    category,
  }

  data.products.push(newProduct)
  writeProducts(data)

  // Send email notifications to all subscribers
  const subscribersData = readSubscribers()
  if (subscribersData.subscribers && subscribersData.subscribers.length > 0) {
    sendNewProductNotification(newProduct, subscribersData.subscribers)
      .then((result) => {
        console.log(`📧 Email notifications sent: ${result.sent} successful, ${result.failed} failed`)
      })
      .catch((error) => {
        console.error("Error sending email notifications:", error)
      })
  }

  res.status(201).json(newProduct)
})

// UPDATE product
app.put("/api/products/:id", basicAuth, (req, res) => {
  const data = readProducts()
  const productIndex = data.products.findIndex((p) => p.id === Number.parseInt(req.params.id))

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" })
  }

  const { name, price, image, category } = req.body

  data.products[productIndex] = {
    ...data.products[productIndex],
    name: name || data.products[productIndex].name,
    price: price !== undefined ? Number.parseFloat(price) : data.products[productIndex].price,
    image: image || data.products[productIndex].image,
    category: category || data.products[productIndex].category,
  }

  writeProducts(data)
  res.json(data.products[productIndex])
})

// DELETE product
app.delete("/api/products/:id", basicAuth, (req, res) => {
  const data = readProducts()
  const productIndex = data.products.findIndex((p) => p.id === Number.parseInt(req.params.id))

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" })
  }

  const deleted = data.products.splice(productIndex, 1)
  writeProducts(data)

  res.json({ success: true, deleted: deleted[0] })
})

// Upload image
app.post("/api/upload", basicAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ url: imageUrl })
})

// Add new category
app.post("/api/categories", basicAuth, (req, res) => {
  const data = readProducts()
  const { category } = req.body

  if (!category) {
    return res.status(400).json({ error: "Category name is required" })
  }

  if (!data.categories.includes(category)) {
    data.categories.push(category)
    writeProducts(data)
  }

  res.json(data.categories)
})

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎌 Entre Nous Otakus - Backend Server                   ║
║                                                           ║
║   Server running on: http://localhost:${PORT}               ║
║                                                           ║
║   Public Endpoints:                                       ║
║   - GET  /api/products      - List all products           ║
║   - GET  /api/products/:id  - Get single product          ║
║   - GET  /api/categories    - List categories             ║
║   - POST /api/newsletter/subscribe - Subscribe to newsletter ║
║                                                           ║
║   Protected Endpoints (Basic Auth Required):              ║
║   - GET  /api/auth/verify   - Verify credentials          ║
║   - POST /api/products      - Create product              ║
║   - PUT  /api/products/:id  - Update product              ║
║   - DELETE /api/products/:id - Delete product             ║
║   - POST /api/upload        - Upload image                ║
║   - POST /api/categories    - Add category                ║
║                                                           ║
║   Default Admin: admin / otaku2024                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `)
})
