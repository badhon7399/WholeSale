# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

# Create uploads dir for temporary uploads
RUN mkdir -p uploads && chown -R node:node /app

USER node
ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]
