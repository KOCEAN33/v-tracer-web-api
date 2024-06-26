###################
# BASE IMAGE
###################
FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

FROM base AS build
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS runner
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 8000
CMD [ "pnpm", "start:prod" ]