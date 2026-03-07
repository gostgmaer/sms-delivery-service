# ── Build stage ───────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── Runtime stage ─────────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy production deps and source
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Non-root user for security
RUN addgroup -S smsapp && adduser -S smsapp -G smsapp
USER smsapp

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/v1/health || exit 1

CMD ["node", "index.js"]
