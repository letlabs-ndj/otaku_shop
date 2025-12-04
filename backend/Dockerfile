# Backend Dockerfile
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p data uploads

EXPOSE 3001

CMD ["node", "server.js"]

