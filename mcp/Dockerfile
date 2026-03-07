FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json ./
COPY src/ ./src/
RUN npx tsc

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

ENV MCP_TRANSPORT=http
ENV MCP_PORT=3102
ENV MCP_HOST=0.0.0.0

EXPOSE 3102

CMD ["node", "dist/index.js"]
