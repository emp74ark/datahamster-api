FROM node:22-slim as builder
RUN corepack enable
WORKDIR /app
COPY package*.json .
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:22-slim
RUN corepack enable
WORKDIR /app
COPY package*.json .
RUN pnpm install --prod
COPY --from=builder /app/dist ./dist
EXPOSE 3700
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
