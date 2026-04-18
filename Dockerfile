FROM node:22-alpine AS builder

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY lib/db/package.json ./lib/db/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/nour-academy/package.json ./artifacts/nour-academy/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @workspace/nour-academy run build
RUN pnpm --filter @workspace/api-server run build

FROM node:22-alpine AS runner

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY lib/db/package.json ./lib/db/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/nour-academy/package.json ./artifacts/nour-academy/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/nour-academy/dist ./artifacts/nour-academy/dist
COPY --from=builder /app/lib/db/drizzle ./lib/db/drizzle

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
