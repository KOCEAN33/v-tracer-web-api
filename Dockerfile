###################
# BASE IMAGE
###################
FROM node:20-slim As base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app


###################
# BUILD FOR PRODUCTION
###################
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

###################
# PRODUCTION
###################
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 8000
CMD [ "pnpm", "start:prod" ]

# COMMAND FOR DOCKER BUILD (LINUX & UNIX)
# DOCKER_BUILDKIT=1 docker build -t tries .

# COMMAND FOR WINDOWS
# docker build -t tries .
# docker build --tag koceanm/tries:api-0.0.1 .
# docker push koceanm/tries:api-0.0.1