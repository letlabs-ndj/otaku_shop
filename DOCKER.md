# Docker Setup Guide

This project uses Docker Compose to run both the frontend and backend services.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

1. **Build and start the services:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode (background):**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

## Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## Volumes

The following directories are mounted as volumes to persist data:
- `./backend/data` - Product and configuration data
- `./backend/uploads` - Uploaded product images

## Environment Variables

You can customize the setup by creating a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3001
NODE_ENV=production
```

## Troubleshooting

- If ports are already in use, you can change them in `docker-compose.yml`
- To rebuild from scratch: `docker-compose down -v && docker-compose up --build`
- To view backend logs: `docker-compose logs backend`
- To view frontend logs: `docker-compose logs frontend`

