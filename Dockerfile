FROM node:24-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma.config.ts tsconfig.json ./
COPY prisma ./prisma
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npm ci

COPY nest-cli.json tsconfig.build.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:24-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json prisma.config.ts docker-entrypoint.sh ./

USER node
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
