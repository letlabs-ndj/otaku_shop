# Entre Nous Otakus - Backend API

A Node.js Express backend for the Otaku Shop application.

## Setup

1. Navigate to the backend folder:
   \`\`\`bash
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

   Or for development with auto-reload:
   \`\`\`bash
   npm run dev
   \`\`\`

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get a single product |
| GET | `/api/categories` | Get all categories |

### Protected Endpoints (Basic Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/verify` | Verify admin credentials |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| POST | `/api/upload` | Upload an image |
| POST | `/api/categories` | Add a new category |

## Authentication

Protected endpoints require Basic Authentication header:

\`\`\`
Authorization: Basic base64(username:password)
\`\`\`

Default credentials:
- Username: `admin`
- Password: `otaku2024`

## Data Storage

- Products are stored in `data/products.json`
- Admin config is stored in `data/config.json`
- Uploaded images are stored in `uploads/`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Server port |
